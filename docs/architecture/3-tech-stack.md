# **3. Tech Stack**

This is the definitive, locked-in technology stack for the project.

| Category | Technology | Version |
| :--- | :--- | :--- |
| **Frontend Framework**| Next.js | `14.2.3` |
| **UI Library** | Radix UI + Tailwind CSS | `~1.0.0` / `3.4.1`|
| **Frontend Language** | TypeScript | `5.4.5` |
| **State Management** | Zustand | `4.5.2` |
| **Backend Runtime** | Node.js | `20.11.1` (LTS)|
| **Backend Framework** | Express.js | `4.19.2` |
| **Backend Language** | TypeScript | `5.4.5` |
| **Database** | Google Firestore & Cloud SQL| `latest` |
| **AI Integration** | Google Gemini via AI Platform| `latest` |
| **Monorepo Tool** | Turborepo | `1.13.3` |
| **PWA Toolkit** | `next-pwa` | `5.6.0` |
| **Testing** | Jest & React Testing Library| `~29.7.0` |

### **Implementation Directives**

  * **Next.js Server Component Principle:** Components must be Server Components by default. The `'use client'` directive should only be used when client-side interactivity is explicitly required.
  * **Initial Development Priority:** The first development stories must be dedicated to building the foundational 'Clarity' design system components.

-----
