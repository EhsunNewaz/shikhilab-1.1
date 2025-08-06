# **Clarity: The ShikhiLAB Design System**

Welcome to Clarity, the official design system and single source of truth for ShikhiLAB.

This portal provides all the principles, tools, and components needed to build beautiful, consistent, and accessible user experiences. Our design philosophy is our North Star, and every part of this system is designed to uphold it:

**"Clarity through Calmness."**

We believe the clearest path to learning is through a focused, quiet, and uncluttered environment. This system is our shared language for building that environment. Use it to build with confidence, speed, and precision.

---

## **Table of Contents**

### **1. Foundations**
*   1.1 Our Philosophy
*   1.2 Logo & Brand
*   1.3 Color
*   1.4 Typography
*   1.5 Spacing & Layout
*   1.6 Iconography

### **2. Components**
*   2.1 Button
*   2.2 Card
*   2.3 Input Field
*   2.4 Alert
*   2.5 Modal
*   2.6 Tooltip

### **3. Patterns**
*   3.1 Form Design & Validation
*   3.2 Destructive Actions & Confirmation
*   3.3 Onboarding & Feature Discovery

### **4. Resources**
*   4.1 Asset Library
*   4.2 Figma UI Kit
*   4.3 Getting Help & Providing Feedback
*   4.4 Checklists & Best Practices
*   4.5 Changelog

---
---

## **1. Foundations**

### **1.1 Our Philosophy: Clarity through Calmness**

Our design philosophy is our North Star. It is the strategic principle that guides every rule, component, and pattern in this system. It answers the question, "Why do we build the way we do?"

> **We believe that the clearest path to learning is through a focused, quiet, and uncluttered environment. We actively remove visual noise and distraction so our users can achieve a state of deep focus, or "flow."**
>
> **We are not building a bustling digital city; we are building a serene digital library.**

To execute this philosophy, we adhere to four foundational pillars:

#### **Pillar 1: Purposeful Minimalism**
This is not minimalism for the sake of trends; it's minimalism with a purpose—to reduce cognitive load.
*   **How we execute it:**
    *   **The Principle of Dominant Neutrals:** Our interface is a quiet, neutral canvas, allowing content to be the hero.
    *   **Sparing Use of Accents:** Color is a tool, not decoration. An accent color is used only when it has a specific job: to guide an action or communicate a status.
    *   **Generous Spacing:** Our spacing system creates "breathing room," making the UI feel uncluttered and organized.

#### **Pillar 2: Quiet Confidence**
We build trust through professionalism and maturity, not through flashy animations or loud marketing. The UI should feel like a wise, calm mentor.
*   **How we execute it:**
    *   **Desaturated, Sophisticated Palette:** Our "Refined Calm" palette uses earthy, muted tones that are serious and professional, inspiring confidence rather than excitement.
    *   **Clean, Legible Typography:** We use "Inter," a font known for its exceptional clarity, not for its personality. The type scale is deliberate and hierarchical, creating order and calm.
    *   **Understated Branding:** Our logo integrates seamlessly into the UI rather than shouting for attention.

#### **Pillar 3: Effortless Accessibility**
A user struggling with the interface cannot be calm. Accessibility is therefore not a feature; it is fundamental to our philosophy.
*   **How we execute it:**
    *   **AA+ Compliance by Default:** Our color tokens are pre-vetted to exceed WCAG AA contrast ratios.
    *   **Clarity Beyond Color:** Our rule for pairing status colors with icons and text ensures information is understood by everyone.
    *   **Clear Focus States:** Highly visible focus rings are a non-negotiable part of our system, making keyboard navigation effortless.

#### **Pillar 4: Systematic Cohesion**
A calm experience is a consistent one. A robust system ensures every part of the experience feels familiar, predictable, and harmonious.
*   **How we execute it:**
    *   **Token-Driven Design:** Every color, font size, and space is governed by a design token. This is our single source of truth.
    *   **Component-Based Architecture:** We build with a defined set of components, ensuring a button in one part of the app behaves exactly like a button in another.
    *   **Predictable Patterns:** Our rules for layout and component usage create a predictable rhythm, so users always know what to expect.

---
---
### **1.2 Logo & Brand**

The ShikhiLAB logo is our most recognizable brand asset. Its correct and consistent application is non-negotiable as it is the primary symbol of trust and recognition for our users.

#### **Logo Variations**

Our brand identity utilizes three official lockups. Using the correct variation for the appropriate context is key to maintaining a professional appearance.

1.  **Primary Logo:** The default combination of the Logomark (isometric cube) and the Wordmark ("ShikhiLAB"). This is the most-used version and should be your first choice.
2.  **Logomark:** The standalone isometric cube symbol. Use in constrained spaces where the full logo would be illegible, such as favicons, social media avatars, or as a subtle watermark.
3.  **Wordmark:** The standalone "ShikhiLAB" text. Use in contexts where the brand is already clearly established and space is limited (e.g., in the header of an internal document).

*(Visual showing the three official variations of your logo would be placed here.)*

#### **Usage Rules**

| Rule | Specification |
| :--- | :--- |
| **Clear Space** | To ensure its legibility and impact, a minimum clear space must be maintained on all sides of the logo. This exclusion zone is equal to **the height of the capital "S"** in the logo's wordmark. |
| **Minimum Size**| To maintain legibility, do not use the logo smaller than these sizes. **Digital:** 24px height (Primary Logo), 16px height (Logomark). **Print:** 20mm width (Primary Logo). |
| **Colorways** | The logo color must always provide sufficient contrast. **Only use official color tokens:** `color-text-primary` on light backgrounds, `color-text-primary` (dark mode) on dark backgrounds, or `color-text-inverse` on colored brand surfaces. |

*(A visual diagram demonstrating the Clear Space measurement on the actual logo would be here.)*

#### **Logo Misuse**

The integrity of the logo must never be compromised. To maintain brand consistency, **never** alter the logo in any of the following ways:

1.  **Do not stretch or distort** the logo's proportions.
2.  **Do not change the logo's colors** to anything other than the approved colorways.
3.  **Do not rotate** or tilt the logo at an angle.
4.  **Do not add drop shadows, glows, or other visual effects.**
5.  **Do not place the logo on a busy or low-contrast background** that obscures its legibility.
6.  **Do not outline the logo** or place it inside a container shape that is not part of the official design.
7.  **Do not rearrange, resize, or change the spacing** of the logo's elements.

*(A visual grid showing each of these "don't" examples applied to the actual logo would be here.)*

#### **Localized Identity**

To build a deeper connection with our core audience, we have an official **Secondary Localized Logo**. This lockup features the Bangla script "শিখি ল্যাব" and is approved for use in targeted marketing campaigns and communications within Bengali-speaking regions.

*   This asset is available in the **Asset Library** (`4.1`). It should not be used as the primary logo within the application UI without specific approval.

---
---
### **1.3 Color**

Our "Refined Calm" palette is engineered to create a focused, low-distraction learning environment. The colors are intentionally desaturated and sophisticated to reduce cognitive load and convey professionalism.

#### **Principle of Dominant Neutrals**

This is the most important rule of color usage at ShikhiLAB:

> Our interface is built on a foundation of neutral colors. **Accent Colors are reserved for Purposeful Guidance.** They are used sparingly for actions and status feedback. Their power comes from their rarity. **Never use accent colors for large, decorative background areas.**

#### **Color Tokens: Primary UI Palette**

These tokens are the single source of truth for all UI colors. They must be used for all components. **Do not use raw hex codes.**

**Surface Tokens (Backgrounds)**

| Token Name | Light Mode | Dark Mode | Usage |
| :--- | :--- | :--- | :--- |
| `color-surface-primary` | `#F9FAFB` | `#182531` | The main background color for pages. |
| `color-surface-secondary` | `#FFFFFF` | `#243340` | For elements on top of the primary surface: cards, modals. |
| `color-surface-inverse` | `#182531` | `#F9FAFB` | For high-contrast elements like tooltips or snackbars. |

**Text & Icon Tokens**

| Token Name | Light Mode | Dark Mode | Usage |
| :--- | :--- | :--- | :--- |
| `color-text-primary` | `#182531` | `#CFD8E3` | For all primary body copy, headlines, and main content. |
| `color-text-secondary` | `#475569` | `#94A3B8` | For supporting text like captions and timestamps. |
| `color-text-disabled` | `#94A3B8` | `#475569` | For text within a disabled component. |
| `color-text-inverse` | `#FFFFFF` | `#182531` | For text that appears on an inverted or colored surface. |

**Border Tokens**

| Token Name | Light Mode | Dark Mode | Usage |
| :--- | :--- | :--- | :--- |
| `color-border-subtle` | `#E2E8F0` | `#334155` | For subtle borders on cards, containers, and inputs. |
| `color-border-interactive` | `#94A3B8` | `#64748B` | The default border for interactive outlined components. |
| `color-border-focus` | `#3B7488` | `#58A6C5` | The highly visible outline for keyboard-focused elements. |

**Semantic Tokens (Status & Interaction)**

These colors carry specific meaning. They must be paired with an icon and/or text label.

| Status | Token Name | Light Mode | Dark Mode |
| :--- | :--- | :--- | :--- |
| **Interaction** | `color-interactive-primary` | `#3B7488` | `#58A6C5` |
| **Success** | `color-text-status-success` | `#368D6A` | `#4CAF83` |
| | `color-surface-status-success-subtle` | `#DEF7EC` | `#1E3C30` |
| **Warning** | `color-text-status-warning` | `#B97A11` | `#DCA52A` |
| | `color-surface-status-warning-subtle` | `#FEF5E3` | `#47320D` |
| **Error** | `color-text-status-error` | `#C65147` | `#E57373` |
| | `color-surface-status-error-subtle` | `#FDECEC` | `#50211D` |
| **Info** | `color-text-status-info` | `#3B7488` | `#58A6C5` |
| | `color-surface-status-info-subtle` | `#EBF5FF` | `#2A5464` |
#### **Color Tokens: Data Visualization Palette**

These colors are for **non-interactive, illustrative content only** (charts, graphs). They are not to be used for UI controls.

| Token Name | Value | Color Name |
| :--- | :--- | :--- |
| `color-data-01` | `#8B68A1` | Purple |
| `color-data-02` | `#5A82B3` | Blue |
| `color-data-03` | `#3AA39F` | Teal |
| `color-data-04` | `#D47C9A` | Pink |

---
---
### **1.4 Typography**

Our typography system prioritizes clarity, accessibility, and a modern aesthetic. We use a single, highly legible font family and a strict, consistent type scale to create a clear and predictable hierarchy, making content easy to scan and digest.

*   **Font Family:** **Inter**
    *   **Rationale:** We chose Inter for its exceptional legibility on screens, especially at smaller sizes. Its neutral yet friendly character supports our "Quiet Confidence" pillar, ensuring the content is the focus, not the font itself. It is an open-source font, making it universally accessible.

#### **Type Scale & Prescriptive Usage**

This scale is the single source of truth for all text styles. Each token defines the font size, weight, and line height. The line heights are designed to align with our 4px spacing grid. **Do not use custom font sizes or styles.**

| Token Name | Style (Size / Weight / Line Height) | Prescriptive Usage Rule |
| :--- | :--- | :--- |
| `typography-display`| 48px / Bold / 60px | **Marketing Only.** For hero sections on public-facing landing pages. Avoid within the core application UI to maintain a calm environment. |
| `typography-heading-xl`| 36px / Bold / 44px | **Screen Title Only.** The single, unique H1 for a page, defining its primary purpose. |
| `typography-heading-lg`| 24px / Bold / 32px | **Major Section Title.** The H2 that breaks a page into large, distinct content blocks. |
| `typography-heading-md`| 20px / Semi-Bold / 28px | **Component Title.** For titles of Cards, Modals, and discrete UI widgets. |
| `typography-body-lg` | 18px / Regular / 28px | **Long-form Content.** For articles or extensive instructions where enhanced readability for long periods is paramount. |
| `typography-body-md`| 16px / Regular / 24px | **Default Body.** This is the workhorse of our UI. It is the starting point for all standard text, paragraphs, and lists. Use this most often. |
| `typography-body-sm` | 14px / Regular / 20px | **Supporting Text.** Captions, helper text under inputs, metadata, and other secondary information that requires less prominence. |
| `typography-label-md`| 16px / Semi-Bold / 24px | **Primary Actions.** Text inside main buttons, navigation links, and tabs. The semi-bold weight ensures legibility in interactive elements. |
| `typography-label-sm`| 12px / Medium / 16px | **Tags & Badges.** For small, decorative labels like "New", "Beta", or category tags where space is limited. |

#### **Usage Guidelines**

*   **Hierarchy is Mandatory:** A screen must have a logical and semantic heading structure (e.g., H1 followed by H2s, then H3s). Do not skip heading levels for stylistic reasons, as this harms accessibility.
*   **Line Length:** For optimal readability, paragraphs of `typography-body-md` or `typography-body-lg` text should aim for a line length of 45 to 75 characters.
*   **Color:** All text must use a color token from the official palette (`color-text-primary`, `color-text-secondary`, etc.) to ensure it meets accessibility contrast standards.

---
---

### **1.5 Spacing & Layout**

Our approach to spacing is fundamental to achieving our "Clarity through Calmness" philosophy. We use a consistent, token-based scale to create visual rhythm, provide "breathing room" for content, and eliminate guesswork in design and development.

*   **The 4px Grid:** Every spacing value in our system is a multiple of 4. This mathematical consistency ensures that all elements align perfectly, creating a subtle but powerful sense of order and harmony.

#### **Spacing Tokens**

These tokens are the single source of truth for all spacing values, including `margin`, `padding`, and `gap`. **Do not use custom or "magic number" pixel values.**

| Token Name | Value | Recommended Usage Example |
| :--- | :--- | :--- |
| `space-xs` | 4px | Gaps between an icon and its text label. |
| `space-sm` | 8px | Padding inside small UI elements like tags and badges. |
| `space-md` | 12px | Padding inside inputs and other small form controls. |
| `space-lg` | 16px | Padding inside buttons; gaps between closely related content items (e.g., a title and its description). |
| `space-xl` | 24px | **Default Stack Spacing.** Gaps between form fields or list items. **Default Card Inset.** |
| `space-2xl` | 32px | **Default Page Section Inset.** Padding inside major layout containers. |
| `space-3xl`| 48px | **Section Stack Spacing.** The gap between major page sections (e.g., between a hero and the main content). |
| `space-4xl`| 64px | Vertical padding for the main page container to create generous top/bottom margins. |

#### **Layout Principles: Stacks and Insets**

These rules govern how components are composed into predictable and harmonious layouts.

**1. Insets (Internal Padding)**

Insets refer to the internal padding of a container that creates a consistent "frame" for its content.

*   **Rule:** The content inside a container should never touch the edges.
*   **Default Insets:**
    *   **Cards & Modals:** Must use `space-xl` (24px) for their internal padding.
    *   **Major Page Sections:** Must use `space-2xl` (32px) for their internal padding.

*(A visual diagram showing a card with `space-xl` padding on all sides would be here.)*

**2. Stacks (External Spacing)**

Stacks refer to the vertical spacing between sibling elements. Using consistent stack spacing creates a predictable rhythm down the page.

*   **Rule:** Elements in a vertical flow should be separated by a consistent spacing token.
*   **Default Stacks:**
    *   **Content Stacks:** The space between paragraphs, list items, or form fields **must** be `space-xl` (24px).
    *   **Section Stacks:** The space between major, distinct sections of a page **must** be `space-3xl` (48px).

*(A visual diagram showing two cards separated by `space-xl` and two page sections separated by `space-3xl` would be here.)*

---
---

### **1.6 Iconography**

Icons are a crucial part of the ShikhiLAB user interface. They are a universal visual language that communicates ideas and actions quickly and concisely. Our icons are designed to be clean, minimal, and instantly recognizable, supporting our "Clarity through Calmness" philosophy.

#### **Icon Style Principles**

To maintain a cohesive and professional aesthetic, all icons in the ShikhiLAB library adhere to the following style principles:

*   **Style:** **Line-based.** Our icons are primarily defined by their strokes, not fills. This creates a light, modern feel.
*   **Stroke Weight:** A consistent **1.5px stroke weight** is used across the entire set. This ensures visual harmony and optimal legibility.
*   **Corners:** Corners are slightly rounded (`2px` radius) to match the soft, friendly aesthetic of our typography (Inter) and button components.
*   **Simplicity:** Icons should be simple and clear in their meaning. Avoid unnecessary detail or decoration that can obscure the core concept.

#### **Usage Guidelines**

*   **Format:** All icons **must** be implemented as **SVG** (Scalable Vector Graphics). This ensures they are perfectly crisp on all screen resolutions and allows their color to be controlled via CSS (`currentColor`).
*   **Color:** Icons should inherit their color from the parent element's text color token.
    *   An icon inside a standard paragraph uses `color-text-primary`.
    *   An icon inside a primary button uses `color-button-primary-text`.
    *   An icon in a success alert uses `color-text-status-success`.
*   **Sizing:** Icons should be sized relative to the text they accompany. A standard icon paired with `typography-body-md` (16px) text should be `20px` by `20px` to provide a balanced visual weight.
*   **Spacing:** When an icon is paired with a text label (e.g., in a button or list item), there **must** be a `space-xs` (4px) gap between the icon and the text.

#### **Accessibility**

Accessibility is non-negotiable when using icons.

*   **Decorative Icons:** If an icon is purely decorative and accompanied by visible text that describes the action (e.g., a "Save" button with a floppy disk icon and the word "Save"), the icon should be hidden from screen readers by adding `aria-hidden="true"`.
*   **Interactive Icon-Only Buttons:** If an icon is used by itself for an interactive element (e.g., a close 'x' button, a settings cog), it **must** have an `aria-label` that describes its function. For example: `<button aria-label="Close"><IconX /></button>`. Without this, the button is unusable for screen reader users.

#### **Core Icon Library**

Below is a selection of core icons from our library. The full, searchable library is available in the Asset Library (`4.1`) and the Figma UI Kit (`4.2`).

*(A visual grid showcasing key icons from the library would be displayed here. Examples would include: Arrow (left, right, down), Checkmark, Close (X), Settings, User Profile, Plus, Minus, Warning Triangle, Info Circle, etc.)*

---
---

## **2. Components**

Welcome to the Component Library. This section provides the official, reusable building blocks for the ShikhiLAB interface. Using these pre-built components is mandatory to ensure consistency, accessibility, and speed of development.

**Core Principle:** Do not create a custom version of a component that already exists here. If a new variant or functionality is needed, submit a proposal to evolve the official component.

### **2.1 Button**

**Purpose:** The `Button` component is used to trigger a user-initiated action. It is the primary way a user interacts with the application, guiding them through flows and confirming decisions.

#### **Anatomy**
*   **Container:** The interactive wrapper that defines the button's shape and background.
*   **Label:** The text describing the action, styled with `typography-label-md`.
*   **Icon (Optional):** A supportive icon, typically placed to the left of the label with a `space-xs` gap.

#### **Props & API**
The `Button` component is flexible and compositional. Its appearance is controlled via props, ensuring consistency and preventing one-off styles.

*   `variant`: `filled` | `outlined` | `ghost`
    *   `filled`: (Default) For the highest-priority actions. A solid, high-contrast style.
    *   `outlined`: For medium-priority, secondary actions that need less visual weight than filled buttons.
    *   `ghost`: For low-priority, tertiary actions (e.g., "Cancel"). It is the most subtle button style.
*   `colorScheme`: `primary` | `error`
    *   `primary`: (Default) For all standard constructive or neutral actions. Uses the `Primary Slate` color family.
    *   `error`: For destructive actions (e.g., "Delete," "Remove"). Uses the `Danger Terra` color family.
*   `isDisabled`: `boolean` (Renders the button in its disabled state, making it non-interactive).

#### **Live Demo & Specifications**

*(This section in a live portal would feature an interactive playground. Below are the static specifications for designers and developers.)*

| Combination | Background Token | Text/Icon/Border Token(s) | Rationale |
| :--- | :--- | :--- | :--- |
| **Filled Primary** (`filled`, `primary`) | `color-button-primary-background` | `color-button-primary-text` | The most prominent call to action on a screen. |
| **Outlined Primary** (`outlined`, `primary`)| `transparent` | **Text:** `color-interactive-primary` <br/> **Border:** `color-border-interactive` | A secondary action that is still constructive. |
| **Ghost Primary** (`ghost`, `primary`) | `transparent` | `color-interactive-primary` | A low-emphasis action, like "Cancel." |
| **Filled Error** (`filled`, `error`) | `color-text-status-error` | `color-text-inverse` | A high-visibility, irreversible destructive action. |
| **Outlined Error** (`outlined`, `error`)| `transparent` | `color-text-status-error` | A less prominent destructive action. |
| **Ghost Error** (`ghost`, `error`) | `transparent` | `color-text-status-error` | A low-emphasis destructive action. |

#### **States**

All variants and color schemes must correctly implement the following states:

| State | Visual Change | Token(s) Used |
| :--- | :--- | :--- |
| **Hover** | Background/Text becomes darker/richer to indicate interactivity. | All `*-hover` tokens (e.g., `color-button-primary-background-hover`) |
| **Pressed**| Background/Text becomes its darkest/richest shade for tactile feedback. | All `*-pressed` tokens (e.g., `color-button-primary-background-pressed`)|
| **Focus** | A 2px solid outline appears around the button for keyboard navigation. | `color-border-focus` |
| **Disabled**| Component becomes semi-transparent and non-interactive. | `color-button-primary-background-disabled`, `color-button-primary-text-disabled`|

#### **Usage Guidelines**
*   **One Primary Button:** A given view or container (page, card, modal) should have only **one** `filled`, `primary` button to avoid confusing the user about the main call to action.
*   **Clarity is Key:** Button labels must be clear and action-oriented (e.g., "Save Changes," "Start Lesson," not just "Save" or "OK").
*   **Accessibility:** An icon-only button (e.g., a settings cog) **must** be implemented with an `aria-label` that describes its function.

---
---

### **2.2 Card**

**Purpose:** The `Card` component is a themed surface container used to group related information and actions into a single, digestible, and self-contained unit. It is one of the most fundamental layout components in our system.

#### **Anatomy**
*   **Container:** The main wrapper for the card's content. It provides elevation or separation from the main page background, creating a clear visual boundary. All content within a card must respect its internal padding (inset).

#### **Props & API**
The `Card` component's appearance can be modified for different contextual needs using a single prop.

*   `variant`: `elevated` | `outlined`
    *   `elevated`: (Default) Uses a subtle shadow to lift the card off the page. This is the primary and most common style, used for key content modules.
    *   `outlined`: Uses a simple, clean border instead of a shadow. This variant is ideal when a less prominent container is needed, such as for secondary information or when cards are nested within other containers.

#### **Live Demo & Specifications**

*(This section in a live portal would show both card variants with sample content inside.)*

| Variant | Box Shadow Token | Border Token | Background Token | Padding (Inset) Token |
| :--- | :--- | :--- | :--- | :--- |
| `elevated` | `shadow-sm` | `none` | `color-surface-secondary`| `space-xl` (24px) |
| `outlined` | `none` | `1px solid color-border-subtle` | `color-surface-secondary`| `space-xl` (24px) |

*(Note: We have tokenized the shadow value as `shadow-sm` = `0px 2px 4px rgba(24, 37, 49, 0.05)` for system consistency.)*

#### **Composition & Content**

*   **Header (Optional):** A card can contain a header section, typically using `typography-heading-md` for a title. The header should be the first element and separated from the body content by `space-lg`.
*   **Body:** The main content of the card. This can be text, images, lists, or other components.
*   **Footer (Optional):** A card can contain a footer section, often used for action buttons. The footer should be the last element and separated from the body by `space-lg`.

#### **Usage Guidelines**
*   **Grouping:** Only place content inside a card that is thematically related. A card should represent a single, cohesive idea or object.
*   **Spacing:** When displaying multiple cards in a list or grid, they **must** be separated by at least `space-xl` (24px) to ensure they have adequate breathing room and don't feel crowded.
*   **Nesting:** Avoid placing an `elevated` card inside another `elevated` card. If nesting is required, place an `outlined` card inside an `elevated` one to maintain a clear visual hierarchy.

---
---
### **2.3 Input Field**

**Purpose:** The `InputField` component is a controlled wrapper for capturing user-submitted data via text entry. It is a fundamental part of all forms and interactive dialogues.

#### **Anatomy**
*   **Label:** A clear, descriptive title for the required input. Styled with `typography-body-sm`.
*   **Container:** The input field's background and border, which visually changes based on its state.
*   **Input Text:** The text entered by the user, styled with `typography-body-md`.
*   **Helper Text / Icon:** A dedicated space below the input for providing guidance, instructions, or real-time validation feedback.

#### **Props & API**

The `InputField` is designed as a single, intelligent component. Its state and feedback are managed through props.

*   `status`: `default` | `success` | `warning` | `error`
    *   This single prop controls the border color, helper text color, and the associated icon, ensuring consistent and accessible feedback.
*   `helperText`: `string` (The message displayed below the input).
*   `isDisabled`: `boolean` (Renders the input in a non-interactive, visually muted state).
*   `label`: `string` (The visible label text for the input).

#### **Developer Implementation Pattern**

The component should encapsulate its own state logic. A developer should only need to pass a single `status` prop to correctly style all related elements.

```jsx
// React Pseudocode
function InputField({ label, helperText, status = 'default', ...props }) {
  // Logic to get the correct tokens based on the 'status' prop
  const containerBorderToken = getTokenFor('border', status);
  const helperTextToken = getTokenFor('text', status);
  const IconComponent = getIconFor(status);

  return (
    <div className="input-field-wrapper">
      <label htmlFor={props.id}>{label}</label>
      <div className="input-container" style={{ borderColor: containerBorderToken }}>
        <input id={props.id} {...props} />
      </div>
      {helperText && (
        <div className="helper-text" style={{ color: helperTextToken }}>
          {IconComponent && <IconComponent />} {helperText}
        </div>
      )}
    </div>
  );
}
```

#### **Live Demo & States**

*(An interactive demo would show how changing the `status` prop automatically updates the entire component's appearance and accessibility attributes.)*

| State / Status | Container Border Token | Helper Text / Icon Color Token | Rationale |
| :--- | :--- | :--- | :--- |
| **Default** | `color-border-subtle` | `color-text-secondary` | The neutral resting state before user interaction. |
| **Focus** | `color-border-focus` | `color-text-secondary` | A clear, high-contrast outline indicates the user is actively typing. |
| **Success** | `color-text-status-success` | `color-text-status-success` | Confirms valid input, encouraging the user. |
| **Warning** | `color-text-status-warning` | `color-text-status-warning` | Provides a non-critical suggestion or cautionary note. |
| **Error** | `color-text-status-error` | `color-text-status-error` | Clearly indicates invalid input that must be fixed. |
| **Disabled** | `color-border-subtle` | `color-text-disabled` | Visually indicates the field is not interactive. The background should also be muted. |

#### **Usage Guidelines**
*   **Accessibility is Mandatory:** Every `InputField` **must** have a corresponding `<label>` that is programmatically linked to it using the `for` and `id` attributes. This is a critical WCAG requirement.
*   **Provide Clear Feedback:** Always use the `helperText` and the `status` prop to provide immediate and clear validation feedback. Don't wait until the user submits the form to tell them there's an error.
*   **Don't Hide Labels:** While placeholder text can be used as a hint, it is **not** a replacement for a visible `<label>`.

---
---
### **2.4 Alert**

**Purpose:** The `Alert` component is used to communicate a prominent but non-interruptive message to the user. It is designed to convey important information related to a specific status or context without disrupting the user's workflow.

#### **Anatomy**
*   **Container:** The main wrapper for the alert message. Its styling immediately communicates the nature of the message.
*   **Icon:** A mandatory symbol representing the status of the alert.
*   **Text Content:** The message itself, styled with `typography-body-md`.
*   **Dismiss Button (Optional):** An icon-only button allowing the user to close the alert.

#### **Props & API**

The `Alert` component's appearance and meaning are controlled by its props.

*   `status`: `success` | `warning` | `error` | `info`
    *   This is the most important prop. It dictates the color scheme and icon, ensuring the alert is semantically correct and accessible. The `info` status uses our `primary` color scheme for helpful, non-critical guidance.
*   `variant`: `subtle` | `filled`
    *   `subtle`: (Default) A softer appearance with a colored border accent and a light background. Ideal for inline messages that are part of the page content.
    *   `filled`: A high-contrast version with a solid colored background. Ideal for high-visibility "toast" or "snackbar" notifications that overlay the UI.
*   `isDismissible`: `boolean` (If `true`, a close button is rendered).

#### **Live Demo & Specifications**

*(This section in a live portal would feature an interactive playground to toggle the `status` and `variant` props.)*

| Variant & Status | Background Token | Text/Icon Color Token | Border Accent |
| :--- | :--- | :--- | :--- |
| **Subtle Success** | `color-surface-status-success-subtle`| `color-text-status-success` | `4px solid color-text-status-success` |
| **Filled Success** | `color-text-status-success` | `color-text-inverse` | `none` |
| **Subtle Warning** | `color-surface-status-warning-subtle`| `color-text-status-warning` | `4px solid color-text-status-warning` |
| **Filled Warning** | `color-text-status-warning` | `color-text-inverse` | `none` |
| **Subtle Error** | `color-surface-status-error-subtle`| `color-text-status-error` | `4px solid color-text-status-error` |
| **Filled Error** | `color-text-status-error` | `color-text-inverse` | `none` |
| **Subtle Info** | `color-surface-interactive-primary-subtle`| `color-interactive-primary` | `4px solid color-interactive-primary` |
| **Filled Info** | `color-interactive-primary` | `color-text-inverse` | `none` |


#### **Usage Guidelines**
*   **Accessibility First:** An `Alert` **must always** include both an `Icon` and `Text Content`. This fulfills our "clarity beyond color" accessibility principle, ensuring the message is understood by all users.
*   **Use the Right Variant:**
    *   Use the `subtle` variant for static messages that are part of a page's layout (e.g., "Your profile is incomplete.").
    *   Use the `filled` variant for asynchronous, temporary notifications (toasts/snackbars) that appear in response to a user action (e.g., "Lesson saved successfully.").
*   **Be Concise:** Alert messages should be brief and to the point. If more information is needed, provide a link within the alert text to a more detailed page or help document.

---
---

### **2.5 Modal**

**Purpose:** The `Modal` component is a dialog window that overlays the primary page content to capture the user's full attention. It is used for critical tasks, confirmations, or focused content that must be handled before the user can return to the main flow.

**Philosophy:** Modals are intentionally interruptive. As such, they should be used sparingly and only when necessary to prevent user error or to present a short, self-contained task.

#### **Anatomy**
*   **Overlay:** A semi-transparent layer (`rgba(24, 37, 49, 0.6)`) that covers the main page, indicating that the content below is temporarily inactive.
*   **Container:** The main modal window. It uses the `Card (elevated)` style for its surface and shadow, making it feel like it sits on top of the overlay.
*   **Header:** A dedicated section at the top of the modal.
    *   **Title (`typography-heading-md`):** A clear, concise title describing the modal's purpose.
    *   **Close Button:** An icon-only `Button` (`ghost` variant) with an 'x' icon to dismiss the modal.
*   **Body:** The main content area of the modal. This can contain forms, text, or other components.
*   **Footer:** A dedicated section at the bottom for action buttons.

#### **Props & API**
*   `isOpen`: `boolean` (Controls the visibility of the modal).
*   `onClose`: `function` (The function called when the user clicks the Overlay or the Close Button).
*   `title`: `string` (The text displayed in the modal header).

#### **Live Demo & Specifications**

*(This section would show a button that, when clicked, opens a fully styled modal.)*

| Element | Style Property | Token(s) / Value |
| :--- | :--- | :--- |
| **Overlay** | `background-color` | `rgba(24, 37, 49, 0.6)` |
| **Container**| `background-color`| `color-surface-secondary` |
| | `box-shadow` | `shadow-sm` (same as Card) |
| | `border-radius`| `8px` |
| | `max-width` | `560px` |
| **Header** | `padding` | `space-xl` (24px) |
| | `border-bottom` | `1px solid color-border-subtle` |
| **Body** | `padding` | `space-xl` (24px) |
| **Footer** | `padding` | `space-xl` (24px) |
| | `border-top` | `1px solid color-border-subtle` |
| | `display` | `flex`, `justify-content: flex-end` |

#### **Usage Guidelines**
*   **Use Sparingly:** Do not use a modal for content that is not urgent or does not require focused user interaction. If the content could live on its own page, it probably should.
*   **Keep it Simple:** Modal content should be concise. Avoid complex navigation or multi-step processes within a modal. If a task is too complex, it deserves its own dedicated page.
*   **Action Buttons:** The modal footer should contain clear action buttons, typically a `Primary Button` for the main confirmation and a `Ghost` or `Outlined Button` for cancellation. See the **`Destructive Actions` Pattern (3.2)** for specific examples.

#### **Accessibility**
*   **Focus Management:** When a modal opens, keyboard focus **must** be moved to the first focusable element inside it (often the close button or the first input).
*   **Focus Trapping:** While the modal is open, keyboard focus **must** be trapped within it. The user should not be able to tab to the content underneath the overlay.
*   **Dismissal:** The modal must be dismissible by:
    1.  Clicking the Close Button.
    2.  Clicking the Overlay.
    3.  Pressing the `Escape` key.
*   **ARIA Roles:** Use `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` (pointing to the title's ID) to ensure screen readers announce the modal context correctly.

---

### **2.6 Tooltip**

**Purpose:** The `Tooltip` component provides a small, contextual "tip" or piece of information that appears when a user hovers over or focuses on an element. It is used to clarify an icon's function or provide brief, non-essential supplementary information.

**Philosophy:** Tooltips are for hints, not for critical information. The application must be fully usable and understandable even if the user never sees a single tooltip.

#### **Anatomy**
*   **Trigger:** The UI element that the user interacts with (hovers/focuses on) to reveal the tooltip.
*   **Container:** The floating box that contains the tooltip's text content. It includes a small "tail" or "arrow" that points to the trigger element.

#### **Props & API**
*   `label`: `string` (The text content displayed inside the tooltip).
*   `placement`: `top` | `bottom` | `left` | `right`
    *   (Default: `bottom`) Controls the position of the tooltip relative to its trigger element.

#### **Live Demo & Specifications**

*(This section would show several elements, like an icon-only button, that reveal a tooltip on hover.)*

| Element | Style Property | Token(s) / Value |
| :--- | :--- | :--- |
| **Container**| `background-color`| `color-surface-inverse` |
| | `padding` | `space-sm` (8px) on top/bottom, `space-md` (12px) on left/right |
| | `border-radius`| `4px` |
| **Text** | `typography` | `typography-body-sm` |
| | `color` | `color-text-inverse` |

**Rationale for Inverse Styling:** The `Tooltip` uses our `inverse` tokens to ensure it has maximum contrast against the standard page UI. This makes it "pop" and immediately draws the user's eye, clearly separating it from the underlying content.

#### **Usage Guidelines**
*   **For Non-Critical Information Only:** Never place essential information required to complete a task inside a tooltip. A user might not discover it.
*   **Keep it Brief:** Tooltip content should be a short phrase or sentence. If the explanation is longer than a few words, consider using a different pattern, like a dismissible "Info" `Alert`.
*   **Primary Use Case:** The most common and important use case for a `Tooltip` is to provide a visible label for an icon-only `Button`. This is a crucial usability enhancement. For example, a settings cog icon button should have a tooltip with the label "Settings".

#### **Accessibility**
*   **Triggering:** The tooltip must appear on both `hover` and keyboard `focus`. This ensures that keyboard-only users have access to the same information as mouse users.
*   **Timing:** The tooltip should appear after a short delay (e.g., 200ms) to prevent it from flashing annoyingly as the user moves their mouse across the screen. It should hide immediately when the user moves their mouse away or focus is moved.
*   **ARIA Roles:** While not always required for simple tooltips that supplement a visible label, for icon-only buttons, the `aria-label` on the button itself is the most critical accessibility feature. The tooltip provides a visual enhancement for sighted users.

---
---
## **3. Patterns**

Welcome to the Patterns Library. While **Foundations** provide our principles and **Components** provide our building blocks, this section provides the architectural blueprints. A Pattern is a reusable, best-practice solution to a common design problem, ensuring we solve these problems consistently across the entire application.

### **3.1 Form Design & Validation**

**Problem:** How do we create forms that are easy to use, accessible, and provide clear feedback without causing user anxiety or frustration?

**Philosophy:** Our forms should feel like a guided conversation, not an interrogation. We use clear hierarchy, generous spacing, and real-time feedback to make the process calm, efficient, and confidence-inspiring.

#### **Composition (The Recipe)**

A standard ShikhiLAB form is composed of the following components in a specific vertical stack. This structure should be followed to maintain consistency.

1.  **Form Title (`typography-heading-md`):** A clear title describing the form's purpose (e.g., "Create Your Account," "Update Profile Settings").
2.  **Form Description (`typography-body-md`):** (Optional) A brief sentence to provide context or instructions.
3.  **A Stack of `InputField` Components:**
    *   Each `InputField` is a complete unit containing a `Label`, the `input` itself, and a space for `Helper Text`.
    *   The vertical space between each `InputField` in the stack **must** be `space-xl` (24px).
4.  **Form Actions:**
    *   A container for the action buttons, placed at the very end of the form, aligned to the right.
    *   There **must** be one, and only one, **`Button` (variant: "filled", colorScheme: "primary")** for the primary submission action (e.g., "Save Changes").
    *   Secondary actions (e.g., "Cancel," "Reset") **must** use a lower-prominence button, typically **`Button` (variant: "ghost", colorScheme: "primary")**.

#### **Validation Pattern**

Our validation pattern is designed to be proactive and encouraging.

*   **Real-time, Inline Validation:** Validation logic should run as the user moves from one field to the next (on the `onBlur` event), not just when they click the final "Submit" button.
*   **Provide Positive Feedback:** When a field is filled out correctly according to its validation rules, its `status` prop should be immediately updated to `"success"`. This provides positive reinforcement and lets the user know they are on the right track.
*   **Write Gentle, Actionable Error Messages:** When an error occurs, update the `status` to `"error"`. The `helperText` must be clear and helpful.
    *   **Don't:** "Invalid input."
    *   **Do:** "Please enter a valid email address."
*   **Control the Submit Button State:** The primary submit `Button` **must** be in its `isDisabled` state until all required fields are filled out and have passed validation. This prevents premature submissions and reduces the cognitive load of dealing with a full-form error summary.

#### **Visual Example**

*(A clean mockup showing a complete form with a title, two `InputField` components—one in a success state with green accents and one in an error state with red accents and helper text—and correctly styled "Save Changes" and "Cancel" buttons at the bottom.)*

---
---

### **3.2 Pattern: Destructive Actions & Confirmation**

**Problem:** How do we allow users to perform irreversible actions (e.g., deleting content, canceling a subscription) in a way that is safe, clear, and prevents accidental data loss?

**Philosophy:** A destructive action must be a deliberate, two-step process. We must first clearly signal the potential danger with a low-emphasis trigger, and then require explicit, high-emphasis confirmation from the user.

#### **Composition (The Recipe)**

1.  **Step 1: The Initiator**
    *   The button or link that initiates the destructive action **must** be styled to indicate caution and require deliberate intent. It should **never** be a primary filled button.
    *   **Recommended:** Use a `Button` with `variant="ghost"` and `colorScheme="error"`. The red color signals danger, while the ghost style prevents it from being the most prominent element on the page.
    *   **Example:** `<Button variant="ghost" colorScheme="error">Delete Account</Button>`.

2.  **Step 2: The Confirmation `Modal`**
    *   Clicking the initiator button **must** open a confirmation `Modal` component. This interrupts the user's flow and forces them to focus on the decision.
    *   **Modal Title (`typography-heading-md`):** Must be an unambiguous question.
        *   **Don't:** "Are you sure?"
        *   **Do:** "Delete This Chapter?"
    *   **Modal Body (`typography-body-md`):** Must clearly and concisely explain the permanent consequence of the action.
        *   **Example:** "This action cannot be undone. All associated progress, notes, and quiz results for this chapter will be permanently lost."
    *   **Confirmation Actions (in Modal Footer):**
        *   The final confirmation button **must** be a **`Button` (variant: "filled", colorScheme: "error")**. Its label must echo the action to reinforce the consequence (e.g., "Yes, Delete Chapter").
        *   The cancellation button **must** be a lower-prominence, safe-feeling button, typically a **`Button` (variant: "outlined", colorScheme: "primary")**. Its label should be a simple "Cancel." This makes the safe option easy to choose.

#### **Visual Example**

*(A two-part mockup: The first shows a settings page with a subtle red "Delete Account" link at the bottom. The second shows the confirmation modal that appears, featuring a prominent red "Yes, Delete" button and a less prominent "Cancel" button.)*

---

### **3.3 Pattern: Onboarding & Feature Discovery**

**Problem:** How do we introduce new users to the application or highlight new features without being intrusive or overwhelming?

**Philosophy:** Onboarding should be contextual, helpful, and easily dismissible. We guide, we don't force. Our goal is to empower users, not to dictate their journey.

#### **Composition (The Recipe)**

1.  **For Broad, Contextual Announcements: The "Info" `Alert`**
    *   **When to Use:** To announce a new feature set or provide a helpful tip that is relevant to the current page.
    *   **Implementation:** Use an `Alert` with `status="info"` and `variant="subtle"`. The "info" status uses our `Primary Slate` color, making it feel like a helpful, on-brand piece of guidance, not an alarming warning.
    *   **Content:** The alert should contain a brief, helpful tip and a link to learn more. Example: "New! You can now add notes to any lesson. <u>Learn how</u>."
    *   **Dismissible:** The alert **must** include a close ('x') icon by setting `isDismissible={true}`, allowing the user to permanently dismiss it and take control of their interface.

2.  **For Specific Element Highlighting: The `Tooltip`**
    *   **When to Use:** To clarify the function of a single, specific UI element, most often an icon-only button.
    *   **Implementation:** Attach a `Tooltip` component to the target element. The tooltip appears on hover or keyboard focus.
    *   **Content:** The tooltip's `label` should be a concise noun or verb phrase. Example: For a cog icon, the tooltip label is "Settings."
    *   **Style:** The `Tooltip` component automatically uses our `inverse` tokens to ensure it stands out clearly against the UI.

#### **Visual Example**

*(A mockup of a screen with a subtle blue "Info" alert banner at the top, complete with a close button. Another small visual shows a cursor hovering over a cog icon, revealing a dark tooltip that says "Settings".)*

---
---
## **4. Resources**

Welcome to the Resources section. This is your toolkit and support center for using and contributing to the Clarity Design System. Here you will find direct links to our libraries, assets, checklists, and help channels.

### **4.1 Asset Library**

**Purpose:** To provide a single, version-controlled source of truth for all official, static brand and design assets. This prevents the use of outdated logos, icons, or marketing materials.

#### **What You'll Find Here:**

*   **Logos:** All official logo variations (Primary, Logomark, Wordmark, Localized) in SVG and PNG formats for both light and dark backgrounds.
*   **Icons:** The complete, searchable icon library, with each icon available as an individual, optimized SVG file.
*   **Marketing Templates:** Official templates for social media banners, presentations, and other marketing collateral.
*   **Documentation:** A PDF version of these Brand Guidelines for offline use or sharing with external partners.

#### **Access & Governance**

*   **Location:** [Link to the official Google Drive, Dropbox, or DAM folder]
*   **Golden Rule:** **Always pull assets from this central library.** Do not store local copies for long-term use, as they may become outdated.
*   **Versioning:** The root folder is named with the current version and date (e.g., `ShikhiLAB Brand Assets (v1.2 - 2023-10-27)`). A `Changelog.md` file documents all updates.

### **4.2 Figma UI Kit**

**Purpose:** The official Figma library file containing all foundational styles (color, type, spacing) and master components. This is the primary tool for designers to build high-fidelity, system-compliant mockups with speed and consistency.

#### **How to Use:**

1.  **Enable the Library:** Open Figma, go to the "Assets" panel, click the "Team library" icon, and enable the "ShikhiLAB Clarity UI Kit."
2.  **Design with Components:** Drag and drop components from the Assets panel. Use the right-hand sidebar to configure variants and props (e.g., changing a `Button` variant from `filled` to `outlined`).
3.  **Apply Styles:** For all text and color fills, use the pre-defined Color and Text Styles. **Do not detach styles or use local colors.**

*   **Location:** [Link to the Figma Library File]

### **4.3 Getting Help & Providing Feedback**

A design system is a living product that improves with feedback from its users—you.

#### **Communication Channels**

*   **#design-system on Slack:** This is the primary channel for all day-to-day questions, quick feedback, and announcements.
    *   **Best for:** "How do I...?", "Is there a token for...?", "I think I found a small bug."
*   **Weekly Office Hours:** A recurring 1-hour video call held every **Thursday at 3 PM**. This is an open forum to discuss more complex challenges, demo new work, or get live help from the core design system team.
    *   **Best for:** Live-debugging a component implementation, workshopping a new pattern, or in-depth discussions.

#### **Governance: Proposing Changes**

We have a structured process for suggesting new components or significant changes to the system. This ensures that Clarity evolves thoughtfully.

1.  **Submit a Proposal:** Fill out the "Design System Change Proposal" form [Link to form/template]. The proposal must include the problem, the proposed solution, and justification for why existing components are insufficient.
2.  **Review:** The core design system team reviews proposals bi-weekly.
3.  **Decision & Prioritization:** If approved, the proposal is added to the design system backlog and prioritized. The status will be tracked and communicated in the #design-system channel.

### **4.4 Checklists & Best Practices**

Use these checklists before finalizing a design or committing code to ensure quality and consistency.

#### **✅ Pre-Flight Checklist for Designers**

*   **Philosophy:** Does my design uphold "Clarity through Calmness"? Does it reduce cognitive load?
*   **Tokens:** Have I used **only** official color, type, and spacing tokens? (No detached styles).
*   **Hierarchy:** Is the visual hierarchy clear? Is there one, and only one, H1-level title on the screen?
*   **Components:** Have I used official components wherever possible, instead of creating a one-off design?
*   **Actions:** Is there a single, clear Primary Button for the main action? Are secondary actions styled with a lower-prominence variant?
*   **Accessibility:** Is all text legible? Have I paired all status colors with an icon/text? Have I considered focus states?

#### **✅ Pre-Commit Checklist for Developers**

*   **Tokens:** Is every CSS value (color, font-size, margin, padding) referencing a design system token (`var(--color-...)`)?
*   **Components:** Have I used the shared component from the library (e.g., `<Button>`) instead of building a custom `div` or `button`?
*   **Accessibility (A11y):**
    *   Are all images using meaningful `alt` attributes?
    *   Are all interactive elements keyboard-navigable and have a visible focus state (`color-border-focus`)?
    *   Are ARIA attributes used correctly (e.g., `aria-label` for icon-only buttons)?
*   **States:** Have I implemented all required states for interactive components (`:hover`, `:focus-visible`, `:disabled`, `:active`)?
*   **Responsiveness:** Does the layout adapt gracefully to different screen sizes?

### **4.5 Changelog**

**Purpose:** To maintain a transparent and chronological record of all changes, updates, and additions to the design system. This is crucial for keeping the team informed about what's new and what might have changed.

**Example Entry:**

> ### **[v1.3.0] - 2023-11-15**
>
> #### **Added**
> *   **New Component: `Modal`**. Added a fully accessible modal component for handling confirmation dialogues and focused content overlays.
>
> #### **Changed**
> *   **Button Component:** The `colorScheme="error"` prop now supports the `ghost` variant for more flexibility in destructive action patterns.
>
> #### **Fixed**
> *   **Dark Mode:** Corrected the hover state color for `color-button-primary-background-hover` in dark mode to improve contrast.

*   **Location:** [Link to the Changelog.md file or Notion page]

---