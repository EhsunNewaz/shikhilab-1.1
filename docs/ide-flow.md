# **The BMad Development Workflow: Simplified**

## **Overview**
This is the streamlined BMad development workflow that matches actual development practices. The workflow uses the `develop` branch directly and focuses on the agent-driven story development cycle.

## **Prerequisites**
Before starting, ensure your Git environment is ready:

```bash
# Ensure you're on develop branch with latest changes
git checkout develop
git pull origin develop

# Verify clean state
git status
```

---

## **The Story Development Cycle**

### **🔄 STEP 1: Story Creation**

#### **1.1: Create New Story**
*   **Agent:** Scrum Master (`/sm`)
*   **Action:** Generate the next story from epic requirements
*   **Commands:**
    ```
    /sm
    *draft
    ```
*   **Output:** Creates new story file in `docs/stories/` (e.g., `1.3.user-authentication-system.md`)

#### **1.2: Commit Story Draft**
*   **Agent:** **You (The Developer)**
*   **Action:** Save the newly created story to version control
*   **Git Commands:**
    ```bash
    # Add the story file (use actual filename created by SM)
    git add docs/stories/1.3.user-authentication-system.md
    
    # Commit the draft
    git commit -m "story: add story 1.3 - user authentication system
    
    - Create story draft from epic requirements
    - Include acceptance criteria and task breakdown
    - Status: Draft (pending validation)"
    
    # Push to develop
    git push origin develop
    ```

---

### **🔄 STEP 2: Story Validation (Optional but Recommended)**

#### **2.1: Validate Story Draft**
*   **Agent:** Product Owner (`/po`)
*   **Action:** Comprehensive validation of story completeness and quality
*   **Commands:**
    ```
    /po
    *validate-story-draft docs/stories/1.3.user-authentication-system.md
    ```
*   **Output:** Detailed validation report with any issues to fix

#### **2.2: Fix Issues & Commit Updates**
*   **Agent:** **You (The Developer)**
*   **Action:** Address any validation issues identified by PO
*   **Git Commands:**
    ```bash
    # After making any fixes to the story
    git add docs/stories/1.3.user-authentication-system.md
    git commit -m "story: fix validation issues for story 1.3
    
    - Address template compliance issues
    - Update dev notes with missing context
    - Ensure all acceptance criteria coverage"
    
    git push origin develop
    ```

---

### **🔄 STEP 3: Story Approval**

#### **3.1: Manual Review & Approval**
*   **Agent:** **You (The Product Owner)**
*   **Action:** Review and approve the story for development
*   **Manual Steps:**
    1. Open the story file (e.g., `docs/stories/1.3.user-authentication-system.md`)
    2. Review all sections for completeness and accuracy
    3. Change status from `Status: Draft` to `Status: Approved`
    4. Save the file

#### **3.2: Commit Approval**
*   **Agent:** **You (The Developer)**
*   **Action:** Commit the approved story
*   **Git Commands:**
    ```bash
    git add docs/stories/1.3.user-authentication-system.md
    git commit -m "story: approve story 1.3 - user authentication system
    
    Status changed from Draft to Approved
    Ready for development implementation"
    
    git push origin develop
    ```

---

### **🔄 STEP 4: Development Implementation**

#### **4.1: Pre-Development Check**
*   **Agent:** **You (The Developer)**
*   **Action:** Ensure clean development environment
*   **Git Commands:**
    ```bash
    # Verify you're on develop with latest changes
    git checkout develop
    git pull origin develop
    git status
    ```

#### **4.2: Implement Story**
*   **Agent:** Developer (`/dev`)
*   **Action:** Complete all tasks and subtasks in the approved story
*   **Commands:**
    ```
    /dev
    ```
    Then provide the complete story content:
    ```
    Implement the following approved story: [Paste entire story content here]
    ```

#### **4.3: Incremental Development Commits**
*   **Agent:** **You (The Developer)**
*   **Action:** Make regular commits as major tasks are completed
*   **Git Commands (repeat as needed):**
    ```bash
    # After completing a significant task or milestone
    git add .
    git commit -m "feat(auth): implement user registration endpoint
    
    - Add Zod validation schemas for user input
    - Create database user model and migrations
    - Implement password hashing with bcrypt
    - Add unit tests for registration logic
    
    Completed: User registration backend (Task 2)"
    
    # Push progress regularly
    git push origin develop
    ```

#### **4.4: Development Completion**
*   **Agent:** Developer (`/dev`)
*   **Action:** Update story with completion details
*   **Command (conversational):**
    ```
    All tasks completed and tests passing. Please update the story file:
    - Change status to "Review" 
    - Fill out Dev Agent Record section
    - List all created/modified files
    ```

#### **4.5: Commit Story Status Update**
*   **Agent:** **You (The Developer)**
*   **Action:** Commit the development completion
*   **Git Commands:**
    ```bash
    git add docs/stories/1.3.user-authentication-system.md
    git commit -m "story: complete development for story 1.3
    
    - Update status from Approved to Review
    - Add dev agent completion notes and file list
    - All tests passing, ready for review"
    
    git push origin develop
    ```

---

### **🔄 STEP 5: QA Review (Optional)**

#### **5.1: Senior Code Review**
*   **Agent:** Quality Assurance (`/qa`)
*   **Action:** Comprehensive code review and refactoring
*   **Commands:**
    ```
    /qa
    ```
    Then provide the story for review:
    ```
    Perform senior code review on: [Paste story content with status "Review"]
    ```

#### **5.2: Commit QA Improvements**
*   **Agent:** **You (The Developer)**
*   **Action:** Commit any improvements made by QA agent
*   **Git Commands (as needed during QA):**
    ```bash
    git add .
    git commit -m "refactor(auth): QA improvements to authentication
    
    - Enhance error handling patterns
    - Improve TypeScript type safety  
    - Add integration test coverage
    - Optimize performance patterns
    
    QA review improvements applied"
    
    git push origin develop
    ```

#### **5.3: QA Completion**
*   **Agent:** Quality Assurance (`/qa`)
*   **Action:** Update story with QA results and recommendations

---

### **🔄 STEP 6: Story Completion**

#### **6.1: Final Verification**
*   **Agent:** **You (The Product Owner)**
*   **Action:** Final testing and verification
*   **Commands:**
    ```bash
    # Run full validation suite
    npm test
    npm run lint
    npm run type-check
    npm run build
    
    # Test the feature manually
    npm run dev
    # Verify all acceptance criteria are met
    ```

#### **6.2: Mark Story Complete**
*   **Agent:** **You (The Product Owner)**
*   **Action:** Mark story as done
*   **Manual Steps:**
    1. Open the story file
    2. Change status from `Status: Review` to `Status: Done`
    3. Add completion timestamp and final notes
    4. Save file

#### **6.3: Commit Story Completion**
*   **Agent:** **You (The Developer)**
*   **Action:** Commit the completed story
*   **Git Commands:**
    ```bash
    git add docs/stories/1.3.user-authentication-system.md
    git commit -m "story: mark story 1.3 as Done
    
    - Change status from Review to Done
    - Add final completion timestamp
    - All acceptance criteria verified
    - Feature complete and tested"
    
    git push origin develop
    ```

---

## **🔄 Loop: Next Story**

### **Continue Development Cycle**
After completing a story, immediately start the next one:

```bash
# Ensure clean state for next story
git checkout develop
git pull origin develop
git status

# Start next story cycle
/sm
*draft
```

This creates a continuous development loop where each story builds on the previous work.

---

## **Quick Reference Commands**

### **Story Creation Cycle**
```bash
# 1. Create story
/sm → *draft

# 2. Validate (optional)  
/po → *validate-story-draft docs/stories/X.Y.story-name.md

# 3. Commit & approve story
git add docs/stories/ && git commit -m "story: create/approve X.Y" && git push origin develop

# 4. Implement
/dev → [paste story content]

# 5. QA (optional)
/qa → [paste story content] 

# 6. Complete & commit
git add . && git commit -m "story: complete X.Y - [description]" && git push origin develop
```

### **Emergency Commands**
```bash
# Stash work in progress
git stash push -m "WIP: story X.Y work in progress"

# Revert recent commits (careful!)
git log --oneline -5  # Check recent commits
git revert <commit-hash>  # Safer than reset
git push origin develop
```

---

This workflow eliminates complex branching while maintaining proper version control and agent-driven development practices.