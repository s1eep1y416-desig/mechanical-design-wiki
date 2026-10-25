// Export the existing 8 force diagrams and 11 curves from their Vue source,
// keeping the gallery thumbnails and downloadable assets in sync with the lessons.
import { createServer } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSSRApp } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { readFile,writeFile } from 'node:fs/promises'
import { illustrations } from '../docs/.vitepress/data/illustrations.mjs'
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')
const server=await createServer({configFile:false,plugins:[vue()],server:{middlewareMode:true},appType:'custom',optimizeDeps:{noDiscovery:true,include:[]}})
try {
 for(const kind of ['force','curve']){
  const name=kind==='force'?'ForceDiagram':'CurveChart'
  const component=(await server.ssrLoadModule('/docs/.vitepress/theme/components/'+name+'.vue')).default
  const source=await readFile(new URL('../docs/.vitepress/theme/components/'+name+'.vue',import.meta.url),'utf8')
  const css=source.match(/<style scoped>([\s\S]*?)<\/style>/)[1].replace(/:global\([^)]*\)[^{]+\{[^}]+\}/g,'').replace(/@media[\s\S]*/,'').trim()
  for(const meta of illustrations.filter(f=>f.kind===kind)){
   const html=await renderToString(createSSRApp(component,{type:meta.type}));const inner=html.match(/<svg\b[^>]*>([\s\S]*?)<\/svg>/)[1].replace(/\sdata-v-[a-f0-9]+(?=[ >])/g,'')
   const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="600" viewBox="0 0 1000 600" role="img" aria-label="${escape(meta.title)}"><title>${escape(meta.title)}</title><style>:root{--vp-c-text-1:#203b50;--vp-c-text-2:#526879;--vp-c-text-3:#647b8e;--vp-c-bg:#fff;--vp-c-bg-soft:#f3f7fa;--vp-c-divider:#dbe5ed;--vp-c-brand-1:#176cc4;--vp-c-brand-soft:#dfeaf6;--vp-font-family-base:'PingFang SC','Microsoft YaHei',sans-serif;--vp-font-family-mono:ui-monospace,monospace;color:#203b50} ${css}\nsvg text{font-family:'PingFang SC','Microsoft YaHei',sans-serif} .asset-title{font-size:27px;font-weight:700;fill:#203b50}.asset-footer{font-size:15px;fill:#526879}</style><rect width="1000" height="600" rx="16" fill="white"/><text x="40" y="65" class="asset-title">${escape(meta.title)}</text><g class="${kind==='force'?'force-diagram':'curve-chart'}" transform="translate(104 110) scale(1.1)">${inner}</g><text x="40" y="575" class="asset-footer">教学示意 · 请结合对应章节中的模型假设、单位与适用条件阅读</text></svg>\n`
   const target=new URL('../docs/public/figures/'+meta.id+'.svg',import.meta.url)
   if(process.argv.includes('--check')){if(await readFile(target,'utf8')!==svg)throw new Error('Outdated export '+meta.id)}else await writeFile(target,svg)
  }
 }
 console.log('19 existing force/curve SVG exports '+(process.argv.includes('--check')?'verified':'generated'))
}finally{await server.close()}
