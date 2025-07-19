# Requirements Document

## Introduction

Fix the responsive layout issue in the lesson page header where text elements wrap to multiple lines and overlap with the "Sair da Aula" (Exit Lesson) button when the browser window is not maximized. The header should maintain proper spacing and readability across all screen sizes while preserving the Habilidade brand design.

## Requirements

### Requirement 1

**User Story:** As a student accessing lessons on different screen sizes, I want the header to display properly without text overlap, so that I can always see all information clearly and access the exit button.

#### Acceptance Criteria

1. WHEN the browser window is resized to smaller widths THEN the header text SHALL NOT wrap to multiple lines that overlap with the exit button
2. WHEN viewing the lesson header on tablet or mobile devices THEN all progress indicators SHALL remain visible and properly spaced
3. WHEN the header content exceeds available width THEN text SHALL be truncated with ellipsis rather than wrapping
4. WHEN hovering over truncated text THEN a tooltip SHALL display the full text content

### Requirement 2

**User Story:** As a student using the platform on various devices, I want the header progress indicators to remain functional and visible, so that I can track my lesson progress regardless of screen size.

#### Acceptance Criteria

1. WHEN viewing on screens smaller than 1024px width THEN progress indicators SHALL stack vertically or use compact layout
2. WHEN progress text is too long for available space THEN it SHALL be abbreviated (e.g., "Vídeo: 100%" becomes "V: 100%")
3. WHEN screen width is below 768px THEN non-essential header elements SHALL be hidden or moved to a collapsible menu
4. WHEN the header layout changes for smaller screens THEN the Habilidade logo SHALL remain visible and properly sized

### Requirement 3

**User Story:** As a student, I want the "Sair da Aula" button to always be accessible and properly positioned, so that I can exit the lesson at any time without UI interference.

#### Acceptance Criteria

1. WHEN the header content changes size THEN the exit button SHALL maintain its position and remain clickable
2. WHEN text elements are present in the header THEN they SHALL NOT overlap with the exit button at any screen size
3. WHEN viewing on mobile devices THEN the exit button SHALL be appropriately sized for touch interaction
4. WHEN the header is in compact mode THEN the exit button SHALL remain prominently visible

### Requirement 4

**User Story:** As a developer maintaining the lesson interface, I want the header component to be responsive and maintainable, so that future changes don't break the layout.

#### Acceptance Criteria

1. WHEN implementing the responsive design THEN CSS Grid or Flexbox SHALL be used for proper layout control
2. WHEN screen size changes THEN the layout SHALL use CSS media queries for breakpoint management
3. WHEN adding new header elements THEN the responsive behavior SHALL be preserved
4. WHEN testing the header THEN it SHALL work correctly across Chrome, Firefox, Safari, and Edge browsers