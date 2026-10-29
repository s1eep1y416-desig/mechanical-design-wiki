// Quasi-static teaching models. Inputs use N, mm, MPa and degrees.
export function springModel({
  wire = 5,
  diameter = 45,
  coils = 8,
  shearModulus = 79000,
  compression = 20,
} = {}) {
  if (
    wire <= 0 ||
    diameter <= wire ||
    coils <= 0 ||
    shearModulus <= 0 ||
    compression < 0
  )
    throw new RangeError("Invalid spring geometry");
  const stiffness = (shearModulus * wire ** 4) / (8 * diameter ** 3 * coils);
  return {
    stiffness,
    force: stiffness * compression,
    compression,
    wire,
    diameter,
    coils,
  };
}
export function gearForces({
  module = 4,
  teeth = 30,
  torque = 80,
  helix = 0,
  pressure = 20,
} = {}) {
  if (
    module <= 0 ||
    !Number.isInteger(teeth) ||
    teeth < 17 ||
    torque < 0 ||
    Math.abs(helix) >= 45 ||
    pressure <= 0 ||
    pressure >= 45
  )
    throw new RangeError("Invalid gear model input");
  const beta = (helix * Math.PI) / 180,
    alpha = (pressure * Math.PI) / 180;
  const diameter = (module * teeth) / Math.cos(beta),
    tangential = (2 * torque * 1000) / diameter,
    radial = (tangential * Math.tan(alpha)) / Math.cos(beta),
    axial = tangential * Math.tan(beta);
  return {
    diameter,
    tangential,
    radial,
    axial,
    normal: Math.hypot(tangential, radial, axial),
  };
}
export function shaftEquivalent({ diameter, moment, torque, alpha = 0.6 }) {
  const W = (Math.PI * diameter ** 3) / 32,
    WT = 2 * W,
    bending = moment / W,
    shear = torque / WT;
  return {
    W,
    WT,
    bending,
    shear,
    third: Math.hypot(bending, 2 * alpha * shear),
    fourth: Math.hypot(bending, Math.sqrt(3) * alpha * shear),
  };
}

export function boltJointModel({
  preload = 15000,
  workLoad = 10000,
  boltStiffness = 1,
  memberStiffness = 4,
} = {}) {
  if (preload < 0 || workLoad < 0 || boltStiffness <= 0 || memberStiffness <= 0)
    throw new RangeError("Invalid bolt-joint input");
  const loadFraction = boltStiffness / (boltStiffness + memberStiffness);
  const preSeparationBoltLoad = preload + loadFraction * workLoad;
  const residual = preload - (1 - loadFraction) * workLoad;
  const separationLoad = preload / (1 - loadFraction);
  const separated = residual <= 0;
  return {
    loadFraction,
    boltLoad: separated ? workLoad : preSeparationBoltLoad,
    residual: Math.max(0, residual),
    separationLoad,
    separated,
  };
}

export function bearingLifeModel({
  dynamicRating = 30,
  equivalentLoad = 5,
  speed = 1500,
  exponent = 3,
} = {}) {
  if (dynamicRating <= 0 || equivalentLoad <= 0 || speed <= 0 || exponent <= 0)
    throw new RangeError("Invalid bearing-life input");
  const millionRevolutions = (dynamicRating / equivalentLoad) ** exponent;
  const hours = (1e6 / (60 * speed)) * millionRevolutions;
  return { millionRevolutions, hours };
}

export function beltForceModel({
  power = 5.5,
  speed = 12,
  friction = 0.3,
  wrap = 165,
} = {}) {
  if (power <= 0 || speed <= 0 || friction <= 0 || wrap <= 0 || wrap >= 360)
    throw new RangeError("Invalid belt-force input");
  const effective = (1000 * power) / speed;
  const ratio = Math.exp((friction * (wrap * Math.PI)) / 180);
  const slack = effective / (ratio - 1);
  const tight = slack + effective;
  return { effective, ratio, slack, tight, radial: tight + slack };
}
