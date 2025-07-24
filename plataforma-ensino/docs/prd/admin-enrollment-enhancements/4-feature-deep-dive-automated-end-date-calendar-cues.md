# 4. Feature Deep Dive: Automated End Date & Calendar Cues

## 4.1. Automated End Date Calculation
The manual `end_date` field will be replaced with a **read-only, dynamically calculated display**.

### 4.1.1. Online Student Calculation
- **Logic:** `end_date` = `start_date` + `course_duration`.

### 4.1.2. In-person Student Calculation
- **Logic:** The `end_date` is determined by projecting forward from the `start_date` until a required number of classes are completed.
- **Total Classes:** The number of classes is derived from the course duration (e.g., a 1-month course requires 4 classes).
- **Holiday Integration:** The calculation must use the existing holiday system. If a scheduled class falls on a holiday, that class is **skipped**, does not count towards the total, and the `end_date` is extended accordingly.
- **Scheduling Scenarios:**
    - This logic applies to both days for students with two classes per week.
    - If two separate classes are scheduled on the same calendar day and that day is a holiday, **both** classes are skipped and must be made up.

## 4.2. Teacher-Facing Calendar Enhancements
To improve the teacher's experience, their personal calendar view will be enhanced with the following visual cues.

### 4.2.1. "One Month Remaining" Indicator
- **Trigger:** When the current date is **four weeks (28 days) or less** from a student's calculated `end_date`.
- **Display:** A text label **"1 mês para finalizar"** will appear next to the student's name on all their scheduled classes within this period.

### 4.2.2. "Last Class" Indicator
- **Trigger:** On the date of the student's final scheduled class.
- **Display:** A text label **"Última aula"** will appear next to the student's name for that specific session.
