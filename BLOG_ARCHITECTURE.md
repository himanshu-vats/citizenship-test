# Modern Blog Architecture

## Problem with Old System

The previous blog system used standalone HTML files with inline styles and layouts that conflicted with our website:
- HTML files had their own `.container`, `.sidebar`, and complex layouts
- Inline styles fought with our Tailwind CSS and dark mode
- Not responsive or mobile-friendly
- Hard to maintain consistency
- Created visual issues (gray sidebars, squished navigation)

## New Modern Architecture

### Component-Based Approach

**Benefits:**
- ✅ Clean, modern design that matches the rest of the site
- ✅ Perfect dark mode support
- ✅ Mobile-responsive out of the box
- ✅ Easy to maintain and update
- ✅ Consistent with our brand
- ✅ No layout conflicts
- ✅ Better SEO and performance

### Structure

```
components/
├── BlogPost.jsx              # Main blog post layout component
└── blog/
    └── BlogContent.jsx       # Reusable content components (headings, boxes, lists)

app/blog-simple/
├── page.jsx                  # Blog listing page
├── [slug]/
│   └── page.jsx             # Dynamic blog post page
└── posts/
    ├── n400-filing-mistakes.jsx    # Blog post as React component
    └── complete-n400-process.jsx   # Blog post as React component
```

### How to Create a New Blog Post

1. **Create a new file** in `app/blog-simple/posts/your-slug.jsx`

2. **Import the content components:**
```jsx
import {
  Section,
  Heading2,
  Heading3,
  Paragraph,
  IntroBox,
  WarningBox,
  TipBox,
  BulletList,
  NumberedList,
  ListItem,
  Strong,
  Highlight
} from '@/components/blog/BlogContent';
```

3. **Export metadata:**
```jsx
export const metadata = {
  title: 'Your Post Title',
  description: 'Post description for SEO',
  date: 'January 2025',
  readTime: '10 min read',
  category: 'Guide',
  slug: 'your-slug'
};
```

4. **Export table of contents:**
```jsx
export const tableOfContents = [
  { id: 'section-1', title: 'Introduction' },
  { id: 'section-2', title: 'Main Topic' }
];
```

5. **Export related posts:**
```jsx
export const relatedPosts = [
  {
    slug: 'other-post-slug',
    title: 'Related Post Title',
    description: 'Short description',
    category: 'Category'
  }
];
```

6. **Write your content as a React component:**
```jsx
export default function YourPostContent() {
  return (
    <>
      <IntroBox>
        <Paragraph>
          <Strong>Key takeaway</Strong> at the start.
        </Paragraph>
      </IntroBox>

      <Section id="section-1">
        <Heading2>Main Heading</Heading2>
        <Paragraph>Your content here...</Paragraph>

        <BulletList>
          <ListItem>Point 1</ListItem>
          <ListItem>Point 2</ListItem>
        </BulletList>

        <TipBox title="Pro Tip">
          <Paragraph>Helpful advice here</Paragraph>
        </TipBox>
      </Section>
    </>
  );
}
```

7. **Register the post** in `app/blog-simple/[slug]/page.jsx`:
```jsx
import YourPostContent, {
  metadata as yourMetadata,
  tableOfContents as yourTOC,
  relatedPosts as yourRelated
} from '../posts/your-slug';

const blogPosts = {
  'your-slug': {
    metadata: yourMetadata,
    Content: YourPostContent,
    tableOfContents: yourTOC,
    relatedPosts: yourRelated
  }
};
```

### Available Content Components

- `<Section id="">` - Wrap sections for TOC linking
- `<Heading2 id="">` - Major section headings
- `<Heading3 id="">` - Subsection headings
- `<Paragraph>` - Standard paragraph
- `<IntroBox>` - Blue highlighted intro box
- `<WarningBox title="">` - Red warning callout
- `<TipBox title="">` - Green tip callout
- `<BulletList>` - Unordered list
- `<NumberedList>` - Ordered list
- `<ListItem>` - List item
- `<Strong>` - Bold text
- `<Highlight>` - Yellow highlighted text

### Features

1. **Responsive Design**
   - Mobile-first approach
   - Sidebar TOC on desktop, hidden on mobile
   - Optimized typography for all screen sizes

2. **Table of Contents**
   - Sticky sidebar navigation on desktop
   - Auto-highlights current section
   - Smooth scroll to sections

3. **Dark Mode**
   - Full dark mode support
   - Proper contrast and readability
   - Matches rest of website

4. **CTA Section**
   - Built-in call-to-action to drive users to practice tests
   - Prominent placement after main content

5. **Related Posts**
   - Automatically shows related articles
   - Increases engagement and time on site

### Migration Plan

1. Keep existing HTML blog system running
2. Create new posts using component system
3. Gradually convert old HTML posts to components
4. Remove HTML system once all posts are converted

### SEO Benefits

- Faster page loads (no heavy HTML parsing)
- Better mobile experience
- Cleaner semantic HTML
- Easier to add structured data
- Better Core Web Vitals scores
