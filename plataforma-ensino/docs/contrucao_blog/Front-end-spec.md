# Stelarow Integrado Blog UI/UX Specification

### **Introduction**
This document defines the user experience goals, information architecture, user flows, and visual design specifications for the Stelarow Integrado Blog's user interface. It serves as the foundation for visual design and frontend development, ensuring a cohesive and user-centered experience.

#### **Overall UX Goals & Principles**
Based on the PRD, the core vision is a clean, fast, and readable experience that integrates seamlessly with the main Stelarow platform.

* **Target User Personas**
    * **Content Author (Admin/Instructor):** Platform administrators and instructors who need an efficient and intuitive interface to create, manage, and publish articles.
    * **Visitor/Reader:** Potential or current students visiting the site who want to discover and consume content easily and without distraction.
* **Usability Goals**
    * **Readability:** Content is presented in a clean, legible format on all devices.
    * **Performance:** Pages load quickly, with a First Contentful Paint (FCP) under 2 seconds.
    * **Seamless Journey:** The transition from reading a blog post to exploring a course on the main platform feels natural and unintrusive.
    * **Authoring Efficiency:** Authors can create and publish a formatted article with minimal friction.
* **Design Principles**
    1.  **Seamless Integration:** The blog should feel like a natural extension of the Stelarow platform, not a separate entity. It will use the existing design system, colors, and typography.
    2.  **Readability First:** All design choices must prioritize a clean, focused, and comfortable reading experience.
    3.  **Performance by Default:** The UI must be lightweight and fast to ensure optimal SEO and user experience.
    4.  **Clear Path to Conversion:** While the focus is on content, the path for a reader to become a student must be clear and logical via contextual CTAs.

#### **Change Log**
| Date | Version | Description | Author |
| :--- | :--- | :--- | :--- |
| 2025-07-25 | 1.0 | Initial draft based on PRD v1.0 | Sally (BMad-UX) |

***

### **Information Architecture (IA)**
This section defines how the blog's content and features are organized and structured.

#### **Site Map / Screen Inventory**
The diagram below illustrates the key pages of the blog and their relationships, separating the public-facing areas from the internal authoring interface.

```mermaid
graph TD
    subgraph Stelarow Main Platform
        A[Stelarow Website]
        P[Stelarow Admin Panel]
    end

    subgraph Public Blog (/blog)
        B[Blog Homepage] --> C(Article Page);
        B --> D(Category/Tag Page);
        B --> E(Search Results Page);
        D --> C;
        E --> C;
    end
    
    subgraph Authoring Area (in Admin Panel)
        F(Blog Dashboard) --> G(Article List);
        G --> H(Create/Edit Article Form);
        F --> H;
    end

    A --> B;
    P --> F;
Navigation Structure
Main Site Integration: The primary Stelarow website navigation will feature a prominent "Blog" link that directs users to the Blog Homepage.

Blog Internal Navigation: On the blog pages, users will find:

A navigation bar with links to key Categories.

A clearly visible Search field.

Tags and Categories listed on article pages will be clickable, leading to the respective listing pages.

Breadcrumbs: To aid orientation, a breadcrumb trail will be present on article and category/tag pages.

Example: Home > Blog > Nome da Categoria > Título do Artigo

Authoring Access: Users with "instrutor" or "administrador" roles will find a new "Blog Management" section within the main Stelarow Admin Panel to access the authoring tools.

User Flows
Here we define the step-by-step journeys for the most critical tasks identified in the PRD.

Flow 1: Reading an Article
User Goal: To find and read an article of interest.

Entry Points: Main Stelarow site, direct link (social media, email), search engine result, clicking a category/tag link.

Success Criteria: The user successfully navigates to an article page and can read its full content without interruption.

Flow Diagram:

Snippet de código

graph TD
    A(Enters Blog Homepage) --> B{Sees list of articles};
    B --> C(Clicks on an article title);
    C --> D[Article Page Loads];
    D --> E(Reads content);
    E --> F(Clicks on a CTA);
    F --> G[Navigates to Course Page];
Edge Cases & Error Handling:

What happens if an article slug is invalid or the article is unpublished? -> A clear "404 - Article Not Found" page should be displayed with a link back to the blog homepage.

Flow 2: Searching for Content
User Goal: To find articles related to a specific keyword.

Entry Points: The search bar on any page of the blog.

Success Criteria: The user receives a relevant list of articles or a clear "no results" message.

Flow Diagram:

Snippet de código

graph TD
    A(User is on a blog page) --> B(Types keyword in Search Bar);
    B --> C(Submits search);
    C --> D{Results Found?};
    D -- Yes --> E[Displays Search Results Page];
    D -- No --> F[Displays "No results found" message];
    E --> G(User clicks an article);
    G --> H[Article Page Loads];
Edge Cases & Error Handling:

Search for an empty term -> The search button should be disabled or it should return to the main blog page.

Search term with special characters -> Input should be sanitized before querying the database.

Flow 3: Creating a New Post (Author Flow)
User Goal: To write, format, and publish a new article.

Entry Points: "Blog Management" section in the Stelarow Admin Panel.

Success Criteria: An author can successfully create a new article, save it as a draft, and later publish it to the public blog.

Flow Diagram:

Snippet de código

graph TD
    A(Author logs into Admin Panel) --> B(Navigates to Blog Management);
    B --> C(Clicks "Create New Article");
    C --> D[Displays Create/Edit Form];
    D --> E(Fills in Title, Content, SEO fields);
    E --> F(Uploads images and associates categories/tags);
    F --> G{Save as Draft or Publish?};
    G -- Draft --> H[Article saved as draft];
    G -- Publish --> I[Article is published];
    H --> J(Returns to Article List);
    I --> J;
Edge Cases & Error Handling:

Attempting to publish without a title -> The form should show a validation error.

Network error during image upload -> A clear error message should be displayed to the author.

Slug conflict -> The system should auto-append a suffix (e.g., -2) or show a validation error prompting the author to change the slug.

Wireframes & Mockups
Primary Design Files: It is recommended that detailed, high-fidelity mockups and prototypes be created in Figma. This will serve as the single source of truth for all visual and interaction design.

Key Screen Layouts
Screen: Blog Homepage

Purpose: To present the latest articles and allow users to browse by category or search.

Layout Concept:

+---------------------------------------------------+
| [Stelarow Header with "Blog" link active]           |
+---------------------------------------------------+
|                                                   |
|               [Featured Article Large]            |
|                                                   |
+---------------------------------------------------+
| [Search Bar]               [Filter by Category]   |
+---------------------------------------------------+
| [Article Card] [Article Card] [Article Card]      |
| [Article Card] [Article Card] [Article Card]      |
+---------------------------------------------------+
| [Pagination: 1, 2, 3...]                          |
+---------------------------------------------------+
| [Stelarow Footer]                                 |
+---------------------------------------------------+
Screen: Article Page

Purpose: To provide a clean, focused, and performant reading experience.

Layout Concept:

+---------------------------------------------------+
| [Stelarow Header]                                 |
+---------------------------------------------------+
| [Breadcrumb: Home > Blog > Category]              |
|                                                   |
| <h1>Article Title</h1>                           |
| <p>by Author Name on July 25, 2025</p>             |
|                                                   |
| [ ------ Feature Image ------ ]                   |
|                                                   |
| <p>Article content starts here...</p>              |
|                                                   |
| [Tags: Tag1, Tag2]                                |
|                                                   |
| [ ------- Call-to-Action Component ------- ]      |
+---------------------------------------------------+
| [Stelarow Footer]                                 |
+---------------------------------------------------+
Component Library / Design System
Design System Approach: We will extend the existing Stelarow design system. All foundational elements like buttons and inputs will be reused. New components must adhere to the established design tokens.

Core Components
Component: ArticleCard

Purpose: To display a preview of an article on listing pages.

Variants: Standard, Featured.

Component: MarkdownRenderer

Purpose: To render raw Markdown content as styled HTML on the article page.

Component: CallToAction (CTA)

Purpose: To guide readers from a blog post to a relevant course page.

Variants: Specific (links to a course), Generic (links to the main course list).

Component: MarkdownEditor

Purpose: A rich text editor for the authoring interface that uses Markdown.

Branding & Style Guide
This section defines the visual brand elements that must be used to ensure consistency with the existing Stelarow platform.

Visual Identity
Brand Guidelines: All visual elements must adhere to the official Stelarow brand guidelines.

Color Palette
The color palette is based on the system's design tokens to ensure full integration.

Color Type	Hex Code	Usage
Primary	#4f46e5	Used for links, primary buttons, and active UI elements.
Secondary	#0ea5e9	Used for secondary emphasis and informational icons.
Accent	#f59e0b	Used for Call-to-Actions (CTAs) and elements needing high visibility.
Success	#10b981	Used for success messages and positive feedback.
Warning	#f97316	Used for warnings and notices that require attention.
Error	#ef4444	Used for error messages and destructive actions.
Neutral	#111827, #374151, #d1d5db, #f9fafb	Used for text, borders, and page backgrounds.

Exportar para as Planilhas
Typography
Font Families
Primary: "Inter", sans-serif

Secondary: "Lora", serif (for article body to improve readability)

Monospace: "Fira Code", monospace (for code blocks)

Type Scale
Element	Size	Weight	Line Height
H1	2.25rem	700	2.5rem
H2	1.875rem	700	2.25rem
H3	1.5rem	600	2rem
Body	1rem	400	1.5rem
Small	0.875rem	400	1.25rem
(All typography specifications cited from stelarow-habilidade.txt)			

Exportar para as Planilhas
Iconography
Icon Library: Heroicons v2

Usage Guidelines: The "Solid" variant should be used for active or selected states. The "Outline" variant should be used for default states. Stroke width should be 1.5px.

Spacing & Layout
Grid System: The layout is based on a 4px grid system.

Spacing Scale: Spacing should follow the design system's token scale (e.g., 4px, 8px, 16px, 32px, 64px) to ensure consistency.

Accessibility Requirements
Compliance Target: The blog must conform to the Web Content Accessibility Guidelines (WCAG) 2.1 at a Level AA standard.

Key Requirements:

Visual: Text must have a contrast ratio of at least 4.5:1. All interactive elements must have a visible focus state.

Interaction: All functionality must be operable via keyboard. The site must be coded with semantic HTML for screen readers.

Content: All meaningful images must have descriptive alt text. Pages must use a logical heading structure.

Testing Strategy: A combination of automated scans (e.g., Axe), manual keyboard testing, and screen reader testing is required.

Responsiveness Strategy
A mobile-first approach will be adopted.

Breakpoints
Breakpoint	Min Width	Target Devices
Mobile	320px	Mobile phones
Tablet	768px	Tablets
Desktop	1024px	Laptops and desktops

Exportar para as Planilhas
Adaptation Patterns
Layout: Single-column on mobile, transitioning to multi-column on larger screens.

Navigation: A hamburger menu on mobile, expanding to a full navigation bar on desktop.

Animation & Micro-interactions
Motion Principles:

Purposeful: Animations should provide feedback or smooth transitions.

Performant: All animations must be lightweight, using CSS transitions where possible.

Subtle: Motion should be quick and unobtrusive.

Key Animations:

Subtle transitions on hover/focus for links and buttons.

Smooth slide-in/out for the mobile navigation menu.

Performance Considerations
Performance Goals:

First Contentful Paint (FCP): Article pages must have an FCP of less than 2 seconds.

Core Web Vitals: Aim for "Good" scores for LCP, INP, and CLS.

Design Strategies:

All images will be compressed and served in modern formats (e.g., WebP).

Images below the fold will be lazy-loaded.

Blog pages will be statically generated at build time via Next.js.

Next Steps
Immediate Actions:

Share this document with stakeholders for final approval.

Begin creating detailed high-fidelity visual designs in Figma.

Handoff this document to the Architect to begin frontend architectural design.

Design Handoff Checklist:

[x] All user flows documented

[x] Component inventory complete

[x] Accessibility requirements defined

[x] Responsive strategy clear

[x] Brand guidelines incorporated

[x] Performance goals established

Checklist Results
No UI/UX checklist is configured for this agent. This section is a placeholder.