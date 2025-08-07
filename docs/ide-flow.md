# **The BMad Development Workflow: Commands and Actions**

## **Overview**
This is the complete BMad development workflow with integrated Git commands that create a continuous development loop. Each story follows this pattern with proper version control.

## **Git Setup (One-Time Only)**
Before starting your first story, ensure your Git environment is properly configured:

```bash
# Ensure you're on develop branch
git checkout develop 2>/dev/null || git checkout -b develop
git push -u origin develop

# Verify clean state
git status
```

---

## **The Development Loop**

Here is the step-by-step guide with integrated Git commands for the continuous development cycle:

### **🔄 STEP A: Story Initialization & Git Preparation**

#### **A1: Git Pre-Work (Critical!)**
*   **Agent:** **You (The Developer)**
*   **Action:** Prepare Git environment for new story development
*   **Git Commands:**
    ```bash
    # 1. Switch to develop and sync
    git checkout develop
    git pull origin develop
    
    # 2. Verify clean state
    git status
    # If uncommitted changes exist, stash them:
    # git stash push -m "WIP: temporary work before new story"
    
    # 3. Create feature branch for the story
    # Format: feature/story-X.Y-description
    git checkout -b feature/story-1.2-user-authentication
    ```

#### **A2: Development Phase Start**
*   **Agent:** `sm` (Scrum Master)
*   **Action:** Initiate the creation of the very first story for the sprint or epic.
*   **Command:**
    ```
    *sm
    *draft
    ```

### **🔄 STEP B: Story Creation & Approval**

#### **B1 & B2: SM Reviews Notes & Drafts Next Story**
*   **Agent:** `sm`
*   **Action:** This is the core logic of the `*draft` command. The SM agent automatically reviews the last completed story (if any) and uses the sharded documents in `docs/prd/` and `docs/architecture/` to generate the next sequential story file.
*   **Command:** (This is executed automatically by the `*draft` command from step A2).

#### **B3 & B4: PO Validates Story Draft (Optional)**
*   **Agent:** `po` (Product Owner)
*   **Action:** This is an optional but highly recommended quality gate. The PO validates the SM's story draft for completeness and alignment with the project goals.
*   **Command:**
    ```
    *po
    *task validate-story-draft docs/stories/YOUR_NEWLY_CREATED_STORY.md
    ```

#### **B5: Commit Story File to Feature Branch**
*   **Agent:** **You (The Developer)**
*   **Action:** Save the story file to version control before development begins
*   **Git Commands:**
    ```bash
    # Add the newly created story file
    git add docs/stories/1.2.user-authentication.md
    
    # Commit the story draft
    git commit -m "story: add story 1.2 - user authentication
    
    - Create story draft for user authentication feature
    - Include acceptance criteria and task breakdown
    - Status: Draft (pending approval)"
    
    # Push feature branch (first time)
    git push -u origin feature/story-1.2-user-authentication
    ```

#### **B6: User Approval**
*   **Agent:** **You (The Product Owner)**
*   **Action:** This is your first critical decision point. You must review the generated story file. If it is ready for development, you manually approve it.
*   **Manual Steps:**
    1.  Open the story file (e.g., `docs/stories/1.2.user-authentication.md`).
    2.  Change the status line from `Status: Draft` to `Status: Approved`.
    3.  Save the file.
    4.  **Commit the approval:**
        ```bash
        git add docs/stories/1.2.user-authentication.md
        git commit -m "story: approve story 1.2 - user authentication
        
        Status changed from Draft to Approved
        Ready for development implementation"
        git push origin feature/story-1.2-user-authentication
        ```

    *(If changes are needed, you would provide feedback to the SM and have them re-draft, or edit the file directly, then commit those changes.)*

### **🔄 STEP C: Development Implementation**

#### **C1: Pre-Development Git Check**
*   **Agent:** **You (The Developer)**
*   **Action:** Ensure clean development environment before starting implementation
*   **Git Commands:**
    ```bash
    # Verify you're on the correct feature branch
    git branch --show-current
    # Should show: feature/story-1.2-user-authentication
    
    # Pull any remote changes to feature branch
    git pull origin feature/story-1.2-user-authentication
    
    # Verify clean working directory
    git status
    ```

#### **C2: Dev Sequential Task Execution, Implementation & Validation**
*   **Agent:** `dev` (Developer)
*   **Action:** The dev agent takes the approved story and implements the code, including writing tests and running validations as it works. This is a conversational process.
*   **Commands:**
    1.  Switch to a **new, clean chat session**. This is critical for context.
    2.  Activate the dev agent:
        ```
        *dev
        ```
    3.  Provide the story content:
        ```
        Implement the following approved story: [Paste the entire content of the approved story file here]
        ```
    4.  Engage in a conversation, guiding the agent through the tasks and subtasks outlined in the story.

#### **C3: Incremental Commits During Development**
*   **Agent:** **You (The Developer)**
*   **Action:** Make regular commits as the dev agent completes major tasks
*   **Git Commands (Repeat as needed during development):**
    ```bash
    # After completing a major task (e.g., component creation)
    git add .
    git commit -m "feat(auth): implement LoginForm component
    
    - Add form validation with Zod schema
    - Implement password strength indicator  
    - Add error handling for auth failures
    - Include unit tests for component
    
    Task completed: Login form UI implementation"
    
    # Push progress regularly
    git push origin feature/story-1.2-user-authentication
    
    # Continue with next task...
    ```

### **🔄 STEP D: Development Completion & Review Preparation**

#### **D1: Final Development Validation**
*   **Agent:** **You (The Developer)**
*   **Action:** Run all tests and linting before marking story complete
*   **Git Commands:**
    ```bash
    # Run full test suite
    npm test
    npm run lint
    npm run type-check
    
    # If tests fail, fix issues and commit fixes:
    # git add .
    # git commit -m "fix(auth): resolve test failures in LoginForm"
    # git push origin feature/story-1.2-user-authentication
    ```

#### **D2: Dev Marks Ready for Review + Add Notes**
*   **Agent:** `dev`
*   **Action:** Once the implementation is complete, you instruct the dev agent to update the story file with its progress and change the status to "Review".
*   **Command (Conversational):**
    ```
    You have completed all tasks and all tests are passing. Please update the story file. Change the status to "Review", fill out the "Dev Agent Record" with your notes, and provide the final list of all created or modified files.
    ```

#### **D3: Commit Story Status Update**
*   **Agent:** **You (The Developer)**
*   **Action:** Commit the updated story file with development completion notes
*   **Git Commands:**
    ```bash
    # Commit story status change to "Review"
    git add docs/stories/1.2.user-authentication.md
    git commit -m "story: complete development for story 1.2
    
    - Update status from Approved to Review
    - Add dev agent completion notes
    - List all implemented files and features
    - All tests passing, ready for review"
    
    # Final push of feature branch
    git push origin feature/story-1.2-user-authentication
    ```

#### **D4: User Verification**
*   **Agent:** **You (The Product Owner)**
*   **Action:** This is your second critical decision point. Review the code generated by the `dev` agent. Run the application locally.
*   **Manual Steps:**
    ```bash
    # Test the implementation locally
    npm run dev
    # Visit http://localhost:3000 and test the new feature
    ```
    
    **Decision Points:**
    *   If you are satisfied and don't need a senior review, you can **"Approve Without QA"** → Go to Step F.
    *   If you want a senior-level review and refactoring, you **"Request QA Review"** → Go to Step E.
    *   If you find issues, you **"Request Fixes"** → Go back to Step C2 with feedback.

### **🔄 STEP E: QA Senior Review (Optional)**

#### **E1: QA Pre-Work Git Setup**
*   **Agent:** **You (The Developer)**  
*   **Action:** Prepare for QA review on the same feature branch
*   **Git Commands:**
    ```bash
    # Ensure you're on the feature branch
    git checkout feature/story-1.2-user-authentication
    git pull origin feature/story-1.2-user-authentication
    
    # Create a commit point before QA changes
    git tag "pre-qa-review-$(date +%Y%m%d-%H%M%S)"
    ```

#### **E2: QA Senior Dev Review & Active Refactoring**
*   **Agent:** `qa` (Quality Assurance)
*   **Action:** The QA agent performs a senior-level code review. Unlike a simple check, the QA agent can actively refactor code, improve tests, and fix issues directly.
*   **Commands:**
    1.  Switch to a **new, clean chat session**.
    2.  Activate the QA agent:
        ```
        *qa
        ```
    3.  Provide the story content for review:
        ```
        Please perform a senior code review on the implementation for the following story: [Paste the content of the "Review" status story file here]
        ```

#### **E3: Commit QA Improvements**
*   **Agent:** **You (The Developer)**
*   **Action:** Commit QA agent improvements as they are made
*   **Git Commands (Use during QA process):**
    ```bash
    # After QA makes improvements
    git add .
    git commit -m "refactor(auth): QA improvements to LoginForm
    
    - Improve error handling patterns
    - Enhance TypeScript type safety
    - Optimize component performance
    - Add comprehensive integration tests
    
    QA review changes applied"
    
    git push origin feature/story-1.2-user-authentication
    ```

#### **E4: QA Decision & Story Update**
*   **Agent:** `qa`
*   **Action:** The QA agent completes its review and updates the story file with its notes and changes.
*   **Command (Conversational):** The QA agent will report its findings. If it fixed everything, it will recommend approval. If there are larger issues, it will document them and recommend sending it back to the dev agent.

#### **E5: Commit QA Completion**
*   **Agent:** **You (The Developer)**
*   **Action:** Commit the QA-updated story file
*   **Git Commands:**
    ```bash
    # Commit QA completion notes
    git add docs/stories/1.2.user-authentication.md
    git commit -m "story: complete QA review for story 1.2
    
    - Add QA agent review notes
    - Document refactoring improvements
    - Confirm all quality gates passed
    - Ready for final approval"
    
    git push origin feature/story-1.2-user-authentication
    ```

### **🔄 STEP F: Final Verification & Story Completion**

#### **F1: Final Verification**
*   **Agent:** **You (The Product Owner)**
*   **Action:** This is a final, manual sanity check before merging the completed work.
*   **Git Commands:**
    ```bash
    # Switch to feature branch and ensure latest
    git checkout feature/story-1.2-user-authentication
    git pull origin feature/story-1.2-user-authentication
    
    # Run full test and validation suite
    npm test
    npm run lint
    npm run type-check
    npm run build
    
    # Test the complete feature one final time
    npm run dev
    # Manual testing of the implemented feature
    ```

#### **F2: Story Completion & Status Update**
*   **Agent:** **You (The Product Owner)**
*   **Action:** Mark the story as complete and ready for merge
*   **Manual Steps:**
    1.  Open the story file (e.g., `docs/stories/1.2.user-authentication.md`)
    2.  Change the status line from `Status: Review` to `Status: Done`
    3.  Add completion timestamp and final notes
    4.  Save the file

#### **F3: Commit Story Completion**
*   **Agent:** **You (The Developer)**
*   **Action:** Commit the completed story status
*   **Git Commands:**
    ```bash
    # Commit story completion
    git add docs/stories/1.2.user-authentication.md
    git commit -m "story: mark story 1.2 as Done
    
    - Change status from Review to Done
    - Add final completion timestamp
    - All acceptance criteria met
    - Feature ready for production merge"
    
    git push origin feature/story-1.2-user-authentication
    ```

### **🔄 STEP G: Merge to Develop & Cleanup**

#### **G1: Merge Feature to Develop Branch**
*   **Agent:** **You (The Developer)**
*   **Action:** Merge the completed feature into the develop branch
*   **Git Commands:**
    ```bash
    # Switch to develop and ensure latest
    git checkout develop
    git pull origin develop
    
    # Merge feature branch (no fast-forward to preserve history)
    git merge --no-ff feature/story-1.2-user-authentication
    
    # Push updated develop branch
    git push origin develop
    ```

#### **G2: Cleanup Feature Branch**
*   **Agent:** **You (The Developer)**
*   **Action:** Clean up the completed feature branch
*   **Git Commands:**
    ```bash
    # Delete local feature branch
    git branch -d feature/story-1.2-user-authentication
    
    # Delete remote feature branch
    git push origin --delete feature/story-1.2-user-authentication
    
    # Clean up any local tracking branches
    git remote prune origin
    ```

#### **G3: Tag Release (Optional)**
*   **Agent:** **You (The Developer)**
*   **Action:** Tag significant milestones
*   **Git Commands:**
    ```bash
    # For major features or releases
    git tag -a v1.2.0-story-auth -m "Complete user authentication story 1.2
    
    - User login and registration
    - Password validation and security
    - Session management
    - All tests passing"
    
    git push origin v1.2.0-story-auth
    ```

---

## **🔄 LOOP BACK: Start Next Story**

### **STEP H: Loop Back to Story Creation**

#### **H1: Prepare for Next Story**
*   **Agent:** **You (The Developer)**
*   **Action:** Prepare Git environment for the next development cycle
*   **Git Commands:**
    ```bash
    # Ensure you're on develop with latest changes
    git checkout develop
    git pull origin develop
    
    # Verify clean state for next story
    git status
    
    # View completed stories for context
    ls docs/stories/
    
    # Check recent commit history
    git log --oneline -5
    ```

#### **H2: Begin Next Story Cycle**
*   **Agent:** **You (The Product Owner)**
*   **Action:** You are now ready to create the next story in the development cycle
*   **Command (Loops back to Step A):**
    ```
    # This starts the entire cycle again for the next story
    *sm
    *draft
    ```

---

## **⚠️ Emergency Commands & Rollback Procedures**

### **Rollback During Development**
```bash
# If you need to revert recent commits on feature branch
git log --oneline -10  # See recent commits
git reset --hard HEAD~2  # Revert last 2 commits (DANGEROUS!)
git push --force-with-lease origin feature/story-X.Y-name

# Safer option: Revert specific commits
git revert <commit-hash>
git push origin feature/story-X.Y-name
```

### **Rollback After Merge to Develop**
```bash
# If you need to revert a merge to develop
git checkout develop
git log --oneline -5  # Find the merge commit
git revert -m 1 <merge-commit-hash>
git push origin develop
```

### **Emergency Stash**
```bash
# If you need to quickly save work and switch contexts
git stash push -m "Emergency stash: story 1.2 work in progress"
git checkout develop
# Do emergency work...
git checkout feature/story-1.2-user-authentication
git stash pop
```

---

## **📊 Quick Reference: Complete Loop Commands**

```bash
# 🔄 START NEW STORY CYCLE
git checkout develop && git pull origin develop
git checkout -b feature/story-X.Y-description
# Create story with *sm *draft
git add docs/stories/ && git commit -m "story: add story X.Y draft"
git push -u origin feature/story-X.Y-description

# 🔄 DURING DEVELOPMENT  
git add . && git commit -m "feat: implement [description]"
git push origin feature/story-X.Y-description
# Repeat as needed...

# 🔄 COMPLETE STORY
npm test && npm run lint
git add docs/stories/ && git commit -m "story: mark X.Y as Done"
git push origin feature/story-X.Y-description

# 🔄 MERGE & CLEANUP
git checkout develop && git pull origin develop
git merge --no-ff feature/story-X.Y-description
git push origin develop
git branch -d feature/story-X.Y-description
git push origin --delete feature/story-X.Y-description

# 🔄 LOOP BACK FOR NEXT STORY
git checkout develop && git pull origin develop
# Start next story with *sm *draft
```

This creates a complete, repeatable development cycle with full Git integration and proper version control practices.