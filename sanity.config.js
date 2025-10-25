import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
// import { visionTool } from '@sanity/vision' // Disabled due to Next.js 15 compatibility issues
import { schemaTypes } from './sanity/schemas'

export default defineConfig({
  name: 'default',
  title: 'CivicsPass Blog',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

  basePath: '/studio', // This will make Studio available at /studio

  plugins: [
    structureTool(),
    // visionTool(), // Disabled - causes ChunkLoadError with Next.js 15
  ],

  schema: {
    types: schemaTypes,
  },
})
