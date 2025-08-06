# Epic 2: Course Structure & Personalized Dashboard (v1.2 - Refined)
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