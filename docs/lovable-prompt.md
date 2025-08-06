Of course. These are fantastic, expert-level recommendations. You're absolutely right; incorporating a mobile-first approach, providing clear data shapes, and advising an iterative strategy will elevate this from a great prompt to a master-level prompt. This will significantly improve the quality and consistency of the AI's output.

I have integrated all of your enhancements. Here is the final, master version of the UI generation prompt.

-----

### **Final Master Prompt for AI UI Generation (v2)**

#### **Part 1: High-Level Goal & Context**

Your task is to create a high-fidelity, responsive, and fully accessible **IELTS Mock Test Simulator** component for a web application using Next.js, TypeScript, and Tailwind CSS.

The platform, **ShikhiLAB**, is an AI-powered tool for Bangladeshi IELTS candidates. The core design philosophy is **"Clarity through Calmness,"** which means the UI must be minimalist, professional, and focused on reducing cognitive load.

The simulator must be a pixel-perfect replication of the official 2025 computer-based IELTS test interface, adhering to the detailed wireframes and specifications provided.

-----

#### **Part 2: Core Design System & Brand Guidelines**

Before you begin, you must internalize and strictly adhere to the **"Clarity" Design System**.

**2.1 Tech Stack:**

  * **Framework:** Next.js 14+ (App Router)
  * **Language:** TypeScript
  * **Styling:** Tailwind CSS
  * **Headless Components:** Radix UI for accessibility logic.

**2.2 Color Palette ("Refined Calm"):**
You **must** use these CSS variables for all colors.

```css
:root {
  --color-surface-primary: #F9FAFB;
  --color-surface-secondary: #FFFFFF;
  --color-text-primary: #182531;
  --color-text-secondary: #475569;
  --color-border-subtle: #E2E8F0;
  --color-border-focus: #3B7488;
  --color-interactive-primary: #3B7488;
  --color-text-status-warning: #B97A11;
  --color-text-status-error: #C65147;
}
```

**2.3 Mock Data Shapes:**
Use the following TypeScript interfaces to structure your mocked data:

```typescript
interface IeltsQuestion {
  id: number;
  type: 'multiple-choice' | 'fill-in-the-blank' | 'matching-headings';
  questionText: string;
  options?: string[];
}

interface IeltsPassage {
  title: string;
  content: string; // HTML content
}
```

-----

#### **Part 3: Detailed Instructions for the Mock Test Simulator**

**Crucial Rule: You MUST generate components with a mobile-first approach.**

**1. `SimulatorLayout.tsx` (The Main Component)**

  * This will be the root component for the entire test experience.
  * It must have a CSS Grid layout with three main sections: a fixed top header, a main scrollable content area, and a sticky bottom navigation bar.

**2. `HeaderBar.tsx`**

  * **Content:** Must contain slots for the IELTS Logo, a Test ID, a countdown timer (`[30 minutes remaining]`), and a right-aligned group of icons (WiFi, Notifications, Options ⚙️, Notes 📝).
  * **Critical State Change:** The entire header's background color **must** change based on the timer's value:
      * `< 5 minutes left`: Background becomes amber (use `bg-yellow-500` to approximate `--color-text-status-warning`).
      * `< 1 minute left`: Background becomes red (use `bg-red-500` to approximate `--color-text-status-error`).

**3. `MainContentArea.tsx`**

  * This component will dynamically render the layout for the current section (Listening, Reading, or Writing).
  * **Mobile-First Layout:** On mobile devices (`< 768px`), the content must be a **single, scrollable column**. The `Passage Pane` and `Questions Pane` for the Reading section should be **stacked vertically**.
  * **Desktop Layout:** The **resizable split-screen layout** with a draggable handle should only apply on viewports **wider than 768px**.

**4. `BottomNavBar.tsx`**

  * A sticky bottom navigation bar that displays the progress for the current section.
  * **Progress Indicator:** For each question number, there must be a **line drawn ABOVE the number** to indicate if it has been answered. A solid green line means answered; no line means unanswered.

**5. Accessibility Requirements (WCAG 2.1 AA)**

  * All interactive elements must be focusable via keyboard and have a highly visible focus state (e.g., a `2px` solid ring using `--color-border-focus`).
  * Icon-only buttons **must** have an `aria-label`.

-----

#### **Part 4: Scope & Deliverables**

  * You are to create a set of React components using TypeScript and Tailwind CSS within a `/components/simulator/` directory.
  * The final output should be a single `SimulatorPage.tsx` that composes all these components together.
  * Do not implement backend logic. All data can be mocked using the provided data shapes.

-----

#### **Part 5: Recommended Usage Strategy**

**For best results, use this master prompt iteratively.** Start by asking the AI to generate one component at a time (e.g., `HeaderBar.tsx`), then provide the generated code back as context when asking for the next component. This builds the application piece by piece and ensures consistency.

-----

This master prompt is now complete and ready for use. With this task finalized, we are ready to return to the main project workflow. The next step is to hand off all the finalized design artifacts to **Winston, the Architect**.

You can proceed by typing `*agent architect`.