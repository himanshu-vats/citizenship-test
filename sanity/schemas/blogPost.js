import { defineType, defineField } from 'sanity'

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Article headline',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly version of the title',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      description: 'Short summary (1-2 sentences)',
      rows: 3,
      validation: Rule => Rule.required().max(200),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'News', value: 'news' },
          { title: 'Process Guide', value: 'process-guide' },
          { title: 'Question Deep Dive', value: 'question-deep-dive' },
          { title: 'Community Q&A', value: 'community-qa' },
        ],
        layout: 'dropdown',
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      description: 'When this article was published',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'readTime',
      title: 'Read Time',
      type: 'string',
      description: 'e.g., "5 min read"',
      initialValue: '5 min read',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      description: 'SEO description (150-160 characters)',
      rows: 3,
      validation: Rule => Rule.required().min(120).max(160),
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      description: 'Main article image',
      options: {
        hotspot: true, // Enables cropping
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for SEO and accessibility',
        },
      ],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      description: 'Article content - use the toolbar to format text, add links, images, and more',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading 2', value: 'h2' },
            { title: 'Heading 3', value: 'h3' },
            { title: 'Heading 4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet List', value: 'bullet' },
            { title: 'Numbered List', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
              { title: 'Underline', value: 'underline' },
              { title: 'Strike', value: 'strike-through' },
              { title: 'Code', value: 'code' },
              { title: 'Highlight', value: 'highlight' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'External Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: Rule =>
                      Rule.uri({
                        scheme: ['http', 'https', 'mailto', 'tel'],
                      }),
                  },
                  {
                    name: 'blank',
                    type: 'boolean',
                    title: 'Open in new tab',
                    initialValue: true,
                  },
                ],
              },
              {
                name: 'internalLink',
                type: 'object',
                title: 'Internal Link',
                fields: [
                  {
                    name: 'reference',
                    type: 'reference',
                    title: 'Reference',
                    to: [{ type: 'blogPost' }],
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          title: 'Image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
              description: 'Important for SEO and accessibility',
              validation: Rule => Rule.required(),
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
              description: 'Optional caption below image',
            },
          ],
        },
        // Custom callout block for important info
        {
          name: 'callout',
          type: 'object',
          title: 'Callout Box',
          fields: [
            {
              name: 'type',
              type: 'string',
              title: 'Type',
              options: {
                list: [
                  { title: '💡 Tip', value: 'tip' },
                  { title: '⚠️ Warning', value: 'warning' },
                  { title: 'ℹ️ Info', value: 'info' },
                  { title: '✅ Success', value: 'success' },
                ],
              },
              initialValue: 'tip',
            },
            {
              name: 'title',
              type: 'string',
              title: 'Title',
              description: 'Optional heading for callout',
            },
            {
              name: 'content',
              type: 'text',
              title: 'Content',
              rows: 3,
              validation: Rule => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: 'title',
              type: 'type',
              content: 'content',
            },
            prepare({ title, type, content }) {
              const icons = {
                tip: '💡',
                warning: '⚠️',
                info: 'ℹ️',
                success: '✅',
              }
              return {
                title: title || `${icons[type]} ${type.toUpperCase()}`,
                subtitle: content,
              }
            },
          },
        },
        // YouTube embed
        {
          name: 'youtube',
          type: 'object',
          title: 'YouTube Video',
          fields: [
            {
              name: 'url',
              type: 'url',
              title: 'YouTube URL',
              description: 'Full YouTube video URL',
              validation: Rule => Rule.required(),
            },
          ],
          preview: {
            select: {
              url: 'url',
            },
            prepare({ url }) {
              return {
                title: 'YouTube Video',
                subtitle: url,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      initialValue: 'CivicsPass Team',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Post',
      type: 'boolean',
      description: 'Display this post prominently',
      initialValue: false,
    }),
    defineField({
      name: 'longForm',
      title: 'Long-Form Interactive Article',
      type: 'boolean',
      description: 'Enable sidebar navigation and interactive features for comprehensive guides',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'featuredImage',
    },
  },
  orderings: [
    {
      title: 'Published Date, New',
      name: 'publishedDateDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Published Date, Old',
      name: 'publishedDateAsc',
      by: [{ field: 'publishedAt', direction: 'asc' }],
    },
  ],
})
