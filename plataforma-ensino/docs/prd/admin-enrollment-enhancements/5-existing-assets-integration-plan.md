# 5. Existing Assets & Integration Plan

- **Target Page:** The existing admin enrollment page.
- **Components to Integrate:** `TeacherSelector.tsx`, `ConditionalCalendar.tsx`.
- **Backend Integration:** The form will use existing APIs to populate components. The submission will `POST` to an admin-only endpoint that handles the creation/update of the enrollment and its associated schedule.
