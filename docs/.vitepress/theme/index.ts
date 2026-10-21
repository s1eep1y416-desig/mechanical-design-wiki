import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import ChapterHero from './components/ChapterHero.vue'
import ChapterCatalog from './components/ChapterCatalog.vue'
import TextbookToc from './components/TextbookToc.vue'
import CurveChart from './components/CurveChart.vue'
import DesignLogic from './components/DesignLogic.vue'
import MechDiagram from './components/MechDiagram.vue'
import StudyProgress from './components/StudyProgress.vue'
import FormulaQuickSearch from './components/FormulaQuickSearch.vue'
import FitComparison from './components/FitComparison.vue'
import ForceDiagram from './components/ForceDiagram.vue'
import UnitConvention from './components/UnitConvention.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('ChapterHero', ChapterHero)
    app.component('ChapterCatalog', ChapterCatalog)
    app.component('TextbookToc', TextbookToc)
    app.component('CurveChart', CurveChart)
    app.component('DesignLogic', DesignLogic)
    app.component('MechDiagram', MechDiagram)
    app.component('StudyProgress', StudyProgress)
    app.component('FormulaQuickSearch', FormulaQuickSearch)
    app.component('FitComparison', FitComparison)
    app.component('ForceDiagram', ForceDiagram)
    app.component('UnitConvention', UnitConvention)
  }
} satisfies Theme
