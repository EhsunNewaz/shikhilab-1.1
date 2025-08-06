# IELTS CBT - Overall Layout Wireframe

## 🏗️ Base Layout Structure

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              HEADER BAR (Fixed Top)                             │
│                          **CHANGES COLOR FOR 1-MIN WARNING**                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│ [IELTS Logo]  [Test ID: 48887375]                   [WiFi][🔔][⚙️ Options][📝] │
│               [30 minutes remaining] ← TIMER                                    │
└─────────────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        SECTION INSTRUCTIONS (Collapsible)                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Part 1                                                                [▲ Hide]  │
│ Listen and answer questions 1–10.                                              │ 
│ Write ONE WORD AND/OR A NUMBER for each answer.                                │
│ [!] You will hear the recording ONCE only.                            [? Help] │
└─────────────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            MAIN CONTENT AREA                                   │
│                         (Dynamic Layout Per Section)                           │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─ LISTENING LAYOUT ────────────────────────────────────────────────────────┐  │
│  │                                                                           │  │
│  │  Questions 1-10                                                           │  │
│  │                                                                           │  │
│  │  1. Complete the notes:                          [🔖 Flag]               │  │
│  │     Dining table: [__________] shape                                      │  │
│  │                                                                           │  │
│  │  2. How many years old? [__________]              [🔖 Flag]              │  │
│  │                                              ┌─ Controls ─────────────────┐ │
│  │                                              │ [◀ Prev]  [Next ▶]        │ │
│  │                                              └───────────────────────────┘ │
│  │                                                                           │  │
│  │  [Audio Player Overlay - when active]                                    │  │
│  │  ┌─────────────────────────────────────────────────┐                    │  │
│  │  │ 🎧 Audio playing... Do not pause or rewind     │                    │  │
│  │  │ [▶ Start]                                       │                    │  │
│  │  └─────────────────────────────────────────────────┘                    │  │
│  │                                                                           │  │
│  │                                              🔊 ████████░ 80%  ← Bottom Right │  │
│  │                                                                           │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│  ┌─ READING LAYOUT (Split Screen) ──────────────────────────────────────────┐  │
│  │                                                                           │  │
│  │ ┌─ Passage Pane ─────────┐ ║ ┌─ Questions Pane ────────────────────────┐ │  │
│  │ │                        │ ║ │                                          │ │  │
│  │ │ Urban Transportation    │ ║ │ Q10. Which transport method...?   [🔖] │ │  │
│  │ │                        │ ║ │ ○ A. Personal vehicles                   │ │  │
│  │ │ [Highlighted text]     │ ║ │ ○ B. Ride-sharing                       │ │  │
│  │ │ City planners have...  │ ║ │ ○ C. Buses                              │ │  │
│  │ │                        │ ║ │ ○ D. Bicycles                           │ │  │
│  │ │ [Scrollable content]   │ ║ │                                          │ │  │
│  │ │                        │ ║ │           ┌─ Sticky Controls ─────────────┐ │ │  │
│  │ │ ┌─ Notes Overlay ──────┐│ ║ │           │ [◀ Prev]  [Next ▶]        │ │ │  │
│  │ │ │ Write notes here...  ││ ║ │           └───────────────────────────┘ │ │  │
│  │ │ │ [Auto-saved]    [×] ││ ║ │                                          │ │  │
│  │ │ └──────────────────────┘│ ║ │                                          │ │  │
│  │ └────────────────────────┘ ║ └──────────────────────────────────────────┘ │  │
│  │         [↔ Resize Handle] ═╬═                                             │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│  ┌─ WRITING LAYOUT ──────────────────────────────────────────────────────────┐  │
│  │                                                                           │  │
│  │ ┌─ Task Prompt ──────────┐ ║ ┌─ Answer Area (RIGHT OF SCREEN) ───────────┐ │  │
│  │ │                        │ ║ │                                            │ │  │
│  │ │ TASK 1                 │ ║ │ Write your answer here...                  │ │  │
│  │ │                        │ ║ │                                            │ │  │
│  │ │ Write about...         │ ║ │ [Large text area - answers written here]  │ │  │
│  │ │                        │ ║ │                                            │ │  │
│  │ │ [Task description]     │ ║ │           ┌─ Sticky Controls ─────────────┐ │ │  │
│  │ │                        │ ║ │           │ [◀ Prev]  [Next ▶]        │ │ │  │
│  │ │                        │ ║ │           └───────────────────────────┘ │ │  │
│  │ │                        │ ║ │                                            │ │  │
│  │ │                        │ ║ │ Word count: 146                ✓ Auto-saved │ │  │
│  │ └────────────────────────┘ ║ └────────────────────────────────────────────┘ │  │
│  │         [↔ Resize Handle] ═╬═                                             │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          NAVIGATION BAR (Sticky Bottom)                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ ┌─ Listening Navigation ─────────────────────────────────────────────────────┐ │
│ │ ──────○○○○○○○○  ← Lines above numbers (answered vs unanswered)             │ │
│ │ Part 1 │1││2││3││4││5││6││7││8││9││10│   Part 2: Q11-20   Part 3: Q21-30   Part 4: Q31-40 │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│ ┌─ Reading Navigation ───────────────────────────────────────────────────────┐ │
│ │ ─────○○○○○○○○○○  ← Lines above numbers (answered vs unanswered)            │ │
│ │ Part 1 │1││2││3││4││5││6││7││8││9││10││11││12││13│  Part 2: 0 of 13  Part 3: 0 of 14 ✓ │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│ ┌─ Writing Navigation ───────────────────────────────────────────────────────┐ │
│ │ [Task 1] [Task 2] ← Tabs                                        ✓ Submit   │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                               FOOTER BAR                                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│ ShikhiLAB assessment                 Time: 09:56 (Real Time)   [🔋][📶][Exit]  │
│                                      🔊 Volume Control ← Bottom Right (Listening Only) │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 📐 Layout Specifications

### Grid Structure
```
Container: max-width: 1200px, centered
Header: Fixed top, height: 64px
Instructions: Collapsible, min-height: 80px
Main Content: flex-1, adaptive height
Navigation: Sticky bottom, height: 120px  
Footer: Fixed bottom, height: 48px
```

### Responsive Breakpoints
```
Desktop:  ≥1200px - Full split layout
Tablet:   768-1199px - Stacked content
Mobile:   <768px - Single column
```

### Color Coding System
```
Timer States:
- Normal (>5min):  "X minutes remaining" in standard color
- Warning (1-5min): "X minutes remaining" + ENTIRE header background amber
- Critical (<1min): "X minutes remaining" + ENTIRE header background red
- **WHOLE HEADER CHANGES COLOR for 1-minute warning**

Progress Indicators (UPDATED):
- Answered: ── (solid line ABOVE question number)
- Current: Highlighted question tab
- Flagged: 🔖 icon visible  
- Unanswered: ○ (no line above question number)

Real Time vs Timer:
- Footer shows: "Time: 09:56" (actual clock time)
- Header shows: "30 minutes remaining" (countdown timer)

Volume Control Position:
- Listening Section: Bottom right corner of screen (🔊 ████████░ 80%)
- All Other Sections: No volume control visible
```

### Accessibility Features
```
- All interactive elements: 44px minimum touch target
- Focus indicators: 2px blue outline
- Font scaling: 100%, 125%, 150%
- High contrast modes supported
- Keyboard navigation throughout
- Screen reader compatible ARIA labels
```

## 🔧 Interactive Elements

### Header Icons
- **WiFi**: Connection status indicator
- **🔔**: Notifications/alerts  
- **⚙️ Options**: Comprehensive settings dropdown with:
  - **Contrast**: Black on white / White on black / Yellow on black
  - **Text Size**: Regular / Large / Extra large
  - **Test Instructions**: Access full instructions
  - **Volume Control**: Audio settings (Listening only)
- **📝**: Notes panel toggle (opens overlay on main content)

### Content Tools  
- **🔖 Flag**: Mark question for review
- **📝 Note**: Add personal notes (opens overlay popup on content area)
- **Highlight**: Text selection tool (requires explicit button click after selection)
  - **Process**: Select text → Click "Highlight" button → Text highlighted
  - **Remove**: Click highlighted text → Click "Delete Highlight" button
- **🔊 Volume**: Audio control (POSITIONED IN BOTTOM RIGHT - Listening section only)

### Notes System (Updated)
- **Triggered by**: Selecting text + clicking "Note" button, or notes icon
- **Position**: Overlay popup on main content area (NOT side panel)
- **Features**: 
  - Text input area for writing notes
  - Auto-save functionality
  - Close button (×)
  - Linked to selected text sections

### Section Instructions (Dynamic Content)
**Listening Parts:**
- Part 1: "Listen and answer questions 1–10"
- Part 2: "Listen and answer questions 11–20"  
- Part 3: "Listen and answer questions 21–30"
- Part 4: "Listen and answer questions 31–40"
- **End of test**: 2-minute review period for checking answers

**Reading Parts:**
- Part-specific passage instructions and question types
- Split-screen with resizable panes (drag handle between sections)

**Writing Tasks:**
- Task-specific prompts and requirements
- **Answer Order**: Can complete Task 1 or Task 2 in any order
- **Auto-save**: Answers saved automatically throughout
- **Word Count**: Live word counter displayed

### New Features Added (2025 Updates)
- **Screen Resizing**: Drag handles (║) between sections to adjust pane sizes
- **Notes Overlay**: Notes appear as popup overlays, not side panels
- **Volume Position**: Bottom-right corner for Listening section only
- **Progress Lines**: Lines above question numbers (not circles below)
- **Options Menu**: Comprehensive settings accessible throughout test
- **Auto-termination**: Test stops automatically when time expires
- **Answer Flexibility**: Can review and change answers anytime before submission

### Navigation
- **Question tabs**: Direct jump to questions
- **Part tabs**: Switch between test parts  
- **Task tabs**: Switch between writing tasks (Task 1/Task 2)
- **Submit button**: Complete and submit test (appears in navigation)
- **Prev/Next**: Sequential navigation (contextual within sections)
- **Progress bars**: Visual completion status

## 📱 Adaptive Layouts

| Screen Size | Layout Changes |
|-------------|----------------|
| Desktop | Full split-screen for Reading |
| Tablet | Stacked panes, collapsible instructions |
| Mobile | Single column, slide navigation |

---

**Next Wireframes**: Specific section layouts (Listening → Reading → Writing)

# IELTS CBT Audio Player Interface - Detailed Wireframe

## 🎧 **Audio Player States & Components**

### **State 1: Ready/Preparation State**
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           LISTENING SECTION - Part 1                           │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Questions 1-10                                                                  │
│ Complete the notes. Write ONE WORD AND/OR A NUMBER for each answer.             │
│                                                                                 │
│ Phone call about second-hand furniture                                          │
│                                                                                 │
│ Items:                                                                          │
│ Dining table: – [  1  ] shape                                                  │
│                – medium size                                                    │
│                – [  2  ] old                                                   │
│                                                                                 │
│                             ┌─ Audio Ready State ──────────────────────┐       │
│                             │                                           │       │
│                             │         🎧                               │       │
│                             │                                           │       │
│                             │ You will be listening to an audio clip   │       │
│                             │ during this test. You will not be        │       │
│                             │ permitted to pause or rewind the audio   │       │
│                             │ while answering the questions.            │       │
│                             │                                           │       │
│                             │ To continue, click Play.                  │       │
│                             │                                           │       │
│                             │           [▶ Start]                      │       │
│                             │                                           │       │
│                             └───────────────────────────────────────────┘       │
│                                                                                 │
│                                                     🔊 ████████░ 80%  ← Volume │
│                                                     Bottom Right Corner        │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### **State 2: Playing State**
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           LISTENING SECTION - Part 1                           │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Questions 1-10                                                                  │
│ Complete the notes. Write ONE WORD AND/OR A NUMBER for each answer.             │
│                                                                                 │
│ Phone call about second-hand furniture                                          │
│                                                                                 │
│ Items:                                                                          │
│ Dining table: – [  1  ] shape           ┌─ Audio Playing ─────────────────────┐ │
│                – medium size             │                                     │ │
│                – [  2  ] old             │ 🎧 Audio is playing...             │ │
│                                          │                                     │ │
│ Dining chairs: – set of [ 3 ] chairs    │ Part 1, Questions 1-10             │ │
│                  – seats covered in...  │                                     │ │
│                                          │ ⚠️ Do not pause or rewind          │ │
│                                          │ Listen carefully for question       │ │
│                                          │ numbers                             │ │
│                                          │                                     │ │
│                                          │ [●] Playing... 02:35 / 05:42       │ │
│                                          │                                     │ │
│                                          └─────────────────────────────────────┘ │
│                                                                                 │
│                                                     🔊 ████████░ 80%  ← Volume │
│                                                     Click to adjust            │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### **State 3: Volume Control (Bottom Right)**
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ [Main content area with questions and audio...]                                │
│                                                                                 │
│                                                                                 │
│                                                                                 │
│                                                                                 │
│                                                                   ┌─ Volume ──┐ │
│                                                                   │            │ │
│                                                                   │ Volume     │ │
│                                                                   │ Control    │ │
│                                                                   │            │ │
│                                                                   │    100%    │ │
│                                                                   │ ███████████│ │
│                                                                   │ ███████████│ │
│                                                                   │ ███████████│ │
│                                                                   │ ███████████│ │
│                                                                   │ ██████░░░░░│ │
│                                                                   │ ██░░░░░░░░░│ │ 
│                                                                   │ ░░░░░░░░░░░│ │
│                                                                   │     0%     │ │
│                                                                   │            │ │
│                                                                   │    [×]     │ │
│                                                                   └────────────┘ │
│                                               🔊 ████████░ 60%  ← Click to open │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### **State 4: Audio Complete/Review State**
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           LISTENING SECTION - Part 1                           │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Questions 1-10                                                                  │
│ Complete the notes. Write ONE WORD AND/OR A NUMBER for each answer.             │
│                                                                                 │
│ Phone call about second-hand furniture                                          │
│                                                                                 │
│ Items:                                                                          │
│ Dining table: – [ round ] shape                                                │
│                – medium size                                                    │
│                – [ 2 ] old                                                     │
│                                                                                 │
│ Dining chairs: – set of [ 4 ] chairs    ┌─ Audio Complete ───────────────────┐ │
│                  – seats covered in...  │                                     │ │
│                                          │ ✓ Audio playback completed         │ │
│                                          │                                     │ │
│                                          │ You now have 2 minutes to review   │ │
│                                          │ and check all your answers for     │ │
│                                          │ Part 1.                            │ │
│                                          │                                     │ │
│                                          │ Review time remaining: 01:45       │ │
│                                          │                                     │ │
│                                          │ [Next Part] [Review Answers]       │ │
│                                          │                                     │ │
│                                          └─────────────────────────────────────┘ │
│                                                                                 │
│                                                     🔊 ████████░ 80%           │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### **State 5: Buffer/Loading State**
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           LISTENING SECTION - Part 1                           │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Questions 1-10                                                                  │
│                                                                                 │
│                             ┌─ Audio Loading ──────────────────────────┐       │
│                             │                                           │       │
│                             │         🎧                               │       │
│                             │                                           │       │
│                             │ Loading audio...                          │       │
│                             │                                           │       │
│                             │ ████████████░░░░░░░░░░░░ 60%             │       │
│                             │                                           │       │
│                             │ Please wait while the audio loads.       │       │
│                             │ Do not refresh the page.                 │       │
│                             │                                           │       │
│                             └───────────────────────────────────────────┘       │
│                                                                                 │
│                                                     🔊 ████████░ 80%           │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### **State 6: Error State**
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           LISTENING SECTION - Part 1                           │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Questions 1-10                                                                  │
│                                                                                 │
│                             ┌─ Audio Error ────────────────────────────┐       │
│                             │                                           │       │
│                             │         ⚠️                               │       │
│                             │                                           │       │
│                             │ Audio failed to load                      │       │
│                             │                                           │       │
│                             │ There was a problem loading the audio     │       │
│                             │ file. Please contact your supervisor      │       │
│                             │ for assistance.                           │       │
│                             │                                           │       │
│                             │ [Retry] [Contact Supervisor]             │       │
│                             │                                           │       │
│                             └───────────────────────────────────────────┘       │
│                                                                                 │
│                                                     🔊 ████████░ 80%           │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 🎯 **Audio Player Component Specifications**

### **Core Behaviors**
| Feature | Specification | Notes |
|---------|---------------|--------|
| Playback | **Single play only** - no pause/rewind | Core IELTS requirement |
| Volume | **Bottom-right corner** - always accessible | 2025 positioning update |
| Auto-start | Audio begins automatically after preparation | No manual play during test |
| Progress | **Visual timer** during playback | Shows elapsed/total time |
| Review | **2-minute review period** after each part | Listening-specific feature |

### **Volume Control Details**
```
Position: Fixed bottom-right corner
Size: 40px height, click to expand
States: Collapsed (🔊 ██████░ 60%) | Expanded (full slider)
Range: 0% - 100% in 10% increments
Keyboard: Arrow keys when focused
Accessibility: ARIA slider, screen reader compatible
```

### **Audio Player States**
```
Ready State:
- Large centered overlay with headphone icon
- Instructions about single playback
- [▶ Start] button to begin
- Volume control already visible bottom-right

Playing State:
- Minimal overlay showing progress
- Part/question information
- Warning about no pause/rewind
- Progress bar and time counter

Review State:
- Confirmation of completion
- 2-minute countdown timer
- Navigation options to next part
- Answers still editable
```

### **Technical Requirements**
- **Audio Format**: MP3, WAV support
- **Buffer Time**: 3-5 second pre-load
- **Connection**: Graceful degradation for slow connections
- **Accessibility**: WCAG 2.1 AA compliant
- **Error Handling**: Clear error messages with supervisor contact
- **Keyboard**: Full keyboard navigation support

### **Integration Points**
- **Question Navigation**: Audio progress syncs with question tabs
- **Answer Input**: Users can type while audio plays
- **Flag System**: Flag questions during audio playback
- **Notes**: Can take notes during audio (overlay popup)
- **Timer**: Audio time separate from section timer

## 🔧 **Component Interactions**

### **User Flow: Complete Audio Cycle**
```
1. User navigates to Listening section
2. Audio Player shows "Ready State" overlay
3. User clicks [▶ Start] button
4. Audio loads (Buffer State if needed)
5. Audio plays automatically (Playing State)
6. User answers questions while listening
7. Audio completes (Review State shows)
8. 2-minute review period with countdown
9. Auto-advance to next part OR manual navigation
```

### **Volume Control Interaction**
```
1. Volume icon visible in bottom-right (all states)
2. Click volume icon → expanded slider appears
3. Drag slider OR click position to adjust
4. Real-time audio adjustment during playback
5. Click [×] or click outside to close slider
6. Volume setting persists throughout test
```

### **Error Recovery**
```
Connection Issues:
- Show loading state with progress bar
- Auto-retry 3 times with exponential backoff
- After 3 failures, show error state with manual retry

Audio File Issues:
- Immediate error state display
- Contact supervisor option
- Do not auto-advance or lose progress
```

---

## ✅ **Audio Player Wireframe Complete**

This detailed wireframe covers all 6 critical states and shows exactly how the audio player integrates with the overall IELTS CBT interface, including the 2025 volume control positioning update.

**Ready for next component wireframe?** 
- **B) Options Menu Dropdown** 
- **C) Notes Overlay Panel**
- **D) Timer Warning States**

# IELTS CBT Progress Navigation System - Detailed Wireframe

## 📊 **Progress Navigation Components & States**

### **Component 1: Listening Navigation (4 Parts, 40 Questions Total)**
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          LISTENING NAVIGATION BAR                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ ┌─ Active Part (Part 1) ─────────────────────────────────────────────────────┐ │
│ │ ──────○○○○○○○○  ← Progress Lines (ABOVE question numbers)                  │ │
│ │ Part 1 │1││2││3││4││5││6││7││8││9││10│                                      │ │
│ │         ↑  ↑  ↑  ↑                                                          │ │
│ │     Answered │  │  Current Question (highlighted)                           │ │
│ │              │  Unanswered                                                  │ │
│ │              Answered                                                       │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│ ┌─ Inactive Parts ───────────────────────────────────────────────────────────┐ │
│ │ Part 2: Q11-20    Part 3: Q21-30    Part 4: Q31-40                        │ │
│ │ [Collapsed view - no individual question numbers shown]                    │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### **Component 2: Reading Navigation (3 Parts, Variable Questions)**
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           READING NAVIGATION BAR                                │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ ┌─ Active Part (Part 1) ─────────────────────────────────────────────────────┐ │
│ │ ─────────○○○○  ← Progress Lines (ABOVE question numbers)                   │ │
│ │ Part 1 │1││2││3││4││5││6││7││8││9││10││11││12││13│                         │ │
│ │         ↑     ↑           ↑                                                 │ │
│ │     Answered  │       Current (Q10)                                        │ │
│ │           Flagged                                                           │ │
│ │               🔖 ← Flag indicator overlays on question number               │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│ ┌─ Inactive Parts ───────────────────────────────────────────────────────────┐ │
│ │ Part 2: 0 of 13 Questions        Part 3: 0 of 14 Questions           ✓    │ │
│ │ [Shows progress count]            [Shows progress count]     [Checkmark]   │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### **Component 3: Writing Navigation (2 Tasks)**
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           WRITING NAVIGATION BAR                                │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ ┌─ Task Navigation ──────────────────────────────────────────────────────────┐ │
│ │                                                                             │ │
│ │ [Task 1] [Task 2] ← Tab-based navigation                                   │ │
│ │    ●       ○     ← Task completion indicators                              │ │
│ │ Active   Inactive                                                          │ │
│ │                                                                             │ │
│ │                                                           [✓ Submit Test]  │ │
│ │                                                                             │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 🎯 **Progress Line States & Visual Indicators**

### **Progress Line Visual Legend**
```
─ = Answered question (solid line above number)
○ = Unanswered question (no line above number)  
█ = Current question (highlighted background)
🔖 = Flagged question (flag icon overlay)

Example Progress Pattern:
──────○○○○○○○○  ← 6 answered, 7 unanswered, 3 total questions
│1││2││3││4││5││6││7││8││9││10││11││12││13│
 ↑                    ↑
Answered            Current
```

### **Question State Combinations**
```
┌─ All Possible Question States ─────────────────────────────────────────────────┐
│                                                                                 │
│ State 1: Answered + Not Flagged                                                │
│ ─                                                                               │
│ │1│  ← Solid line above, normal styling                                        │
│                                                                                 │
│ State 2: Unanswered + Not Flagged                                              │
│ ○                                                                               │ 
│ │2│  ← No line above, normal styling                                           │
│                                                                                 │
│ State 3: Current Question                                                       │
│ ○                                                                               │
│ █3█  ← Highlighted background, may or may not have line above                  │
│                                                                                 │
│ State 4: Answered + Flagged                                                     │
│ ─                                                                               │
│ │4│🔖 ← Solid line above + flag icon overlay                                   │
│                                                                                 │
│ State 5: Unanswered + Flagged                                                   │
│ ○                                                                               │
│ │5│🔖 ← No line above + flag icon overlay                                      │
│                                                                                 │
│ State 6: Current + Flagged                                                      │
│ ○                                                                               │
│ █6█🔖 ← Highlighted background + flag icon overlay                             │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 🔄 **Navigation Interaction Patterns**

### **Listening Section Behavior**
```
┌─ Part 1 Active (Audio Playing) ────────────────────────────────────────────────┐
│                                                                                 │
│ User Behavior: Audio plays, user answers questions in sequence                 │
│                                                                                 │
│ ──────○○○○○○○○  ← Auto-updates as user completes answers                      │
│ Part 1 │1││2││3││4││5││6││7││8││9││10│                                        │
│                                                                                 │
│ Navigation Rules:                                                               │
│ • Can click any question number to jump to that question                       │
│ • Progress line appears automatically when answer is entered                   │
│ • Current question highlighted as user navigates                               │
│ • Can flag questions during or after audio                                     │
│                                                                                 │
│ After Audio Completes:                                                          │
│ • 2-minute review period                                                        │
│ • All questions remain accessible                                              │
│ • Can change answers, add/remove flags                                         │
│ • Auto-advance to Part 2 after review time OR manual navigation                │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─ Part 2 Becomes Active ────────────────────────────────────────────────────────┐
│                                                                                 │
│ Part 1 Completed State:                                                         │
│ Part 1: ████████████ 10/10 Questions Completed                                │
│                                                                                 │
│ Part 2 Active State:                                                            │
│ ○○○○○○○○○○  ← Fresh progress tracking for questions 11-20                     │
│ Part 2 │11││12││13││14││15││16││17││18││19││20│                               │
│                                                                                 │
│ Inactive Parts:                                                                 │
│ Part 3: Q21-30    Part 4: Q31-40                                              │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### **Reading Section Behavior**
```
┌─ Reading Navigation Flow ──────────────────────────────────────────────────────┐
│                                                                                 │
│ User Behavior: Can navigate freely between all parts and questions             │
│                                                                                 │
│ Part 1 Active (13 questions):                                                  │
│ ─────────○○○○  ← User has answered 9 out of 13 questions                      │
│ │1││2││3││4││5││6││7││8││9││10││11││12││13│                                   │
│                                                                                 │
│ Navigation Rules:                                                               │
│ • Click any question number in active part to jump directly                    │
│ • Click Part 2 or Part 3 to switch parts entirely                             │
│ • Progress persists when switching between parts                               │
│ • Flag status maintained across navigation                                     │
│                                                                                 │
│ When switching to Part 2:                                                       │
│ Part 1: 9 of 13 Questions ← Summary view                                       │
│                                                                                 │
│ Part 2 becomes expanded:                                                        │
│ ○○○○○○○○○○○○○  ← Fresh tracking for Part 2 questions                          │
│ │1││2││3││4││5││6││7││8││9││10││11││12││13│                                   │
│                                                                                 │
│ Part 3: 0 of 14 Questions ← Collapsed view                                     │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### **Writing Section Behavior**
```
┌─ Writing Task Navigation ──────────────────────────────────────────────────────┐
│                                                                                 │
│ User Behavior: Can switch freely between Task 1 and Task 2                     │
│                                                                                 │
│ Task 1 Active:                                                                  │
│ [Task 1] [Task 2]                                                              │
│    ●       ○     ← Visual indicators show current task                         │
│ Active   Inactive                                                              │
│                                                                                 │
│ Progress Indicators:                                                            │
│ • ● = Task has content/been worked on                                          │
│ • ○ = Task not started or empty                                                │
│ • Auto-save status shown per task                                              │
│                                                                                 │
│ Task Switching:                                                                 │
│ • Click [Task 2] tab to switch                                                 │
│ • Content auto-saved before switching                                          │
│ • Word count and progress preserved per task                                   │
│ • Can complete tasks in any order                                              │
│                                                                                 │
│ Submit Button:                                                                  │
│ • [✓ Submit Test] appears when both tasks have content                         │
│ • Warns if tasks appear incomplete                                             │
│ • Final submission confirmation dialog                                         │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 🎨 **Visual Design Specifications**

### **Progress Line Styling**
```
Answered Line (─):
- Color: #52c41a (Green)
- Height: 3px
- Width: 100% of question tab
- Position: 2px above question number
- Animation: Slides in from left when answer completed

Unanswered (○):
- No visual line
- Question number in default state
- Slightly muted color: #8c8c8c

Current Question Highlight:
- Background: #e6f7ff (Light blue)
- Border: 2px solid #1890ff (Blue)
- Text: #1890ff (Blue)
- Transition: 200ms ease-in-out

Flag Icon:
- Icon: 🔖 (bookmark emoji or custom icon)
- Position: Top-right corner of question tab
- Size: 12px × 12px
- Color: #faad14 (Amber)
- Z-index: Above progress line
```

### **Interactive States**
```
Question Tab States:
Default:     [Q] ← Gray border, white background
Hovered:     [Q] ← Light gray background, blue border
Active:      [Q] ← Blue background, white text
Answered:    [Q] ← Green line above, normal styling
Flagged:     [Q]🔖 ← Flag icon overlay, amber accent

Part Tab States:
Active Part:   Expanded with individual question numbers
Inactive Part: Collapsed with summary count (e.g., "0 of 13")
Completed:     Check mark (✓) indicator
```

### **Accessibility Features**
```
Keyboard Navigation:
- Tab key: Move between question numbers
- Arrow keys: Navigate within part
- Enter/Space: Select question
- F: Flag/unflag current question

Screen Reader Support:
- ARIA labels: "Question 1 of 10, answered"
- Live regions: Announce progress changes
- Role attributes: "navigation", "tablist", "tab"

High Contrast Mode:
- Enhanced border thickness
- Higher color contrast ratios
- Alternative progress indicators (patterns vs colors)

Focus Indicators:
- 2px dotted outline for keyboard focus
- High contrast focus ring
- Clear focus order through navigation
```

## 🔧 **Technical Integration Points**

### **Data Structure**
```javascript
// Example progress tracking data structure
const navigationState = {
  section: "listening", // "listening" | "reading" | "writing"
  currentPart: 1,
  currentQuestion: 3,
  
  progress: {
    part1: {
      questions: [
        { id: 1, answered: true, flagged: false, content: "round" },
        { id: 2, answered: true, flagged: true, content: "2" },
        { id: 3, answered: false, flagged: false, content: "" },
        // ... rest of questions
      ],
      totalQuestions: 10,
      answeredCount: 2
    },
    part2: {
      questions: [...],
      totalQuestions: 10,
      answeredCount: 0
    }
    // ... other parts
  }
}
```

### **Update Triggers**
```
Progress Line Updates:
✓ When user enters/modifies answer in input field
✓ When user selects multiple choice option
✓ When user completes drag-and-drop action
✓ When answer is auto-saved
✓ When user navigates away from question with content

Flag Updates:
✓ When user clicks flag button
✓ When user uses keyboard shortcut (F key)
✓ Via context menu on question

Navigation Updates:
✓ When user clicks question number
✓ When user clicks part tab
✓ When audio completes (listening section)
✓ When review time expires
✓ When user submits section
```

## 📊 **Progress Tracking Rules**

### **Answer Detection Logic**
```
Listening/Reading:
- Text input: Answered = field has non-whitespace content
- Multiple choice: Answered = option selected
- Drag-drop: Answered = item placed in drop zone
- Matching: Answered = pair completed

Writing:
- Task 1: In progress = >10 words typed
- Task 2: In progress = >10 words typed
- Word count thresholds trigger progress indicators

Validation:
- No client-side answer validation (prevent cheating)
- Progress based purely on interaction completion
- Server-side validation only occurs at submission
```

### **Auto-Save Integration**
```
Answer Persistence:
- Auto-save triggers 2 seconds after last input
- Progress line appears immediately after auto-save
- Visual confirmation: Brief "saved" indicator
- Recovery: Restore progress on page reload/connection issues

Offline Handling:
- Progress cached locally
- Sync when connection restored
- Clear indicators for offline state
- Prevent submission while offline
```

---

## ✅ **Progress Navigation System Complete**

This detailed wireframe shows the complete navigation and progress tracking system across all three IELTS CBT sections, including the critical 2025 update to lines above question numbers rather than circles below.

### **Key Features Documented:**
- ✅ **Lines above numbers** (not circles below)
- ✅ **Section-specific behaviors** (Listening vs Reading vs Writing)
- ✅ **All question states** (answered, flagged, current, combinations)
- ✅ **Interactive patterns** (navigation, part switching, auto-updates)
- ✅ **Visual specifications** (colors, animations, accessibility)
- ✅ **Technical integration** (data structures, update triggers)

**Ready for next component wireframe?**
- **B) ⚙️ Options Menu Dropdown** 
- **C) 📝 Notes Overlay Panel**
- **D) ⏰ Timer Warning States**