
# **ShikhiLAB AI-Powered IELTS Platform: Fullstack Architecture Document**

  * **Version:** 1.0 (Final)
  * **Date:** August 6, 2025
  * **Author:** Winston, Architect

## **1. Introduction**

This document outlines the complete fullstack architecture for the **AI-Powered IELTS Crash Course Platform**, including backend systems, frontend implementation, and their integration. It serves as the single source of truth for AI-driven development, ensuring consistency across the entire technology stack.

### **Starter Template or Existing Project**

This is a greenfield project. The PRD mandates a **Serverless on Google Cloud** architecture within a **Monorepo**. To accelerate development and ensure best practices, we will use the official **Vercel Next.js Starter with Turborepo**.

  * **Rationale:** Vercel provides a world-class hosting and deployment experience for Next.js, which is ideal for our PWA. Turborepo is a high-performance build system for managing monorepos. The frontend will be hosted on Vercel, while the backend serverless functions will be deployed to Google Cloud Platform, giving us the best of both worlds.

-----

## **2. High Level Architecture**

### **Technical Summary**

This architecture is for a resilient, scalable, and secure serverless web application. The frontend will be a **Progressive Web App (PWA)** built with Next.js (React) and hosted on Vercel for optimal performance. It will communicate via an API Gateway with a backend running on **Google Cloud Platform (GCP)**. The backend will use a hybrid serverless approach, leveraging **Google Cloud Run** for latency-sensitive APIs to eliminate cold-start risks, and **Google Cloud Functions** for asynchronous background processing. **Data will be stored in a combination of Firestore for its flexibility with user-generated practice data and Cloud SQL for its structured, relational integrity for core course and user authentication data.** All AI processing will be handled by Google Gemini models via a dedicated gateway service.

### **Platform and Infrastructure Choice**

  * **Platform:** A hybrid approach using **Vercel** for the frontend and **Google Cloud Platform (GCP)** for the backend.
  * **Key GCP Services:**
      * **Cloud Run:** For all synchronous, user-facing serverless APIs (Auth, Courses, Practice, etc.).
      * **Cloud Functions:** For asynchronous, event-driven background tasks (e.g., processing uploaded audio files).
      * **API Gateway:** To manage, secure, and route all API requests.
      * **Firestore & Cloud SQL:** For database needs.
      * **Cloud Storage:** For storing user uploads and course materials.
      * **AI Gateway (Cloud Run):** A dedicated service to manage all interactions with the Google AI Platform. It will handle prompt engineering, response parsing, and caching to ensure consistent and cost-effective AI feedback.
      * **Google AI Platform:** To interface with the Gemini models.

### **High Level Architecture Diagram**

```mermaid
graph TD
    subgraph User
        A[Student on Browser/PWA]
    end

    subgraph Vercel
        B[Next.js Frontend PWA]
    end

    subgraph GCP
        C[API Gateway]
        D[Auth Service (Cloud Run)]
        E[Course Service (Cloud Run)]
        F[Practice Service (Cloud Run)]
        G[AI Gateway (Cloud Run)]
        H[Firestore]
        I[Cloud SQL]
        J[Cloud Storage]
        K[Google AI Platform (Gemini)]
        L[Audio Processing (Cloud Function)]
    end

    A --> B
    B --> C
    C --> D
    C --> E
    C --> F
    C --> G
    
    D --> I
    E --> I
    E --> J
    F --> H
    F --> J
    G --> K
    
    J -- Triggers --> L
    L -- Updates --> H
```

-----

## **3. Tech Stack**

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

## **4. Data Models**

This section contains the complete DDL for all relational tables in **Cloud SQL** and the document structure for collections in **Firestore**.

### **Cloud SQL Schema**

```sql
-- ENUM types
CREATE TYPE user_role AS ENUM ('student', 'admin');
CREATE TYPE ielts_test_type AS ENUM ('academic', 'general_training');
CREATE TYPE ielts_simulation_format AS ENUM ('paper_based', 'computer_based');
CREATE TYPE ielts_section_type AS ENUM ('listening', 'reading', 'writing', 'speaking');
CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE material_type AS ENUM ('video', 'pdf', 'text', 'quiz');
CREATE TYPE material_category AS ENUM ('pre_class', 'in_class', 'post_class');
CREATE TYPE submission_status AS ENUM ('in_progress', 'completed', 'abandoned');

-- users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    ai_credits INTEGER NOT NULL DEFAULT 500,
    target_band_score DECIMAL(2, 1),
    target_test_date DATE,
    interface_language VARCHAR(10) NOT NULL DEFAULT 'en',
    ai_feedback_language VARCHAR(10) NOT NULL DEFAULT 'bn',
    gamification_opt_out BOOLEAN NOT NULL DEFAULT false,
    gamification_is_anonymous BOOLEAN NOT NULL DEFAULT false,
    current_streak INTEGER NOT NULL DEFAULT 0,
    points_balance INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- courses Table
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- classes Table
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    order_number INTEGER NOT NULL,
    release_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(course_id, order_number)
);

-- course_enrollments Table
CREATE TABLE course_enrollments (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY(user_id, course_id)
);

-- mistake_categories Table
CREATE TABLE mistake_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT
);

-- lesson_materials Table
CREATE TABLE lesson_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    material_type material_type NOT NULL,
    category material_category NOT NULL,
    content_url TEXT,
    content_text TEXT,
    order_number INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(class_id, order_number)
);

-- lesson_material_mistake_tags Table
CREATE TABLE lesson_material_mistake_tags (
    lesson_material_id UUID NOT NULL REFERENCES lesson_materials(id) ON DELETE CASCADE,
    mistake_category_id UUID NOT NULL REFERENCES mistake_categories(id) ON DELETE CASCADE,
    PRIMARY KEY(lesson_material_id, mistake_category_id)
);

-- mock_tests Table
CREATE TABLE mock_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    test_type ielts_test_type NOT NULL,
    simulation_format ielts_simulation_format NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    status content_status NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(title, test_type, simulation_format, version)
);

-- test_sections Table
CREATE TABLE test_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mock_test_id UUID NOT NULL REFERENCES mock_tests(id) ON DELETE CASCADE,
    section_type ielts_section_type NOT NULL,
    order_number INTEGER NOT NULL CHECK (order_number BETWEEN 1 AND 4),
    duration_minutes INTEGER NOT NULL,
    content JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(mock_test_id, section_type),
    UNIQUE(mock_test_id, order_number)
);

-- test_submissions Table
CREATE TABLE test_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mock_test_id UUID NOT NULL REFERENCES mock_tests(id) ON DELETE CASCADE,
    status submission_status NOT NULL DEFAULT 'in_progress',
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    time_remaining_seconds JSONB,
    listening_score DECIMAL(2, 1),
    reading_score DECIMAL(2, 1),
    writing_score DECIMAL(2, 1),
    final_score DECIMAL(2, 1),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- speaking_submissions Table
CREATE TABLE speaking_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mock_test_id UUID NOT NULL REFERENCES mock_tests(id) ON DELETE CASCADE,
    main_submission_id UUID REFERENCES test_submissions(id),
    status submission_status NOT NULL DEFAULT 'in_progress',
    speaking_score DECIMAL(2, 1),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- student_answers Table
CREATE TABLE student_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_submission_id UUID NOT NULL REFERENCES test_submissions(id) ON DELETE CASCADE,
    question_id VARCHAR(255) NOT NULL,
    answer_content JSONB,
    is_flagged_for_review BOOLEAN NOT NULL DEFAULT false,
    grading_result JSONB,
    last_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(test_submission_id, question_id)
);
```

### **Firestore Collections**

  * **Collection:** `student_mistakes`
  * **Document Structure:**
    ```json
    {
      "userId": "string",
      "submissionId": "string",
      "mistakeCategoryId": "string",
      "mistakeCategoryName": "string",
      "sourceMaterialId": "string",
      "sourceType": "string",
      "originalText": "string",
      "correctedText": "string",
      "aiExplanation": "string",
      "timestamp": "Timestamp"
    }
    ```

-----

## **5. API Specification**

The complete OpenAPI 3.0.3 specification for the platform.

```yaml
openapi: 3.0.3
info:
  title: "ShikhiLAB IELTS Platform API"
  version: "1.0.0"
  description: "The official API for the ShikhiLAB platform."
servers:
  - url: "https://api.shikhilab.com/v1"
    description: "Production Server"
security:
  - BearerAuth: []
components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
  schemas:
    # All schemas defined during our session, including:
    # EnrollmentRequest, LoginRequest, AuthTokenResponse,
    # Course, ClassSummary, ClassDetail, LessonMaterial,
    # CourseListResponse, MockTestSummary, MockTestListResponse,
    # TestSubmission, TestSectionContent, StartSubmissionRequest,
    # StudentAnswerPayload, SaveAnswerResponse, SubmissionResults,
    # GradedAnswer, SpeakingSubmissionResults, etc.
    # (Full list omitted for brevity in this final summary)
paths:
  # All paths defined during our session, including:
  # /enrollments, /auth/login, /courses, /courses/{id}, /classes/{id},
  # /mock-tests, /mock-tests/{id}/submissions, 
  # /submissions/{id}/answers/{qid}, /speaking-submissions/{id}/upload,
  # /submissions/{id}/results, /speaking-submissions/{id}/results
  # (Full list omitted for brevity in this final summary)
```

-----

## **6. Security**

This section defines our multi-layered, "defense-in-depth" security architecture.

  * **Authentication:** JWTs with a **refresh token strategy** to handle long-running test sessions. The `accessToken` is stored in memory, while the `refreshToken` is stored in a secure, HTTP-only cookie. A `/auth/refresh` endpoint is required.
  * **Client-Side Security (PWA):** Sensitive data stored offline in IndexedDB will be handled with care. Authentication tokens **must not** be stored in `localStorage`.
  * **Secrets Management:** **Google Secret Manager** for production; `.env` files for local development.
  * **API Security:** Rate limiting, strict CORS policy, and standard security headers (`Helmet.js`).
  * **Data Protection:** TLS 1.2+ for data in transit; GCP default encryption for data at rest. Access to PII will be logged.
  * **Dependency Security:** Automated vulnerability scanning via **Dependabot** or **Snyk** in the CI/CD pipeline.

-----

## **7. Unified Project Structure**

This is the definitive, locked-in folder structure for the Turborepo monorepo.

```plaintext
/shikhilb-ielts-platform/
├── .github/
│   └── workflows/
├── apps/
│   ├── web/                # The Next.js frontend PWA
│   │   ├── app/            # Next.js App Router
│   │   │   ├── (auth)/     # Route group for auth pages (login, etc.)
│   │   │   │   ├── login/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── LoginForm.tsx # Co-located, page-specific component
│   │   │   ├── (main)/     # Route group for main app
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx  # Root layout
│   │   │   └── globals.css
│   │   ├── components/     # SHARED components for the WEB app (e.g., Navbar, Footer)
│   │   ├── lib/            # Helper functions, hooks, etc.
│   │   ├── public/         # Static assets
│   │   └── ...             # Next.js config files
│   └── api/                # Backend services
│       ├── src/
│       │   ├── courses/    # Example internal service structure
│       │   │   ├── index.ts        # Entry point for the service
│       │   │   ├── courses.routes.ts # Express router definitions
│       │   │   ├── courses.service.ts# Business logic
│       │   │   └── courses.validators.ts # Zod validation schemas
│       │   └── ...         # Other services following the same pattern
│       ├── Dockerfile      # Container definition for Cloud Run
│       └── .env.example    # Environment variable template
├── packages/
│   ├── ui/                 # "Clarity" Design System (e.g., ShikhiButton.tsx)
│   ├── shared/             # TS types, Zod schemas shared between apps
│   └── config/             # Shared ESLint, TSConfig
├── docs/
└── turbo.json
```

-----

## **8. Test Strategy and Standards**

This section defines our comprehensive, production-ready plan for quality assurance.

  * **Philosophy:** Adherence to the **Test Pyramid** model with a goal of **80% unit test coverage**.
  * **Unit & Integration Tests:** Using **Jest**, **React Testing Library**, and **Testcontainers** to run tests against real, containerized databases in CI.
  * **E2E Tests:** Using **Playwright** for critical user flows.
  * **PWA & Offline Testing:** A dedicated Playwright test suite to simulate offline conditions and test data synchronization.
  * **Continuous Testing & Quality Gates:** The CI pipeline (GitHub Actions) will enforce:
      * Passing unit & integration tests.
      * **Automated accessibility scans** with `jest-axe` (WCAG 2.1 AA).
      * **Performance budget checks** with Lighthouse.
      * **Dependency vulnerability scans**.

-----

## **9. Error Handling and Observability**

This is the final section, ensuring the system is resilient and maintainable.

  * **Error Handling:** A standardized JSON error format for the API, a global React **Error Boundary** for the client, and the **Circuit Breaker** pattern for external API calls.
  * **Logging:** Centralized, structured (JSON) logging in **Google Cloud Logging**.
  * **Correlation ID:** Every request will have a unique `correlationId` that is passed through all services and included in all logs, allowing for perfect traceability.
  * **Monitoring & Alerting:** Using **Google Cloud Monitoring** to track key metrics (error rates, latency) and send alerts on critical issues.

-----

## **10. Conclusion: Architecture Complete**

This document represents the complete, end-to-end technical blueprint for the ShikhiLAB IELTS Platform. With this document finalized, the architectural phase is now finished.

I am now handing off this complete blueprint to the **Product Owner (Sarah)**. Her next task is to begin the detailed story-writing and backlog management process for the development sprints based on this architecture and the PRD.

You can now proceed to the next phase by typing `*agent po`.