import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import { schemaTypes } from './sanity/schemaTypes'
import { i18n } from '@/i18n.config'
import { documentInternationalization } from '@sanity/document-internationalization'

const projectId = '19hn716s';
const dataset = 'production'

export default defineConfig({
  badePath: '/admin',
  name: 'academgo',
  title: 'Academgo',
  projectId,
  dataset,

  plugins: [
    structureTool(),
    visionTool(),
    documentInternationalization({
      supportedLanguages: i18n.languages,
      schemaTypes: ['post'],
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
