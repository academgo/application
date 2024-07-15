import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";
import { i18n } from "@/i18n.config";
import { documentInternationalization } from "@sanity/document-internationalization";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET as string;

export default defineConfig({
  badePath: "/admin",
  name: "academgo",
  title: "Academgo",
  projectId,
  dataset,

  plugins: [
    structureTool(),
    visionTool(),
    documentInternationalization({
      supportedLanguages: i18n.languages,
      schemaTypes: ["post", "header", "homepage", "formStandardDocument"]
    })
  ],

  schema: {
    types: schemaTypes
  }
});
