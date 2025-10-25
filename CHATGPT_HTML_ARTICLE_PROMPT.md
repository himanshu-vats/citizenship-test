# ChatGPT Prompt: Generate Complete HTML Article (Zero Manual Work)

**Copy this prompt to ChatGPT. It will generate a complete HTML file that you just save and deploy.**

---

You are creating a complete, standalone HTML article for a US citizenship test prep website (CivicsPass). Generate a **fully self-contained HTML file** with all styles, scripts, and content included.

## Topic: [PUT YOUR TOPIC HERE - e.g., "Complete N-400 Process Guide"]

---

## CRITICAL OUTPUT REQUIREMENTS

Output a **complete HTML file** with:
1. ✅ All CSS styles embedded in `<style>` tag
2. ✅ All JavaScript embedded in `<script>` tag
3. ✅ Sidebar table of contents with auto-scroll
4. ✅ Progress bar at top
5. ✅ Responsive design (mobile + desktop)
6. ✅ Dark mode support
7. ✅ All content in one file (no external dependencies)

---

## EXACT TEMPLATE TO USE

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Article Title Here]</title>
    <meta name="description" content="[SEO description 150-160 chars]">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
        }

        .container {
            display: flex;
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            min-height: 100vh;
        }

        /* Sidebar */
        .sidebar {
            width: 300px;
            background: linear-gradient(180deg, #1e3a8a 0%, #1e40af 100%);
            color: white;
            padding: 2rem 1rem;
            position: sticky;
            top: 0;
            height: 100vh;
            overflow-y: auto;
        }

        .sidebar h2 {
            font-size: 1.2rem;
            margin-bottom: 1.5rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid #3b82f6;
        }

        .sidebar nav ul {
            list-style: none;
        }

        .sidebar nav ul li a {
            color: #93c5fd;
            text-decoration: none;
            display: block;
            padding: 0.75rem 1rem;
            border-radius: 6px;
            transition: all 0.3s;
            font-size: 0.95rem;
        }

        .sidebar nav ul li a:hover,
        .sidebar nav ul li a.active {
            background: #3b82f6;
            color: white;
            transform: translateX(5px);
        }

        .sidebar nav ul ul {
            margin-left: 1rem;
            margin-top: 0.5rem;
        }

        .sidebar nav ul ul li a {
            font-size: 0.875rem;
            color: #bfdbfe;
        }

        /* CTA Box in Sidebar */
        .cta-sidebar {
            margin-top: 2rem;
            padding: 1.5rem;
            background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
            border-radius: 12px;
        }

        .cta-sidebar h3 {
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
        }

        .cta-sidebar p {
            font-size: 0.85rem;
            color: #e0e7ff;
            margin-bottom: 1rem;
        }

        .cta-sidebar .btn {
            display: block;
            padding: 0.6rem;
            background: white;
            color: #1e3a8a;
            text-align: center;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin-bottom: 0.5rem;
            font-size: 0.9rem;
        }

        .cta-sidebar .btn:hover {
            transform: scale(1.05);
        }

        /* Main Content */
        .content {
            flex: 1;
            padding: 3rem;
            max-width: 900px;
        }

        .content h1 {
            font-size: 2.5rem;
            color: #1e3a8a;
            margin-bottom: 1rem;
            line-height: 1.2;
        }

        .meta {
            display: flex;
            gap: 2rem;
            color: #6b7280;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid #e5e7eb;
            font-size: 0.95rem;
        }

        .intro {
            font-size: 1.125rem;
            color: #4b5563;
            margin-bottom: 2rem;
            padding: 1.5rem;
            background: #eff6ff;
            border-left: 4px solid #3b82f6;
            border-radius: 4px;
        }

        .content h2 {
            font-size: 2rem;
            color: #1e3a8a;
            margin-top: 3rem;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 3px solid #3b82f6;
        }

        .content h3 {
            font-size: 1.5rem;
            color: #1e40af;
            margin-top: 2rem;
            margin-bottom: 1rem;
        }

        .content p {
            margin-bottom: 1rem;
            color: #374151;
            font-size: 1.05rem;
        }

        .content strong {
            color: #1e3a8a;
            font-weight: 600;
        }

        .content ul, .content ol {
            margin-left: 2rem;
            margin-bottom: 1rem;
        }

        .content li {
            margin-bottom: 0.5rem;
            color: #374151;
        }

        .content a {
            color: #2563eb;
            text-decoration: underline;
        }

        .content a:hover {
            color: #1d4ed8;
        }

        /* Special boxes */
        .tip-box {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 1.5rem;
            margin: 1.5rem 0;
            border-radius: 4px;
        }

        .warning-box {
            background: #fee2e2;
            border-left: 4px solid #ef4444;
            padding: 1.5rem;
            margin: 1.5rem 0;
            border-radius: 4px;
        }

        .success-box {
            background: #d1fae5;
            border-left: 4px solid #10b981;
            padding: 1.5rem;
            margin: 1.5rem 0;
            border-radius: 4px;
        }

        .cta-box {
            background: linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%);
            color: white;
            padding: 2rem;
            border-radius: 12px;
            margin: 2rem 0;
            text-align: center;
        }

        .cta-box h3 {
            color: white;
            margin: 0 0 1rem 0;
        }

        .cta-box .btn {
            display: inline-block;
            padding: 0.75rem 1.5rem;
            background: white;
            color: #1e3a8a;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 0 0.5rem;
        }

        .disclaimer {
            background: #f3f4f6;
            padding: 1.5rem;
            border-radius: 8px;
            margin-top: 3rem;
            font-size: 0.9rem;
            color: #6b7280;
            font-style: italic;
        }

        /* Progress bar */
        .progress-bar {
            position: fixed;
            top: 0;
            left: 0;
            height: 4px;
            background: #3b82f6;
            width: 0%;
            z-index: 1000;
        }

        /* Responsive */
        @media (max-width: 968px) {
            .container {
                flex-direction: column;
            }
            .sidebar {
                width: 100%;
                height: auto;
                position: relative;
            }
            .content {
                padding: 2rem 1.5rem;
            }
            .content h1 {
                font-size: 2rem;
            }
        }

        /* Dark mode */
        @media (prefers-color-scheme: dark) {
            body {
                background-color: #0f172a;
                color: #e2e8f0;
            }
            .container {
                background: #0f172a;
            }
            .content h1, .content h2, .content h3 {
                color: #93c5fd;
            }
            .content p, .content li {
                color: #cbd5e1;
            }
            .intro {
                background: #1e3a8a20;
                color: #cbd5e1;
            }
            .meta {
                border-bottom-color: #334155;
            }
        }

        html {
            scroll-behavior: smooth;
            scroll-padding-top: 20px;
        }
    </style>
</head>
<body>
    <div class="progress-bar" id="progressBar"></div>

    <div class="container">
        <!-- Sidebar -->
        <aside class="sidebar">
            <h2>📋 Table of Contents</h2>
            <nav>
                <ul>
                    <li><a href="#introduction">Introduction</a></li>
                    <!-- ADD MORE TOC ITEMS HERE - one for each H2 section -->
                    <li>
                        <a href="#section-1">Section 1 Title</a>
                        <ul>
                            <li><a href="#subsection-1a">Subsection 1A</a></li>
                            <li><a href="#subsection-1b">Subsection 1B</a></li>
                        </ul>
                    </li>
                    <!-- Repeat for all sections -->
                </ul>
            </nav>

            <div class="cta-sidebar">
                <h3>🎯 Practice Now</h3>
                <p>Test your knowledge</p>
                <a href="/" class="btn">Take Test</a>
                <a href="/study" class="btn">Study Cards</a>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="content">
            <h1>[Article Title]</h1>

            <div class="meta">
                <span>📅 [Date]</span>
                <span>⏱️ [Read Time]</span>
                <span>📚 Process Guide</span>
            </div>

            <div class="intro" id="introduction">
                <p>[Opening paragraph with hook]</p>
                <p>[Second paragraph with context]</p>
            </div>

            <h2 id="section-1">[Section 1 Title]</h2>

            <p>[Content paragraph with <strong>bold emphasis</strong> on important points.]</p>

            <p><strong>Key points:</strong></p>
            <ul>
                <li><strong>Point 1:</strong> Explanation</li>
                <li><strong>Point 2:</strong> Explanation</li>
                <li><strong>Point 3:</strong> Explanation</li>
            </ul>

            <h3 id="subsection-1a">[Subsection 1A Title]</h3>

            <p>[Subsection content]</p>

            <div class="tip-box">
                <p><strong>💡 Pro tip:</strong> [Helpful tip here]</p>
            </div>

            <!-- REPEAT SECTIONS -->

            <div class="cta-box">
                <h3>🎉 Ready to Start Your Journey?</h3>
                <p>Put your knowledge to the test</p>
                <a href="/" class="btn">Take Practice Test</a>
                <a href="/study" class="btn">Study Flashcards</a>
                <a href="/stats" class="btn">Track Progress</a>
            </div>

            <div class="disclaimer">
                <p><strong>Disclaimer:</strong> This article provides general information about the U.S. citizenship process. For specific legal advice, consult a qualified immigration attorney.</p>
            </div>
        </main>
    </div>

    <script>
        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        // Active link highlighting
        const sections = document.querySelectorAll('h2[id], h3[id]');
        const navLinks = document.querySelectorAll('.sidebar nav a');

        function updateActiveLink() {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const scrollPos = window.pageYOffset + 100;
                if (scrollPos >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }

        window.addEventListener('scroll', updateActiveLink);
        updateActiveLink();

        // Progress bar
        function updateProgressBar() {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            document.getElementById('progressBar').style.width = scrolled + '%';
        }

        window.addEventListener('scroll', updateProgressBar);
        updateProgressBar();
    </script>
</body>
</html>
```

---

## CONTENT REQUIREMENTS

**Article Structure:**
- **7-10 H2 sections** (main topics)
- **2-4 H3 subsections** under each H2
- **1,500-2,000 words total**
- **25-35 bold phrases** (using `<strong>`)
- **10-15 lists** (ul/ol)
- **3-5 special boxes** (tip-box, warning-box, success-box)
- **2-3 CTA boxes** throughout

**Writing Style:**
- Conversational but authoritative
- Short paragraphs (2-4 sentences)
- Use `<strong>` liberally for emphasis
- Include internal links to `/`, `/study`, `/stats`
- Include external links to https://www.uscis.gov

**Table of Contents:**
- Create a TOC item for EVERY H2 section
- Nest H3 subsections under their parent H2
- Use proper `id` attributes matching the `href`

---

## EXAMPLE SECTIONS

```html
<h2 id="step-1">Step 1: Verify Your Eligibility</h2>

<p>Before spending $760 on the N-400 filing fee, <strong>confirm you meet all eligibility requirements</strong>. The most common pathway requires 5 years as a permanent resident.</p>

<p><strong>Basic requirements:</strong></p>
<ul>
    <li><strong>Age:</strong> At least 18 years old</li>
    <li><strong>Residence:</strong> Permanent resident for 5 years (or 3 if married to U.S. citizen)</li>
    <li><strong>Physical presence:</strong> At least 30 months in the U.S.</li>
</ul>

<h3 id="continuous-residence">Continuous Residence Requirement</h3>

<p><strong>Continuous residence</strong> means no trips outside the U.S. lasting 6 months or longer. If you have taken such trips:</p>

<div class="warning-box">
    <p><strong>⚠️ Important:</strong> Trips over 12 months automatically break continuous residence unless you have Form N-470 approval.</p>
</div>
```

---

## CHECKLIST

Your HTML file must have:

✅ Complete `<head>` with title and meta description
✅ All CSS styles in `<style>` tag (no external CSS)
✅ All JavaScript in `<script>` tag (no external JS)
✅ Table of contents matching all H2/H3 sections
✅ Progress bar code
✅ Active link highlighting code
✅ Smooth scrolling code
✅ 7-10 H2 sections with IDs
✅ 2-4 H3 subsections per H2 with IDs
✅ Responsive design (works on mobile)
✅ Dark mode support
✅ CTA boxes with links
✅ Disclaimer at bottom
✅ 1,500-2,000 words of content
✅ Works as standalone file (no dependencies)

---

## OUTPUT FORMAT

**Output ONLY the complete HTML code.**

**No explanations. No markdown. Just the raw HTML file ready to save.**

**The output should start with:**
```html
<!DOCTYPE html>
<html lang="en">
```

**And end with:**
```html
</body>
</html>
```

---

## NOW CREATE THE ARTICLE

**Topic:** [YOUR TOPIC]

**Generate the complete HTML file now.**
