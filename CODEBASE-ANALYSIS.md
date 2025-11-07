# 📚 Jia Application - Codebase Analysis

**Sprint Round - Understanding the Project**  
**Date:** November 7, 2025

---

## 🏗️ Project Architecture

### Technology Stack
- **Framework:** Next.js 15.3.2 (App Router)
- **Language:** TypeScript
- **Styling:** SASS Modules
- **Database:** MongoDB
- **Authentication:** Firebase Auth
- **AI:** OpenAI GPT

### Key Directories

```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes (70+ endpoints)
│   │   ├── add-career/          # ⭐ Ticket #3 target
│   │   ├── update-career/       # Related endpoint
│   │   └── ...
│   ├── recruiter-dashboard/     # ⭐ Tickets #2 & #4 target
│   │   ├── careers/
│   │   │   ├── new-career/     # Career form page
│   │   │   └── manage/[slug]/  # Edit career page
│   │   └── ...
│   ├── applicant/               # Applicant portal
│   ├── job-portal/              # Public job listings
│   └── ...
└── lib/                         # Shared utilities
    ├── components/              # Reusable UI components
    ├── mongoDB/                 # Database utilities
    ├── firebase/                # Auth utilities
    └── ...
```

---

## 🎯 Ticket #3: XSS Security Analysis

### Target Endpoint
**File:** `src/app/api/add-career/route.ts`

### Current Implementation

**What it does:**
- Accepts career post data via POST request
- Validates required fields (basic validation only)
- Stores data in MongoDB `careers` collection
- Returns success/error response

**Input Fields (Potential XSS Vectors):**
1. ✅ `jobTitle` - User input (text)
2. ✅ `description` - User input (rich text/HTML)
3. ✅ `questions` - Array of question objects
4. ✅ `location` - User input (text)
5. ✅ `workSetupRemarks` - User input (text)
6. ⚠️ `screeningSetting` - Object (may contain user input)

**Current Security:**
- ❌ No XSS sanitization
- ❌ No HTML validation
- ❌ No script injection prevention
- ✅ Basic required field validation only

**Vulnerabilities:**
```typescript
// Current code accepts ANY input:
const { jobTitle, description, questions, ... } = await request.json();

// Dangerous examples that would work:
jobTitle: "<script>alert('XSS')</script>"
description: "<img src=x onerror=alert('XSS')>"
```

---

## 🎯 Ticket #2: Segmented Form Analysis

### Target Page
**File:** `src/app/recruiter-dashboard/careers/new-career/page.tsx`

### Current Implementation
- Single-page career form
- All fields on one page
- No progress saving
- No multi-step navigation

### What Needs to Change
1. Convert to multi-step form (3-5 steps)
2. Add progress saving to database
3. Add step navigation (Next, Back, Save)
4. Resume from last step on return
5. Match Figma design (when received)

**Potential Steps:**
- Step 1: Basic Info (title, description, location)
- Step 2: Requirements (questions, screening)
- Step 3: Compensation (salary, benefits)
- Step 4: Settings (status, video requirement)
- Step 5: Review & Publish

---

## 🎯 Ticket #4: Pre-screening Questions Analysis

### Target Areas
1. **Recruiter Side:** Add/edit questions in career form
2. **Applicant Side:** Answer questions when applying
3. **Database:** Store questions and answers

### Current Implementation
- `questions` field exists in career schema
- Basic question array structure
- No pre-screening specific logic

### What Needs to Add
1. **Question Management UI** (Recruiter)
   - Add question button
   - Edit question inline
   - Delete question
   - Reorder questions (drag-drop)
   - Question types (text, multiple choice, etc.)

2. **Question Display UI** (Applicant)
   - Show questions on application page
   - Validate all questions answered
   - Save answers to database

3. **Database Schema**
   - Questions: linked to career post
   - Answers: linked to application

---

## 📊 Database Collections

### `careers` Collection
```typescript
{
  id: string,
  jobTitle: string,
  description: string,
  questions: array,           // ⭐ Ticket #4 target
  location: string,
  workSetup: string,
  status: string,
  orgID: string,
  createdAt: Date,
  updatedAt: Date,
  // ... more fields
}
```

### `organizations` Collection
- Stores company/recruiter data
- Has job posting limits
- Linked to careers via `orgID`

---

## 🔧 Key Utilities

### MongoDB Connection
**File:** `src/lib/mongoDB/mongoDB.ts`
- Handles database connection
- Exports `connectMongoDB()` function

### Utils
**File:** `src/lib/Utils.tsx`
- `guid()` - Generate unique IDs
- Other utility functions

---

## 🎯 Implementation Strategy

### Ticket #3 (XSS Security) - NEXT
**Estimated Time:** 1-2 hours

**Steps:**
1. Install sanitization library (`dompurify`, `validator`)
2. Create sanitization utility function
3. Add input validation to `add-career` endpoint
4. Add validation to `update-career` endpoint
5. Test with XSS payloads
6. Add unit tests (for L6)
7. Document security measures

**Files to Modify:**
- `src/app/api/add-career/route.ts`
- `src/app/api/update-career/route.ts` (if exists)
- Create: `src/lib/security/sanitize.ts`
- Create: `src/lib/security/sanitize.test.ts` (for L6)

---

### Ticket #2 (Segmented Form) - AFTER FIGMA
**Estimated Time:** 3-4 hours

**Steps:**
1. Review Figma designs
2. Create multi-step form component
3. Add progress saving logic
4. Implement step navigation
5. Add form validation per step
6. Test edge cases
7. Match Figma pixel-perfect

**Files to Modify:**
- `src/app/recruiter-dashboard/careers/new-career/page.tsx`
- Create: `src/lib/components/SegmentedCareerForm/`
- Create: Progress saving API endpoint

---

### Ticket #4 (Pre-screening) - LAST
**Estimated Time:** 5-6 hours

**Steps:**
1. Review Figma designs
2. Create question management UI
3. Update career form to include questions
4. Create applicant question display
5. Add answer validation
6. Store answers in database
7. Display answers to recruiter

**Files to Modify:**
- Career form (from Ticket #2)
- Applicant application page
- Database schema
- Create: Question components

---

## ✅ Ready for Ticket #3!

**Next Steps:**
1. Install sanitization libraries
2. Create security utilities
3. Implement XSS protection
4. Add tests
5. Commit and push

---

*Last Updated: November 7, 2025*
