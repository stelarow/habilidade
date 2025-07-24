# 3. Core Workflow & Requirements

## 3.1. The Enrollment Modality Trigger
The primary trigger for the new functionality is a **"Curso Presencial" (In-person Course) checkbox** on the enrollment form.

- **Initial State:** The checkbox is **unchecked** by default. The `TeacherSelector` and `ConditionalCalendar` components are **hidden**.
- **User Action:** When the administrator **checks** the "Curso Presencial" box, the "Scheduling" section of the form becomes visible.
- **Reverting:** If the admin **unchecks** the box, the form must clear any selected teacher/time slots and hide the "Scheduling" section.

## 3.2. Conditional "Scheduling" Section
This section is only visible when "Curso Presencial" is checked.

### 3.2.1. Teacher Selection
- The `TeacherSelector` component will be displayed and is **mandatory**.
- The list of teachers is not filtered by course.

### 3.2.2. Schedule Selection
- After a teacher is selected, the `ConditionalCalendar` component is displayed and is **mandatory**.
- The calendar displays the availability of the **selected teacher only**.

### 3.2.3. Weekly Frequency
- A checkbox labeled **"Duas aulas por semana" (Two classes per week)** is displayed.
- **If unchecked:** The calendar allows the selection of **one** recurring time slot.
- **If checked:** The calendar allows the selection of **two distinct time slots** with the same teacher, preventing duplicate selections for the same day/time.

## 3.3. Form Submission & Validation
- **Online Enrollment:** Can be submitted without a teacher or schedule.
- **In-person Enrollment:** Validation must fail if a teacher and the required time slots are not selected.

## 3.4. Editing an Existing Enrollment
- When editing an in-person enrollment, the form will load with the "Scheduling" section visible and pre-populated with the saved teacher and schedule, allowing the admin to make changes.
