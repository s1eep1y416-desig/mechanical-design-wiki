<script setup lang="ts">
import { nextTick, onMounted, onUnmounted } from 'vue'
import { onContentUpdated } from 'vitepress'

let headings: HTMLElement[] = []
let links = new Map<string, HTMLAnchorElement>()
let current: HTMLAnchorElement | undefined
let frame = 0
let mounted = false
let resizeObserver: ResizeObserver | undefined
const normalizedPath = (path: string) => decodeURI(path).replace(/(?:index)?\.html$/, '').replace(/\/$/, '')

async function select(link?: HTMLAnchorElement) {
  if (link === current && (!link || link.closest('.VPSidebarItem')?.classList.contains('is-reading'))) return
  current?.closest('.VPSidebarItem')?.classList.remove('is-reading')
  current?.removeAttribute('aria-current')
  current = link
  const sidebar = document.querySelector<HTMLElement>('.VPSidebar')
  sidebar?.classList.toggle('has-reading-section', !!link)
  if (!link) return
  link.setAttribute('aria-current', 'location')
  link.closest('.VPSidebarItem')?.classList.add('is-reading')

  // Use the existing controls so Vue retains ownership of the collapsed state.
  // A reader can still collapse a branch; the next section change reveals it again.
  let branch = link.closest('.VPSidebarItem')
  while (branch) {
    if (branch.classList.contains('collapsed')) {
      branch.querySelector<HTMLElement>(':scope > .item > .caret')?.click()
    }
    branch = branch.parentElement?.closest('.VPSidebarItem') ?? null
  }
  await nextTick()
  if (current !== link || !sidebar) return
  // Scroll only the navigation pane, never the document or the browser history.
  const row = link.getBoundingClientRect()
  const pane = sidebar.getBoundingClientRect()
  const top = pane.top + 90
  const bottom = pane.bottom - 36
  if (row.top < top || row.bottom > bottom) {
    sidebar.scrollTop += row.top - top - Math.max(0, (bottom - top - row.height) / 3)
  }
}

function update() {
  frame = 0
  const navHeight = document.querySelector('.VPNavBar')?.getBoundingClientRect().height ?? 64
  const offset = navHeight + 44
  let id = ''
  for (const heading of headings) {
    if (heading.getBoundingClientRect().top > offset) break
    id = heading.id
  }
  if (headings.length && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) {
    id = headings[headings.length - 1].id
  }
  void select(links.get(id))
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(update)
}

async function collect() {
  if (!mounted) return
  await nextTick()
  void select(undefined)
  const path = normalizedPath(window.location.pathname)
  links = new Map()
  document.querySelectorAll<HTMLAnchorElement>('.VPSidebar a[href*="#"]').forEach(link => {
    const url = new URL(link.href)
    if (url.origin === location.origin && normalizedPath(url.pathname) === path) {
      links.set(decodeURIComponent(url.hash.slice(1)), link)
    }
  })
  headings = Array.from(document.querySelectorAll<HTMLElement>('.vp-doc h2[id], .vp-doc h3[id]'))
    .filter(heading => links.has(heading.id))
  resizeObserver?.disconnect()
  const content = document.querySelector('.vp-doc')
  if (content) resizeObserver?.observe(content)
  schedule()
}

onContentUpdated(collect)
onMounted(() => {
  mounted = true
  resizeObserver = new ResizeObserver(schedule)
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule, { passive: true })
  window.addEventListener('hashchange', collect)
  void collect()
})
onUnmounted(() => {
  mounted = false
  cancelAnimationFrame(frame)
  resizeObserver?.disconnect()
  window.removeEventListener('scroll', schedule)
  window.removeEventListener('resize', schedule)
  window.removeEventListener('hashchange', collect)
  void select(undefined)
})
</script>

<template><span hidden aria-hidden="true" /></template>

<style>
.VPSidebar.has-reading-section .VPSidebarItem.is-active:not(.is-reading) > .item { background: transparent; }
.VPSidebar.has-reading-section .VPSidebarItem.is-active:not(.is-reading) > .item > .link > .text { color: var(--vp-c-text-2); font-weight: 500; }
.VPSidebar .VPSidebarItem.is-reading > .item { background: var(--vp-c-brand-soft); box-shadow: inset 2px 0 var(--vp-c-brand-1); }
.VPSidebar .VPSidebarItem.is-reading > .item > .link > .text { color: var(--vp-c-brand-1); font-weight: 650; }
</style>
