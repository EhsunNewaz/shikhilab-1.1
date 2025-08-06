# AI-Powered IELTS Crash Course Platform: Product Requirements Document (PRD)
**Version:** 3.0 (Final)
**Date:** August 1, 2025
**Author:** John, Product Manager

### 1. Goals and Background Context

#### Goals

* To launch and successfully operate the inaugural premium, instructor-led IELTS Crash Course.
* To solve the core problem of "mental translation" by providing a structured, tech-enabled learning environment.
* To implement a "flipped classroom" model, maximizing live class time for intensive, instructor-led practice.
* To provide students with instant, actionable feedback on Writing and Speaking exercises via an AI-powered practice portal.
* To automatically track student mistakes across all activities and recommend personalized learning paths.
* To build a "pixel-perfect" computerized mock test simulator for realistic exam practice.
* To serve as a successful Minimum Viable Product (MVP) that validates the content and technology for a future, scalable, self-guided learning platform.

#### Background Context

The primary challenge for IELTS candidates in Bangladesh is a systemic gap in foundational English skills, leading to a deep-rooted habit of mentally translating from Bangla. This severely hinders their fluency and performance. This project addresses the problem by creating an AI-powered web platform to host a premium "IELTS Crash Course," which will function as a "flipped classroom."

The platform's core innovation is its AI-powered practice portal, featuring a personified AI assistant that provides instant feedback and a system that automatically tracks mistakes to create personalized learning journeys. This MVP is designed to achieve two strategic objectives: first, to provide the technology needed to run a successful, high-quality paid course, and second, to serve as the foundational technology that will be refined and expanded into a fully self-guided learning ecosystem.

#### Change Log

| Date | Version | Description | Author |
| :--- | :--- | :--- | :--- |
| Aug 1, 2025 | 3.0 | Added final, detailed IELTS Compliance and Gamification sections. | John, PM |
| Aug 1, 2025 | 2.0 | Initial draft incorporating interactive feedback. | John, PM |

---
### 2. Requirements

#### 2.1 IELTS Format Compliance Requirements (v3)

**Functional Requirements**

* **FR1:** The mock test simulator shall enforce strict, non-pausable timers for each section, adhering to official IELTS durations: Listening (30 minutes), Reading (60 minutes), and Writing (60 minutes).
* **FR2:** The system shall require students to complete the Listening, Reading, and Writing sections in the official sequence order (Listening first, then Reading, then Writing) in a single, continuous session without breaks between these three modules.
* **FR3:** The Reading section of the simulator must require students to record their answers directly onto the test interface within the allocated 60-minute time limit, simulating the official test's protocol of no extra time for answer transfer.
* **FR4:** The mock test simulator must support the rendering and interaction patterns for all official IELTS question types across all four modules.
* **FR5:** The Speaking section simulator shall implement the official three-part structure with precise timing: Part 1 (Introduction, 4-5 minutes), Part 2 (Individual long turn with 1 minute preparation + 1-2 minutes speaking, total 3-4 minutes), and Part 3 (Discussion, 4-5 minutes), for a total duration of 11-14 minutes.
* **FR6:** The Speaking simulator shall provide a 1-minute preparation phase for Part 2, during which students can take notes before delivering their 1-2 minute monologue.
* **FR7:** The Listening section simulator shall provide exactly 10 minutes of transfer time (for paper-based simulation) or 2 minutes of review time (for computer-based simulation) after the 30-minute listening phase.
* **FR8:** The Listening test simulator shall implement the official four-section structure: Section 1 (conversation in a social context), Section 2 (monologue in a social context), Section 3 (conversation up to four people in an educational context), and Section 4 (academic monologue).
* **FR9:** The Writing section simulator shall enforce minimum word requirements with a real-time word counter following official IELTS rules: hyphenated words and contractions count as one word. Task 1 requires a minimum of 150 words, and Task 2 requires a minimum of 250 words.
* **FR10:** The system shall provide complete format differentiation between Academic and General Training tests: Academic Reading (three academic passages), General Training Reading (multiple shorter texts in three parts), Academic Writing Task 1 (describe visual data), and General Training Writing Task 1 (formal/informal/semi-formal letters).
* **FR11:** The Reading section simulator shall support all 14 official IELTS question types, including but not limited to Matching Headings, True/False/Not Given, Summary Completion, and Diagram Label Completion.
* **FR12:** The Listening section simulator shall support all 10 official IELTS question types, including but not limited to Multiple Choice, Matching, and Plan/Map/Diagram Labelling.
* **FR13:** The system shall allow users to choose between a paper-based and computer-based test simulation, with the computer-based version including features such as text highlighting, note-taking, and copy/paste functionality.
* **FR14:** The Reading section shall present exactly three passages with a total text length of 2,150-2,750 words for Academic IELTS and 2,000-2,750 words for General Training IELTS, containing a total of 40 questions distributed across the three sections.
* **FR15:** The Speaking section may be scheduled independently of the other three modules, either on the same day or up to 7 days before or after the Listening/Reading/Writing session, consistent with official IELTS test center practices.
* **FR16:** The Listening section shall distribute exactly 10 questions per section across all four sections, and the Reading section shall distribute questions proportionally across the three passages.

**Non-Functional Requirements**

* **NFR1:** The on-screen timers for all mock test sections must be synchronized with the server to ensure timing accuracy and prevent client-side manipulation or clock-related errors.
* **NFR2:** The mock test simulator shall maintain a question difficulty progression, with sections generally becoming more challenging within each test module.
* **NFR3:** The system shall implement precise IELTS band score calculation using official conversion tables: the overall band score is calculated as the average of all four section scores, rounded to the nearest 0.5 band (with .25 averages rounded up to the next half-band, and .75 averages rounded up to the next whole band).
* **NFR4:** The Listening simulator shall incorporate a variety of English accents, including British, Australian, Canadian, and American, to reflect the international nature of the official test.

#### 2.2 Gamification and Engagement System (v2)

**System Goal**

To increase student motivation and encourage consistent daily practice through research-backed, privacy-respecting gamification that enhances rather than distracts from IELTS learning, while fostering intrinsic motivation for long-term English language development.

**Functional Requirements**

* **FR17:** The system shall implement an achievement system where students earn points for completing activities and unlock standards-compliant digital badges for reaching specific milestones (e.g., "Writing Whiz," "5-Day Streak," "Mock Test Marathoner").
* **FR18:** The student dashboard shall feature a prominent progress visualization module, displaying overall course completion percentage and celebrating milestones as they are achieved.
* **FR19:** The system shall track, calculate, and prominently display the student's current daily practice streak to encourage consistent, habitual engagement with the platform.
* **FR20:** The platform shall feature a weekly leaderboard based on points earned from practice activities to foster a sense of community and healthy competition.
* **FR21:** The system's personalized learning path, driven by the "My Weaknesses" module, will be integrated with the gamification system, potentially offering bonus points for practicing targeted weak areas.
* **FR22:** The system shall implement privacy-first gamification with user-controllable visibility settings: students can choose to participate in leaderboards anonymously, opt out of social features entirely, and control what achievement data is visible to other users.
* **FR23:** All gamification data collection shall comply with educational data privacy standards, with explicit opt-in consent for any features that share performance data with other users.
* **FR24:** The system shall implement streak protection mechanisms including "freeze" options for legitimate absences, streak repair opportunities for technical failures, and gentle re-engagement messaging that focuses on learning progress rather than streak loss.
* **FR25:** The system shall use AI-driven personalization to adapt gamification elements based on individual learning patterns: adjusting point values for challenging topics and suggesting personalized achievement goals.
* **FR26:** The system shall implement standards-compliant digital badges following the Open Badges specification, with detailed metadata including issuer information, achievement criteria, and evidence links.
* **FR27:** The system shall implement progressive gamification complexity that evolves with user engagement, introducing advanced challenges and collaborative goals as users demonstrate sustained participation.
* **FR28:** The gamification system shall promote intrinsic motivation by emphasizing mastery indicators and personal growth visualization rather than solely focusing on points and competition.
* **FR29:** The system shall optimize gamification elements for mobile learning patterns with contextual micro-achievements and smart notification timing that respects user daily routines.
* **FR30:** The system shall implement gamification analytics to measure engagement effectiveness and learning outcome correlations, with A/B testing of gamification elements to optimize for educational metrics.

**Non-Functional Requirements**

* **NFR5:** Gamification elements shall not interfere with core IELTS learning functionality and must load within 2 seconds to avoid disrupting practice sessions.
* **NFR6:** The system shall handle gamification feature failures gracefully, allowing users to continue core learning activities even if achievement tracking or social features are temporarily unavailable.
* **NFR7:** Gamification elements shall be culturally adaptive for international IELTS candidates, avoiding competitive elements that may conflict with cultural learning preferences and offering collaborative alternatives.

#### 2.3 General Platform Requirements

**Functional Requirements**

* **FR31:** The system shall display a public-facing landing page to market the IELTS Crash Course.
* **FR32:** The system shall provide a manual enrollment process where a user can submit bKash transaction details for an admin to verify.
* **FR33:** The system shall provide a secure, login-protected portal for enrolled students.
* **FR34:** The student portal will act as a central hub, linking to a structured page for each class in the course.
* **FR35:** The class page will feature an embedded video player (using Zoom SDK) for live-streamed classes.
* **FR36:** The class page will include an interactive panel allowing the instructor to push practice exercises to students in real-time during the live session.
* **FR37:** The system shall unlock access to course materials progressively as the course schedule advances.
* **FR38:** The system shall include a computerized mock test simulator that replicates the official IELTS test's exact layout, question-type presentation, and on-screen timer.
* **FR39:** The mock test simulator shall allow students to highlight text and take notes during the test.
* **FR40:** The system will feature an AI-powered practice portal for students to complete asynchronous practice exercises.
* **FR41:** Access to AI-powered feedback will be managed by a credit system.
* **FR42:** The student portal must display the user's remaining 'AI Credit' balance.
* **FR43:** The AI portal shall provide automated grading for **Writing** submissions. Feedback must include an estimated band score, a list of grammatical errors with corrections, and suggestions for improving vocabulary and structure. **All explanations must be provided in Bangla.**
* **FR44:** The AI portal shall provide automated grading for **Speaking** submissions, with the same feedback structure and Bangla explanations as Writing.
* **FR45:** All AI-generated feedback will be presented to the student from a named, personified assistant (e.g., "Practice Coach").
* **FR46:** The Listening practice portal shall include gamified exercises featuring immediate right/wrong feedback, a point-scoring system, and a progress bar to track completion.
* **FR47:** The system will automatically log mistakes students make across all practice activities.
* **FR48:** The student dashboard shall feature a 'My Weaknesses' module. This module will display a summary of the user's most common mistake types, based on the automatically logged mistakes. For each identified weakness, the dashboard will provide direct links to the specific micro or meso-lessons that address it.
* **FR49:** The system will provide a simple admin panel for the instructor.
* **FR50:** The admin panel's content management system must support uploading video links, PDFs, and creating text-based practice exercises.
* **FR51:** The admin panel must include a 'pending enrollments' queue where the instructor can view submitted transaction details and a button to approve or reject them.
* **FR52:** The admin panel must allow an instructor to manually activate a student's account upon verifying their payment.

**Non-Functional Requirements**

* **NFR8:** The web platform must be mobile-responsive.
* **NFR9:** The system's content delivery mechanism must support micro-lessons (30-90 seconds) and meso-lessons (3-5 minutes).
* **NFR10:** The system must ensure all student data is stored securely.
* **NFR11:** The architecture must be designed for scalability to support the post-MVP vision.
* **NFR12:** Automated payment gateway integration is out of scope.
* **NFR13:** Complex community features (e.g., forums) are out of scope.
* **NFR14:** A native mobile application is out of scope.
* **NFR15:** The system must integrate with a third-party transactional email service to handle all system-generated emails (e.g., account activation, notifications).
* **NFR16:** *Concurrent Users:* The mock test simulator must support up to 50 concurrent users for the MVP, with server response times remaining under 500ms.
* **NFR17:** *Auto-Save Performance:* The auto-save operation must be completed and confirmed by the server within 2 seconds of the user's last action.
* **NFR18:** *Audio Quality:* Submitted audio for the Speaking section must meet a minimum quality standard to be valid for processing.

---
### 3. User Interface Design Goals

#### Overall UX Vision
The user experience must be clean, intuitive, and encouraging. It should feel like a premium, guided learning environment. The core interaction should empower students by making it easy to access lessons, practice, and understand their mistakes.

#### Key Interaction Paradigms
* **Flipped Classroom Support:** The UI must clearly delineate between pre-class preparation, live class activities, and post-class review.
* **Action-Oriented Dashboard:** The student dashboard will be the central hub, immediately presenting the next class, pending practice assignments, and the "My Weaknesses" module.
* **Seamless Practice Loop:** Students should be able to move effortlessly from identifying a mistake on their dashboard directly to the relevant lesson.

#### Core Screens and Views
* Public Landing Page
* Student Dashboard
* Integrated Live Classroom Page
* AI Practice Portal
* Computerized Mock Test Simulator
* Simple Admin Panel

#### Accessibility
* Official accessibility compliance (e.g., WCAG standards) will be deferred to a post-MVP release.

#### Branding
* The brand personality should be **encouraging and supportive of learning**. The design aesthetic will be minimalist, inspired by Google's use of **ample negative space/whitespace** and a limited, meaningful color palette. The chosen colors should be calming and **least stressful** to promote focus.

#### Theme Support
* The platform must support **Light Mode**, **Dark Mode**, and an option to sync with the **System's** default theme.

#### Target Device and Platforms
* **Web Responsive:** The platform must be fully functional and user-friendly across desktop, tablet, and mobile browsers.

---
### 4. Technical Assumptions

#### Repository Structure
* **Monorepo:** A single repository will be used for all code (frontend, backend, shared utilities).

#### Service Architecture
* **Serverless on Google Cloud:** The backend will be built using a serverless approach, primarily leveraging **Google Cloud Functions**.

#### Testing Requirements
* **Unit + Integration Tests:** The project will require both unit tests and integration tests to establish a strong quality baseline.

#### Additional Technical Assumptions and Requests
* **Cloud Provider:** The primary cloud provider will be **Google Cloud Platform (GCP)**.
* **Core AI Services:** The platform will utilize Google's AI services, including the **Google Gemini** model.
* **Specific Frameworks:** Specifics (e.g., React, Node.js) will be finalized by the Architect based on GCP best practices.

---
### 5. Epic and Story Structure

#### High-Level Epic Roadmap
Epic 1: Project Foundation & Manual Enrollment
Epic 2: Course Structure & Personalized Dashboard
Epic 3: The AI-Powered Practice Portal
Epic 4: The High-Fidelity Mock Test Simulator (Expanded Scope)
Epic 5: The Integrated Live Classroom (Expanded Scope)
Epic 6: Gamification & Engagement Systems (New)
Epic 7 (Post-MVP): The Integrated Notebook
Epic 8 (Post-MVP): The Advanced Study Toolkit
Epic 9 (Post-MVP): Gamification & Engagement

#### Epic Details
## Epic 1: Project Foundation & Manual Enrollment (v1.1 - Simplified)
*Expanded Goal: This epic covers all the foundational work needed to get the project off the ground. By the end of this epic, we will have a live landing page, a complete workflow for students to apply (with a capacity limit), and the admin tools to approve them and grant access.*

* **Story 1.1: Project Initialization & Foundational CI**
    * **As a** Developer, **I want** to initialize the fullstack monorepo with the chosen tech stack and a foundational CI check, **so that** we have a stable and validated codebase to build upon.
    * **Acceptance Criteria:**
        1.  A new monorepo is created in a Git repository.
        2.  The repository contains a basic frontend app and a basic backend (serverless function) app.
        3.  The backend exposes a single public `/health` endpoint that returns a `200 OK` status.
        4.  A basic CI pipeline is configured that **runs linting and all unit tests** on every commit.
        5.  A `README.md` file is created with initial project setup and run instructions.
* **Story 1.2: Public Landing Page & Enrollment Form**
    * **As a** Potential Student, **I want** to view a landing page with course details and submit an enrollment application, **so that** I can apply for the course.
    * **Acceptance Criteria:**
        1.  A single, mobile-responsive landing page is created that is publicly accessible.
        2.  The page contains an "Enroll Now" button that reveals an application section.
        3.  The application section displays bKash payment instructions and a form for Name, Email, and Transaction ID.
        4.  The system has a configurable **registration capacity** for the batch (e.g., 50 students).
        5.  If current pending/approved applications are below the capacity, the form submission is saved to the database with a "pending" status and a confirmation message is shown.
        6.  If capacity is reached, the form is disabled or shows a "Batch is full" message.
* **Story 1.3: User Authentication System**
    * **As a** System, **I want** to support secure sign-in for 'student' and 'admin' user roles, **so that** we can manage access to the platform.
    * **Acceptance Criteria:**
        1.  A `User` data model is created that includes fields for email, a securely hashed password, and a `role`.
        2.  A secure `/login` endpoint is created that returns a session token for authenticated users.
        3.  An internal, secure function is created to add new users (this will be used by the admin approval process, not a public registration form).
        4.  A database seeding script is created to provision the first admin user account.
* **Story 1.4: Admin Panel for Enrollment Approval**
    * **As an** Admin, **I want** to sign in to a simple panel to view and approve pending enrollments, **so that** I can grant students access to the course.
    * **Acceptance Criteria:**
        1.  A protected `/admin` route is created, accessible only to signed-in admins.
        2.  The panel displays the current enrollment count vs. the total capacity.
        3.  The panel displays a table of pending enrollments (Name, Email, TxID).
        4.  Clicking an "Approve" button on a submission creates a new student user account, sends a password-setup email, and updates the application's status to "approved".
        5.  The approved application is removed from the pending queue.
        6.  Requires integration with a transactional email service (as per **NFR15**).
* **Story 1.5: Configure Foundational CI/CD Deployment**
    * **As a** Developer, **I want** to configure automated deployment pipelines for both frontend and backend applications, **so that** we have a reliable, automated deployment process to production environments.
    * **Acceptance Criteria:**
        1.  The CI/CD pipeline automatically deploys the Next.js frontend to Vercel on successful builds.
        2.  The CI/CD pipeline automatically deploys the backend API service to Google Cloud Run on successful builds.
        3.  Deployment includes proper environment variable management and secrets handling.
        4.  The deployed health check endpoint is accessible and returns `200 OK` status.
        5.  Deployment pipeline includes rollback capability for failed deployments.
        6.  All deployments are triggered automatically on pushes to the main branch after passing CI checks.

## Epic 2: Course Structure & Personalized Dashboard (v1.2 - Refined)
*Expanded Goal: This epic will transform the platform from an empty shell into a structured learning environment. By the end of this epic, an admin will be able to create a course, organize classes, and upload all necessary learning materials (tagged by mistake category). Students will be able to log in, see their course structure, access their lessons, and view the initial version of their personalized dashboard.*

* **Story 2.1: Admin Course & Class Management**
    * **As an** Admin, **I want** to create a course structure by defining a sequence of classes, **so that** I can organize the curriculum for a new batch of students.
    * **Acceptance Criteria:**
        1.  Data models for `Course` and `Class` are created. A `Class` must belong to a `Course`.
        2.  The `Class` model must include a `title`, `orderNumber`, and `releaseDate`.
        3.  The admin panel has a new 'Course Management' section where an admin can create courses and add classes to them.
        4.  An admin can assign enrolled students to a specific course.
* **Story 2.2: Admin Content Management for Classes**
    * **As an** Admin, **I want** to upload learning materials and tag them with relevant mistake categories, **so that** the system can recommend the right content to students.
    * **Acceptance Criteria:**
        1.  A `LessonMaterial` data model is created.
        2.  In the admin panel, an admin can add materials (Video Link, PDF, Text-Based Content) to each class.
        3.  When adding a material, the admin can **tag it** with one or more predefined `Mistake Categories`.
        4.  Each material can be categorized (e.g., "Prepare Before Class," "Practice After Class").
* **Story 2.3: Student Course Hub & Class Pages**
    * **As a** Student, **I want** to see my assigned course and access all available class materials, **so that** I can follow the curriculum.
    * **Acceptance Criteria:**
        1.  A student's dashboard shows the course they are enrolled in and a list of all classes in order.
        2.  Classes with a future "release date" are visible but marked as "locked".
        3.  Clicking on an unlocked class navigates the student to the Class Page.
        4.  The Class Page displays all its learning materials, grouped by category.
* **Story 2.4: Student Dashboard 'My Weaknesses' Module**
    * **As a** Student, **I want** to see a 'My Weaknesses' module on my dashboard, **so that** I can quickly identify my common mistakes and find relevant lessons to improve.
    * **Acceptance Criteria:**
        1.  A `Mistake` data model is created that can be linked to a predefined `Mistake Category`.
        2.  The student dashboard is designed with a dedicated section for the 'My Weaknesses' module.
        3.  The module displays a summary of the user's most common mistake types, grouped by category. For this story, the module can be populated with sample placeholder data.
        4.  For each mistake type listed, the module provides a direct link to the `LessonMaterial` that has been tagged with that category.
        5.  If a student has no mistakes logged, the module shows an encouraging message.
## Epic 3: The AI-Powered Practice Portal (v1.1 - Final)
*Expanded Goal: This epic will build the complete asynchronous practice experience. By the end of this epic, students will be able to submit Writing and Speaking exercises, receive instant, detailed feedback from our AI assistant, and have their mistakes automatically logged to their personalized dashboard. It also includes the creation of our gamified listening exercises and the backend credit system to manage AI usage.*

* **Story 3.1: AI Credit System Backend**
    * **As a** System, **I want** to manage a credit balance for each student, **so that** we can control access to AI-powered features.
    * **Acceptance Criteria:**
        1.  The `User` data model is updated to include an `ai_credits` balance.
        2.  New student accounts are created with a default number of credits.
        3.  A secure backend function deducts credits, returning an error if the balance is too low.
        4.  The student's current credit balance is displayed on their dashboard.
* **Story 3.2: AI Writing Practice - Submission & Feedback**
    * **As a** Student, **I want** to submit a writing sample and receive instant, AI-powered feedback, **so that** I can identify my writing mistakes.
    * **Acceptance Criteria:**
        1.  A "Writing Practice" page is created in the student portal.
        2.  The page displays a writing prompt and a rich text editor.
        3.  On submission, the system checks for and deducts the required AI credits.
        4.  The student's writing is sent to the Google Gemini API.
        5.  The AI's feedback is displayed to the student, presented by the named AI assistant in **Bangla**.
* **Story 3.3: AI Writing Practice - Mistake Logging**
    * **As a** System, **I want** to parse the AI-generated feedback and log each error into the student's profile, **so that** their 'My Weaknesses' dashboard is automatically updated.
    * **Acceptance Criteria:**
        1.  The backend parses the identified mistakes from the Gemini API response.
        2.  Each mistake is mapped to one of our predefined `Mistake Categories`.
        3.  A new `Mistake` record is created in the database for each error.
        4.  The 'My Weaknesses' module on the student dashboard is populated with this real data.
* **Story 3.4: Speaking Practice - Audio Recording & Transcription**
    * **As a** Student, **I want** to record my voice and have it transcribed into text, **so that** I can prepare it for AI analysis.
    * **Acceptance Criteria:**
        1.  A "Speaking Practice" page is created with UI controls for audio recording.
        2.  The user can start, stop, and play back their recording before submission.
        3.  The submitted audio is sent to a speech-to-text service to be transcribed.
        4.  The transcript is saved and associated with the student's submission.
        5.  This action does not deduct any AI credits.
* **Story 3.5: Speaking Practice - AI Feedback & Logging**
    * **As a** Student, after my speech is transcribed, **I want** to submit the transcript for AI-powered feedback, **so that** I can understand my speaking weaknesses.
    * **Acceptance Criteria:**
        1.  After a transcript is available, a "Get Feedback" button appears.
        2.  Clicking the button checks for and deducts the required AI credits.
        3.  The transcript is sent to the Gemini API for feedback.
        4.  The feedback is displayed to the student (in Bangla), and the mistakes are logged to their profile.
* **Story 3.6: Gamified Listening Practice**
    * **As a** Student, **I want** to complete interactive listening exercises, **so that** I can improve my comprehension and have my errors tracked.
    * **Acceptance Criteria:**
        1.  A "Listening Practice" page is created with a "Fill-in-the-Blanks" exercise.
        2.  The system provides immediate right/wrong feedback and a final score.
        3.  Each incorrect answer is logged as a `Mistake` in the student's profile.
        4.  The 'My Weaknesses' module on the dashboard reflects these logged mistakes.
        5.  This feature does not cost any AI credits.

## Epic 4: The High-Fidelity Mock Test Simulator (v1.2 - Battle-Tested)
*Expanded Goal: This epic will build a complete, high-fidelity computerized IELTS mock test simulator. The primary focus is on replicating the official exam's user experience with precision and ensuring the platform is reliable and resilient for students under timed test conditions.*

* **Story 4.1: Admin - Test Creation Framework**
* **Story 4.2: Admin - Reading & Listening Content Management**
* **Story 4.3: Admin - Writing & Speaking Content Management**
* **Story 4.4: Student - Test Simulator UI Shell & Navigation**
* **Story 4.5: Student - Test Resilience (Auto-Save & Resume)**
* **Story 4.6: Student - Accessibility & Compatibility**
* **Story 4.7: Student - Reading Section Implementation**
* **Story 4.8: Student - Listening Section Implementation**
* **Story 4.9: Student - Writing & Speaking Section Implementation**
* **Story 4.10: Student - Test Submission & Results Page**
*(This epic contains 10 granular stories with detailed, risk-mitigating acceptance criteria as defined in our conversation.)*

## Epic 5: The Integrated Live Classroom (v1.2 - Battle-Tested)
*Expanded Goal: This epic will build a seamless, real-time learning experience that embeds a live video classroom directly into our platform. It begins with a Proof-of-Concept to validate the technology and includes robust security and error handling.*

* **Story 5.1: Proof-of-Concept - Zoom SDK Integration & Feasibility**
* **Story 5.2: Admin - Live Class Scheduling**
* **Story 5.3: Implement Firestore Security Rules**
* **Story 5.4: Student - Live Class Join Flow & UI**
* **Story 5.5: Instructor - Real-time Exercise Push**
* **Story 5.6: Student - Real-time Exercise Display**
* **Story 5.7: Live Class Error Handling & Recovery**
* **Story 5.8: Session Recording & Playback**
*(This epic contains 8+ granular stories with a focus on security, reliability, and a safe MVP implementation as defined in our conversation.)*

## Epic 6: Gamification & Engagement Systems (New)
*Expanded Goal: This epic will launch a public-facing blog that is optimized for search engines and designed for user engagement, featuring author profiles and related posts.*

* **Story 6.1: Admin - Author Profile Management**
* **Story 6.2: Admin - Blog Post Creation & Management**
* **Story 6.3: Public - Blog Listing Page**
* **Story 6.4: Public - Individual Blog Post Page & Engagement**
*(This epic contains 4 stories with features for SEO, author profiles, and related posts to create an effective marketing tool.)*

## Epic 7: The Integrated Notebook (v1.1 - Enhanced)
*Expanded Goal: This epic will provide students with a centralized, in-platform notebook with accessibility features, advanced organization via tags and favorites, and export functionality.*

* **Story 7.1: Core Notebook System & Central Repository**
* **Story 7.2: In-Context Note-Taking**
* **Story 7.3: Notebook Organization & Search**
* **Story 7.4: Advanced Organization Features (Tags & Favorites)**
* **Story 7.5: Export Notes**
*(This epic contains 5 stories to deliver a robust and useful study tool for students.)*

## Epics 8 & 9 (Post-MVP)
* **Epic 8: The Advanced Study Toolkit:** To evolve the integrated notebook into an advanced study environment with features like screenshot capture, AI-assisted summarization, and collaborative tools.
* **Epic 9: Gamification & Engagement:** To build a platform-wide system for achievement badges, progress streaks, and other gamification strategies.

---
### 6. Checklist Results Report

The **Product Manager's Requirements Checklist** has been executed against this document. Due to our thorough, iterative refinement process, the PRD is in excellent shape and has **passed all sections** of the validation checklist. The plan is clear, complete, logically sequenced, and considers key risks.

**Final Decision:** **READY FOR ARCHITECT & UX DESIGN**.

---
### 7. Next Steps

This completes the Product Requirements Document. The project is now ready to move into the next phase.

#### UX Expert Prompt

> **To:** Sally, UX Expert
>
> **From:** John, Product Manager
>
> **Subject:** Handoff: UI/UX Specification for the IELTS Platform
>
> The PRD for the AI-Powered IELTS Crash Course is complete and attached. Please review it, paying close attention to the 'User Interface Design Goals' and the detailed user stories.
>
> Your next task is to create the comprehensive **UI/UX Specification**, which will include detailed wireframes or mockups in Figma, a full component design, and the specific color palette and branding guidelines based on the vision laid out in the PRD.

#### Architect Prompt

> **To:** Winston, Architect
>
> **From:** John, Product Manager
>
> **Subject:** Handoff: Fullstack Architecture for the IELTS Platform
>
> The PRD for the AI-Powered IELTS Crash Course is complete and attached. Please review it, especially the 'Technical Assumptions' and the Non-Functional Requirements.
>
> Your next task is to create the **Fullstack Architecture Document**. You will need to define the specific services, data schemas, and integration patterns required to bring this product to life on the Google Cloud Platform. You will work in parallel with the UI/UX Specification that Sally will be creating to ensure your backend architecture can fully support the required user experience.
