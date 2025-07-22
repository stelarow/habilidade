# PRD Section 3: User Requirements
[← Back to Index](./index.md) | [← Previous: System Architecture](./02-system-architecture.md) | [Next: Marketing Website Specs →](./04-marketing-website-specs.md)

---

## User Personas

### Primary Personas

#### 🎓 Sofia - The Young Professional
**Demographics:**
- Age: 26
- Role: Marketing Assistant
- Location: São Paulo
- Income: R$ 3,500/month
- Tech Savvy: High

**Goals:**
- Transition to digital marketing
- Increase salary by 50%
- Build portfolio
- Network with professionals

**Pain Points:**
- Limited time after work
- Expensive bootcamps
- Theory-heavy courses
- No practical experience

**Platform Usage:**
- Evening learning (7-10 PM)
- Mobile + Desktop
- Prefers video content
- Active in discussions

---

#### 🔄 Carlos - The Career Changer
**Demographics:**
- Age: 34
- Role: Bank Manager
- Location: Rio de Janeiro
- Income: R$ 7,000/month
- Tech Savvy: Medium

**Goals:**
- Switch to tech career
- Learn programming
- Maintain income level
- Job placement support

**Pain Points:**
- Starting from zero
- Family responsibilities
- Fear of failure
- Time investment concern

**Platform Usage:**
- Weekend intensive sessions
- Desktop primarily
- Needs structured path
- Values certificates

---

#### 🎯 Ana - The Upskiller
**Demographics:**
- Age: 29
- Role: Graphic Designer
- Location: Belo Horizonte
- Income: R$ 4,500/month
- Tech Savvy: High

**Goals:**
- Add web design skills
- Freelance opportunities
- Stay current with trends
- Expand service offerings

**Pain Points:**
- Outdated skills
- Platform overwhelm
- Project-based learning need
- Portfolio building

**Platform Usage:**
- Lunch break learning
- Project-focused
- Community engagement
- Resource downloads

### Secondary Personas

#### 👨‍🏫 Roberto - The Instructor
**Demographics:**
- Age: 38
- Role: Senior Developer
- Experience: 12 years
- Location: Porto Alegre

**Goals:**
- Share knowledge
- Passive income
- Personal brand
- Industry recognition

**Needs:**
- Easy content creation
- Student engagement tools
- Revenue transparency
- Marketing support

---

#### 👩‍💼 Mariana - The Administrator
**Demographics:**
- Age: 31
- Role: Platform Manager
- Background: EdTech
- Location: São Paulo

**Goals:**
- Platform growth
- User satisfaction
- Operational efficiency
- Data-driven decisions

**Needs:**
- Comprehensive dashboard
- Automated workflows
- Real-time analytics
- Support tools

---

## User Journey Maps

### Student Journey: From Discovery to Certification

#### 1. Discovery Phase
```
Touchpoints: Google → Landing Page → Course Catalog
├── Actions
│   ├── Searches for "curso programação"
│   ├── Compares options
│   └── Reads reviews
├── Emotions
│   ├── Curious but skeptical
│   ├── Overwhelmed by choices
│   └── Excited about possibilities
└── Opportunities
    ├── Clear value proposition
    ├── Social proof
    └── Free preview content
```

#### 2. Evaluation Phase
```
Touchpoints: Course Page → Curriculum → Instructor Profile
├── Actions
│   ├── Reviews curriculum
│   ├── Watches intro video
│   └── Checks prerequisites
├── Emotions
│   ├── Analytical
│   ├── Comparing value
│   └── Seeking reassurance
└── Opportunities
    ├── Detailed information
    ├── Success stories
    └── Money-back guarantee
```

#### 3. Enrollment Phase
```
Touchpoints: Pricing → Registration → Payment
├── Actions
│   ├── Selects payment plan
│   ├── Creates account
│   └── Completes payment
├── Emotions
│   ├── Committed
│   ├── Slight anxiety
│   └── Anticipation
└── Opportunities
    ├── Smooth checkout
    ├── Welcome email
    └── Quick start guide
```

#### 4. Learning Phase
```
Touchpoints: Dashboard → Lessons → Assignments
├── Actions
│   ├── Watches videos
│   ├── Completes exercises
│   └── Asks questions
├── Emotions
│   ├── Engaged
│   ├── Challenged
│   └── Accomplished
└── Opportunities
    ├── Progress celebration
    ├── Peer interaction
    └── Instructor support
```

#### 5. Completion Phase
```
Touchpoints: Final Project → Certificate → Job Board
├── Actions
│   ├── Submits project
│   ├── Receives certificate
│   └── Updates LinkedIn
├── Emotions
│   ├── Proud
│   ├── Confident
│   └── Grateful
└── Opportunities
    ├── Alumni network
    ├── Advanced courses
    └── Referral program
```

---

## User Stories

### 📚 Student User Stories

#### Course Discovery & Selection
```gherkin
Feature: Course Discovery
  As a prospective student
  I want to easily find relevant courses
  So that I can make informed enrollment decisions

  Scenario: Browse by Category
    Given I am on the course catalog
    When I select "Programming" category
    Then I see all programming courses
    And courses are sorted by popularity

  Scenario: Search Functionality
    Given I am on any page
    When I search for "Python"
    Then I see Python-related courses
    And relevant filters are available

  Scenario: Course Preview
    Given I am viewing a course
    When I click "Preview Course"
    Then I can watch intro video
    And see sample lessons
    And read full curriculum
```

#### Learning Experience
```gherkin
Feature: Video Learning
  As an enrolled student
  I want effective video controls
  So that I can learn at my own pace

  Scenario: Playback Control
    Given I am watching a lesson
    When I need to review content
    Then I can adjust playback speed
    And jump to specific sections
    And add bookmarks

  Scenario: Note Taking
    Given I am watching a video
    When I want to take notes
    Then I can write time-stamped notes
    And notes are saved automatically
    And I can review them later

  Scenario: Offline Access
    Given I have downloaded lessons
    When I am offline
    Then I can watch downloaded videos
    And my progress syncs when online
```

#### Progress & Achievement
```gherkin
Feature: Progress Tracking
  As a student
  I want to track my learning progress
  So that I stay motivated

  Scenario: Lesson Completion
    Given I finish watching a video
    And complete the quiz
    When I click "Mark as Complete"
    Then my progress updates
    And I unlock the next lesson

  Scenario: Achievement Badges
    Given I complete a module
    When all requirements are met
    Then I receive an achievement badge
    And can share on social media

  Scenario: Learning Streaks
    Given I study for 7 consecutive days
    When I maintain my streak
    Then I see streak counter
    And receive encouragement
```

### 👨‍🏫 Instructor User Stories

#### Content Creation
```gherkin
Feature: Course Creation
  As an instructor
  I want intuitive content tools
  So that I can create quality courses

  Scenario: Video Upload
    Given I have recorded lessons
    When I upload video files
    Then videos are processed automatically
    And I can add captions
    And set chapter markers

  Scenario: Quiz Creation
    Given I am creating assessments
    When I add quiz questions
    Then I can choose question types
    And set correct answers
    And provide explanations
```

#### Student Management
```gherkin
Feature: Student Engagement
  As an instructor
  I want to interact with students
  So that I can provide support

  Scenario: Answer Questions
    Given students ask questions
    When I receive notifications
    Then I can respond directly
    And mark helpful answers
    And create FAQ sections

  Scenario: Track Performance
    Given students complete lessons
    When I view analytics
    Then I see completion rates
    And identify struggling students
    And can offer assistance
```

### 👩‍💼 Administrator User Stories

#### Platform Management
```gherkin
Feature: User Management
  As an administrator
  I want comprehensive controls
  So that I can manage the platform

  Scenario: Role Assignment
    Given a new instructor applies
    When I review their application
    Then I can approve/reject
    And assign instructor role
    And set permissions

  Scenario: Content Moderation
    Given content is flagged
    When I review the report
    Then I can take action
    And notify involved parties
    And document decisions
```

---

## Accessibility Requirements

### WCAG 2.1 AA Compliance

#### Visual Accessibility
- **Color Contrast:** Minimum 4.5:1 for normal text
- **Font Sizes:** Minimum 16px base font
- **Focus Indicators:** Visible keyboard navigation
- **Images:** Alt text for all images
- **Videos:** Captions and transcripts

#### Motor Accessibility
- **Keyboard Navigation:** Full keyboard support
- **Click Targets:** Minimum 44x44px
- **Time Limits:** Extendable when needed
- **Gesture Alternatives:** Keyboard equivalents

#### Cognitive Accessibility
- **Clear Language:** Simple, concise instructions
- **Consistent Navigation:** Predictable UI
- **Error Messages:** Clear, actionable feedback
- **Progress Indicators:** Visual progress tracking

### Assistive Technology Support
```
Supported Technologies
├── Screen Readers
│   ├── NVDA (Windows)
│   ├── JAWS (Windows)
│   └── VoiceOver (macOS/iOS)
├── Keyboard Navigation
│   ├── Tab navigation
│   ├── Arrow key menus
│   └── Shortcut keys
└── Browser Extensions
    ├── High contrast modes
    ├── Text enlargement
    └── Reading assistants
```

---

## User Feedback Mechanisms

### Feedback Collection Methods
1. **In-App Surveys:** Post-lesson quick polls
2. **NPS Surveys:** Quarterly satisfaction
3. **User Interviews:** Monthly sessions
4. **Support Tickets:** Issue tracking
5. **Community Forums:** Open discussions

### Feedback Loop Process
```
User Input → Analysis → Prioritization → Implementation → Communication
    ↑                                                           ↓
    └───────────────────── Continuous Improvement ─────────────┘
```

### Key Metrics to Track
- **User Satisfaction Score:** Target > 4.5/5
- **Task Completion Rate:** Target > 90%
- **Time to Complete Tasks:** Baseline + improvement
- **Error Rate:** Target < 5%
- **Support Ticket Volume:** Decreasing trend

---

## Privacy & Consent Requirements

### Data Collection Principles
1. **Minimal Collection:** Only essential data
2. **Purpose Limitation:** Clear usage definition
3. **User Control:** Access, modify, delete rights
4. **Transparency:** Clear privacy policy
5. **Security:** Encrypted storage/transmission

### Consent Management
```typescript
interface ConsentOptions {
  required: {
    terms: boolean;
    privacy: boolean;
  };
  optional: {
    marketing: boolean;
    analytics: boolean;
    personalization: boolean;
  };
}
```

### LGPD Compliance (Brazilian GDPR)
- **Data Portability:** Export user data
- **Right to Deletion:** Account removal
- **Data Access:** View collected data
- **Consent Withdrawal:** Opt-out options
- **Breach Notification:** 72-hour policy

---

[Next Section: Marketing Website Specifications →](./04-marketing-website-specs.md)

---

**Document Version:** 1.0  
**Last Updated:** 2025-01-22  
**Section Owner:** UX/Product Team