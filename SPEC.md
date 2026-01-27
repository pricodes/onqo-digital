# ONQO Digital App - Functional Specification

## 1. Overview
The ONQO Digital web application is a lead-generation and assessment tool designed to evaluate a company's digital maturity. It features a polished, dark-themed Single Page Application (SPA) that guides users through a "Digital Readiness Audit" and generates an AI-powered strategic report.

**Base URL**: `https://onqo-digital-build-right-grow-faster-160939490502.us-west1.run.app/`

## 2. Sitemap & Routes
The application uses Hash-based routing (`/#/`).

- **`#/` (Home)**: Landing page with service overviews, value proposition, and "Free Digital Audit" CTAs.
- **`#/audit` (Assessment)**: The core interactive flow.
- **`#/services`**: Detailed breakdown of offerings (Digital Foundation, Growth/GTM, Practical AI).
- **`#/how-we-work`**: Explains the 4-step framework (Discover, Define, Execute, Enable).
- **`#/about`**: Company philosophy and values.
- **`#/contact`**: Contact form/Booking flow.
- **Footer Links**: Privacy Policy, Terms of Engagement.

## 3. Digital Readiness Audit Flow
The assessment is a multi-step form that culminates in a generated report.

### Step 1: Business Context
**Goal**: Categorize the business to tailor the AI prompt.
- **Input 1**: `Business Size` (Dropdown)
  - Options:
    - Startup (<$1M)
    - SMB ($1M - $10M)
    - Mid-Market ($10M - $50M)
    - Enterprise ($50M+)
- **Input 2**: `Industry` (Free Text Input)
  - Placeholder: "e.g. Manufacturing, SaaS, Retail"
- **Action**: "Next Step" button (Disabled until valid input; distinct programmatic event handling required).

### Step 2: Operational Details
**Goal**: Gather specific pain points and objectives.
- **Input 1**: `Current Tech Stack` (Textarea)
  - Prompt: "What meant tools are you currently using?"
- **Input 2**: `Main Digital Bottleneck` (Textarea)
  - Prompt: "What is your biggest operational challenge?"
- **Input 3**: `Primary Growth Goal` (Text Input)
  - Prompt: "What is your main objective for the next 12 months?"
- **Action**: "Generate Report" button (Triggers AI analysis).

### Step 3: Processing
- **State**: Loading overlay with text "Analyzing..."
- **Duration**: ~5-10 seconds.
- **Mechanism**: Submits data to backend (likely Python/FastAPI) which queries an LLM to generate the markdown report.

## 4. Results/Report Page Structure
The final report is dynamic and personalized based on the inputs.

### Header
- **Title**: "Electronic Readiness Audit" (or similar)
- **Actions**: "Save Analysis as PDF" (Triggers `window.print()`).

### Key Sections
1.  **Digital Maturity Score**:
    - A specific numerical score (1-10) visualized with a gauge or progress bar.
    - Contextual label (e.g., "Early Stage", "Scaling").
2.  **Executive Summary**:
    - High-level synopsis of the business's current state based on inputs.
3.  **Core Structural Gaps**:
    - Detailed bullet points identifying missing technologies or process inefficiencies.
4.  **Recommended Pillar**:
    - Suggests a focus area (e.g., "Automated Lead Gen", "Data Foundation").
5.  **Immediate Next Steps**:
    - Actionable, prioritized list of recommendations.

## 5. UX & Design System
The application features a "Premium Dark" aesthetic.

### Color Palette
- **Background**: Deep Zinc (`#18181b` / Zinc-900).
- **Primary Text**: Off-white/Grey (`#e4e4e7` / Zinc-200).
- **Accent/Brand**: Vibrant Lime Green (`#a2d033`) used for:
  - Primary Buttons (hover states)
  - Borders/Dividers
  - Progress selection highlights
  - Icons

### Typography
- **Font Family**: Modern Sans-Serif (likely Inter or similar system font).
- **Style**:
  - Headers: Bold, often Uppercase with wide tracking (`tracking-widest`).
  - Body: Clean, legible with generous line height.

### Interaction Patterns
- **Buttons**:
  - Solid background (Zinc-800) with bright borders or text functionality.
  - Hover effects: subtle glow or color shift to Lime.
- **Forms**:
  - Floating labels or clean placeholders.
  - Inputs have explicit focus states (Lime border).
- **Transitions**: Smooth fade-ins between route changes.

## 6. Technical Observations
- **Framework**: React.
- **Routing**: `react-router-dom` (HashRouter).
- **State**: Forms rely on React state; direct DOM manipulation requires bubbling events.
