
# PRD: Admin Enrollment Page Enhancement with Conditional Scheduling

**Version:** 1.1  
**Date:** 2025-07-24  
**Author:** John, Product Manager  
**Status:** Final

---

## 1. Introduction & Problem Statement

### 1.1. Problem
The current admin enrollment process is not equipped to handle the distinct needs of in-person ("presencial") versus online student enrollments. Administrators require a manual, error-prone workaround to schedule in-person students and calculate their correct course end dates.

### 1.2. Opportunity
By intelligently enhancing the **existing admin enrollment page**, we can provide a single, streamlined interface that handles all enrollment types. This includes integrating our powerful, pre-built scheduling components and automating the end-date calculation based on modality and holiday schedules.

## 2. Objective & Goals

### 2.1. Primary Objective
To enhance the existing admin enrollment page to support a conditional workflow, enabling administrators to assign teachers, schedule time slots, and automatically calculate an accurate course end date.

### 2.2. Key Goals
- **Context-Aware UI:** The enrollment form will dynamically show scheduling fields based on the selected enrollment modality.
- **Automated End Date:** Replace the manual `end_date` field with a real-time, automated calculation that respects holidays and scheduling.
- **Flexible Scheduling:** Support the selection of one or two weekly classes for in-person students.
- **Enhanced Teacher Experience:** Provide teachers with at-a-glance visual cues on their calendars for students nearing course completion.

## 3. Core Workflow & Requirements

### 3.1. The Enrollment Modality Trigger
The primary trigger for the new functionality is a **"Curso Presencial" (In-person Course) checkbox** on the enrollment form.

- **Initial State:** The checkbox is **unchecked** by default. The `TeacherSelector` and `ConditionalCalendar` components are **hidden**.
- **User Action:** When the administrator **checks** the "Curso Presencial" box, the "Scheduling" section of the form becomes visible.
- **Reverting:** If the admin **unchecks** the box, the form must clear any selected teacher/time slots and hide the "Scheduling" section.

### 3.2. Conditional "Scheduling" Section
This section is only visible when "Curso Presencial" is checked.

#### 3.2.1. Teacher Selection
- The `TeacherSelector` component will be displayed and is **mandatory**.
- The list of teachers is not filtered by course.

#### 3.2.2. Schedule Selection
- After a teacher is selected, the `ConditionalCalendar` component is displayed and is **mandatory**.
- The calendar displays the availability of the **selected teacher only**.

#### 3.2.3. Weekly Frequency
- A checkbox labeled **"Duas aulas por semana" (Two classes per week)** is displayed.
- **If unchecked:** The calendar allows the selection of **one** recurring time slot.
- **If checked:** The calendar allows the selection of **two distinct time slots** with the same teacher, preventing duplicate selections for the same day/time.

### 3.3. Form Submission & Validation
- **Online Enrollment:** Can be submitted without a teacher or schedule.
- **In-person Enrollment:** Validation must fail if a teacher and the required time slots are not selected.

### 3.4. Editing an Existing Enrollment
- When editing an in-person enrollment, the form will load with the "Scheduling" section visible and pre-populated with the saved teacher and schedule, allowing the admin to make changes.

## 4. Feature Deep Dive: Automated End Date & Calendar Cues

### 4.1. Automated End Date Calculation
The manual `end_date` field will be replaced with a **read-only, dynamically calculated display**.

#### 4.1.1. Online Student Calculation
- **Logic:** `end_date` = `start_date` + `course_duration`.

#### 4.1.2. In-person Student Calculation
- **Logic:** The `end_date` is determined by projecting forward from the `start_date` until a required number of classes are completed.
- **Total Classes:** The number of classes is derived from the course duration (e.g., a 1-month course requires 4 classes).
- **Holiday Integration:** The calculation must use the existing holiday system. If a scheduled class falls on a holiday, that class is **skipped**, does not count towards the total, and the `end_date` is extended accordingly.
- **Scheduling Scenarios:**
    - This logic applies to both days for students with two classes per week.
    - If two separate classes are scheduled on the same calendar day and that day is a holiday, **both** classes are skipped and must be made up.

### 4.2. Teacher-Facing Calendar Enhancements
To improve the teacher's experience, their personal calendar view will be enhanced with the following visual cues.

#### 4.2.1. "One Month Remaining" Indicator
- **Trigger:** When the current date is **four weeks (28 days) or less** from a student's calculated `end_date`.
- **Display:** A text label **"1 mês para finalizar"** will appear next to the student's name on all their scheduled classes within this period.

#### 4.2.2. "Last Class" Indicator
- **Trigger:** On the date of the student's final scheduled class.
- **Display:** A text label **"Última aula"** will appear next to the student's name for that specific session.

## 5. Existing Assets & Integration Plan

- **Target Page:** The existing admin enrollment page.
- **Components to Integrate:** `TeacherSelector.tsx`, `ConditionalCalendar.tsx`.
- **Backend Integration:** The form will use existing APIs to populate components. The submission will `POST` to an admin-only endpoint that handles the creation/update of the enrollment and its associated schedule.

## 6. Out of Scope
- Student-facing, self-service enrollment.
- Filtering teachers based on course qualifications.
- Any changes to the online enrollment workflow beyond the automated end date calculation.
