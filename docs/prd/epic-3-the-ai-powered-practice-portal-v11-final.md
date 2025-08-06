# Epic 3: The AI-Powered Practice Portal (v1.1 - Final)
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
