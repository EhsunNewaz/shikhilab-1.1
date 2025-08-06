# Epic 1: Project Foundation & Manual Enrollment (v1.1 - Simplified)
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
