import type { Theme } from "vitepress";
import { defineAsyncComponent } from "vue";
import DefaultTheme from "vitepress/theme";
import Layout from "./Layout.vue";
import ChapterHero from "./components/ChapterHero.vue";
import ChapterCatalog from "./components/ChapterCatalog.vue";
import TextbookToc from "./components/TextbookToc.vue";
import DesignLogic from "./components/DesignLogic.vue";
import StudyProgress from "./components/StudyProgress.vue";
import UnitConvention from "./components/UnitConvention.vue";
import "./style.css";

const CurveChart = defineAsyncComponent(
  () => import("./components/CurveChart.vue"),
);
const MechDiagram = defineAsyncComponent(
  () => import("./components/MechDiagram.vue"),
);
const FormulaQuickSearch = defineAsyncComponent(
  () => import("./components/FormulaQuickSearch.vue"),
);
const FitComparison = defineAsyncComponent(
  () => import("./components/FitComparison.vue"),
);
const ForceDiagram = defineAsyncComponent(
  () => import("./components/ForceDiagram.vue"),
);
const DesignFigure = defineAsyncComponent(
  () => import("./components/DesignFigure.vue"),
);
const DesignGallery = defineAsyncComponent(
  () => import("./components/DesignGallery.vue"),
);
const DesignCalculator = defineAsyncComponent(
  () => import("./components/DesignCalculator.vue"),
);
const EngineeringCalculator = defineAsyncComponent(
  () => import("./components/EngineeringCalculator.vue"),
);

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component("DesignCalculator", DesignCalculator);
    app.component("EngineeringCalculator", EngineeringCalculator);
    app.component("DesignFigure", DesignFigure);
    app.component("DesignGallery", DesignGallery);
    app.component("ChapterHero", ChapterHero);
    app.component("ChapterCatalog", ChapterCatalog);
    app.component("TextbookToc", TextbookToc);
    app.component("CurveChart", CurveChart);
    app.component("DesignLogic", DesignLogic);
    app.component("MechDiagram", MechDiagram);
    app.component("StudyProgress", StudyProgress);
    app.component("FormulaQuickSearch", FormulaQuickSearch);
    app.component("FitComparison", FitComparison);
    app.component("ForceDiagram", ForceDiagram);
    app.component("UnitConvention", UnitConvention);
  },
} satisfies Theme;
