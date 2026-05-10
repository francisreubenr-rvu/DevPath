# Brio Learning Platform Redesign (Learning Tab)

Date: 2026-05-09
Owner: Claude + user
Scope: Redesign the Learning Platform tab into a true learning home while keeping DBMS Showcase and System Viz tabs intact.

## Goals
- Make the Learning Platform tab feel like a modern learning platform.
- Drive the UI from PDF-derived subject content.
- Provide subject pages with overview, lessons, quizzes, assignments, and resources.
- Preserve existing tabs (Learning Platform / DBMS Showcase / System Viz).

## Non-Goals
- Rebuild the DBMS Showcase or System Viz content.
- Change backend DB schema for core DBMS demo.
- Implement real user progress persistence in DB (use client-side for now).

## Information Architecture
- Tabs remain unchanged.
- Learning Platform tab becomes the learning home:
  - Continue Learning panel (next lesson, progress bar)
  - Subject catalog with filters (semester, subject type, difficulty)
  - Learning stats panel (streak, completion %, upcoming quizzes)
- Subject card click opens a Subject Page with:
  - Overview hero (summary, key topics, credits)
  - Lessons list (Start/Resume actions, status chips)
  - Quizzes section (3-5 quick checks)
  - Assignments section (if available)
  - Notes/resources (PDF highlights + file list)

## Visual & Interaction Direction
- Modern product style with light neobrutalism.
- Thick borders, soft shadows, bold cards, bright accent blocks.
- Typography: expressive serif for titles, clean sans for body, mono for code/DBMS.
- Motion: subtle page-load fade; hover elevation for cards and CTAs.
- Buttons: chunky CTAs with crisp borders and strong contrast.

## Data Mapping & Content Flow
- Subject catalog driven by generated PDF content (subject name, overview, key topics, lessons).
- Subject page uses:
  - Overview: PDF-derived summary
  - Lessons: 4-6 lessons per subject
  - Quizzes: 3-5 questions where present
  - Assignments: derived from exercise/question headings when available
  - Resources: list of original PDF files + key terms
- Continue Learning uses localStorage to store last opened subject/lesson.
- Progress is computed client-side from completed lessons.

## Components (Learning Tab)
- LearningHome
  - ContinueLearningCard
  - SubjectFilters
  - SubjectCatalogGrid
  - LearningStatsPanel
- SubjectPage
  - SubjectHero
  - LessonList
  - QuizSection
  - AssignmentSection
  - ResourcesPanel
- Shared
  - ProgressRing
  - StatusChip
  - CTAButton

## Data Flow
- On load, fetch subjects content JSON from a static endpoint.
- Populate filters and catalog from JSON.
- On subject click:
  - Update localStorage currentSubject/currentLesson.
  - Render SubjectPage in place of catalog.
- Lesson completion toggles stored in localStorage and updates progress UI.

## Error Handling
- If subjects JSON missing or empty: show an empty state with retry.
- If a subject is missing a section (quizzes/assignments), hide that section.
- If localStorage is unavailable, degrade gracefully (no persistence).

## Testing & Verification
- Manual verification:
  - Learning home loads with subjects and filters.
  - Subject card opens subject page with correct sections.
  - Continue Learning updates after opening a lesson.
  - Progress indicators update when marking lessons complete.
- Visual QA:
  - Desktop + mobile layouts display correctly.
  - Hover and focus states are visible and accessible.

## Open Questions
- None; all choices approved by user.
