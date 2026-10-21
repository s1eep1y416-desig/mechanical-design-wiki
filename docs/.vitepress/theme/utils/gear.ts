/**
 * Generate a stylized involute-ish gear outline as an SVG path.
 * This is a technical illustration, not a manufacturing profile.
 */
export function gearPath(
  cx: number,
  cy: number,
  teeth: number,
  pitchRadius: number,
  toothHeight: number,
  toothWidth = 0.28
): string {
  const step = (Math.PI * 2) / teeth
  const tip = pitchRadius + toothHeight
  const root = pitchRadius - toothHeight * 1.12
  const half = Math.min(0.34, Math.max(0.18, toothWidth / 2))
  const pts: string[] = []

  for (let i = 0; i < teeth; i++) {
    const a = i * step
    const profile: Array<[number, number]> = [
      [a - step * 0.5, root],
      [a - step * half, root],
      [a - step * half * 0.72, tip],
      [a + step * half * 0.72, tip],
      [a + step * half, root],
      [a + step * 0.5, root]
    ]
    for (const [angle, radius] of profile) {
      const x = cx + Math.cos(angle) * radius
      const y = cy + Math.sin(angle) * radius
      pts.push(`${x.toFixed(2)} ${y.toFixed(2)}`)
    }
  }

  return `M${pts.join('L')}Z`
}

/**
 * Unshifted external spur gear for explanatory drawings (20° pressure angle).
 * Flanks are sampled involutes; the dedendum joins are simplified, without
 * manufacturing fillets or an undercut simulation. All lengths are SVG units.
 */
export function involuteGearPath(
  cx: number,
  cy: number,
  teeth: number,
  pitchRadius: number,
  phase = 0
): string {
  const module = (2 * pitchRadius) / teeth
  const pressureAngle = (20 * Math.PI) / 180
  const base = pitchRadius * Math.cos(pressureAngle)
  const tip = pitchRadius + module
  const root = pitchRadius - 1.25 * module
  const start = Math.max(base, root)
  const pitch = (2 * Math.PI) / teeth
  const inv = (r: number) => {
    const angle = Math.acos(Math.min(1, base / r))
    return Math.tan(angle) - angle
  }
  // A little backlash keeps the two outlines visually distinct at the pitch point.
  const halfWidth = (r: number) => Math.PI / (2 * teeth) * 0.97 + inv(pitchRadius) - inv(r)
  const point = (r: number, angle: number) =>
    `${(cx + r * Math.cos(angle)).toFixed(3)} ${(cy + r * Math.sin(angle)).toFixed(3)}`
  const parts: string[] = []

  for (let tooth = 0; tooth < teeth; tooth++) {
    const angle = phase + tooth * pitch
    const leftRoot = angle - halfWidth(start)
    parts.push(`${tooth ? 'L' : 'M'}${point(root, leftRoot)}`)
    for (let step = 0; step <= 8; step++) {
      const r = start + (tip - start) * step / 8
      parts.push(`L${point(r, angle - halfWidth(r))}`)
    }
    parts.push(`A${tip} ${tip} 0 0 1 ${point(tip, angle + halfWidth(tip))}`)
    for (let step = 8; step >= 0; step--) {
      const r = start + (tip - start) * step / 8
      parts.push(`L${point(r, angle + halfWidth(r))}`)
    }
    parts.push(`L${point(root, angle + halfWidth(start))}`)
    parts.push(`A${root} ${root} 0 0 1 ${point(root, angle + pitch - halfWidth(start))}`)
  }
  return parts.join(' ') + 'Z'
}
