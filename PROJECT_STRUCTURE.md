# 📁 Project Structure

โครงสร้างไฟล์และโฟลเดอร์ทั้งหมดของโปรเจกต์

---

## 🌳 Directory Tree

```
survey-satisfaction-app/
│
├── 📁 public/
│   ├── _redirects                    # SPA routing fix
│   └── favicon.svg                   # Favicon
│
├── 📁 scripts/
│   ├── build.sh                      # Build script
│   └── setup.sh                      # Quick setup script
│
├── 📁 src/
│   │
│   ├── 📁 assets/
│   │   ├── images/                   # รูปภาพ
│   │   └── icons/                    # ไอคอน
│   │
│   ├── 📁 components/
│   │   │
│   │   ├── 📁 common/                # Reusable components
│   │   │   ├── Button/
│   │   │   │   ├── Button.jsx
│   │   │   │   └── Button.css
│   │   │   ├── Input/
│   │   │   │   ├── Input.jsx
│   │   │   │   └── Input.css
│   │   │   ├── Select/
│   │   │   │   ├── Select.jsx
│   │   │   │   └── Select.css
│   │   │   ├── Textarea/
│   │   │   │   ├── Textarea.jsx
│   │   │   │   └── Textarea.css
│   │   │   └── StarRating/
│   │   │       ├── StarRating.jsx
│   │   │       └── StarRating.css
│   │   │
│   │   └── 📁 survey/                # Survey-specific components
│   │       ├── InstructionSection/
│   │       │   ├── InstructionSection.jsx
│   │       │   └── InstructionSection.css
│   │       ├── GeneralInfoSection/
│   │       │   ├── GeneralInfoSection.jsx
│   │       │   └── GeneralInfoSection.css
│   │       ├── DesignAspectSection/
│   │       │   ├── DesignAspectSection.jsx
│   │       │   └── DesignAspectSection.css
│   │       ├── SystemQualitySection/
│   │       │   └── SystemQualitySection.jsx
│   │       ├── UsabilitySection/
│   │       │   └── UsabilitySection.jsx
│   │       ├── UsefulnessSection/
│   │       │   └── UsefulnessSection.jsx
│   │       └── FeedbackSection/
│   │           ├── FeedbackSection.jsx
│   │           └── FeedbackSection.css
│   │
│   ├── 📁 pages/
│   │   ├── SurveyPage/
│   │   │   ├── SurveyPage.jsx        # หน้าแบบประเมินหลัก
│   │   │   └── SurveyPage.css
│   │   └── SuccessPage/
│   │       ├── SuccessPage.jsx       # หน้าขอบคุณ
│   │       └── SuccessPage.css
│   │
│   ├── 📁 services/
│   │   └── supabaseClient.js         # Supabase configuration
│   │
│   ├── 📁 hooks/
│   │   └── useSurveyForm.js          # Custom hook สำหรับ form
│   │
│   ├── 📁 utils/
│   │   ├── constants.js              # Constants & options
│   │   └── validators.js             # Validation functions
│   │
│   ├── routes.jsx                    # React Router configuration
│   ├── App.jsx                       # Main app component
│   ├── App.css                       # Global styles
│   └── main.jsx                      # Entry point
│
├── .env                              # Environment variables (gitignored)
├── .env.example                      # Environment template
├── .gitignore                        # Git ignore rules
├── index.html                        # HTML template
├── package.json                      # Dependencies & scripts
├── vite.config.js                    # Vite configuration
├── render.yaml                       # Render deployment config
│
├── 📖 README.md                      # Project documentation
├── 📖 DEPLOYMENT.md                  # Deployment guide
└── 📖 GIT_WORKFLOW.md                # Git workflow guide
```

---

## 📦 Key Files Description

### Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies, scripts, project metadata |
| `vite.config.js` | Vite build configuration |
| `.env` | Environment variables (local) |
| `.env.example` | Environment template |
| `.gitignore` | Files to ignore in git |
| `render.yaml` | Render deployment configuration |

### Entry Points

| File | Purpose |
|------|---------|
| `index.html` | HTML template with meta tags |
| `src/main.jsx` | JavaScript entry point |
| `src/App.jsx` | Main React component |
| `src/routes.jsx` | React Router configuration |

### Core Services

| File | Purpose |
|------|---------|
| `src/services/supabaseClient.js` | Supabase client & API functions |
| `src/hooks/useSurveyForm.js` | Form state management hook |
| `src/utils/constants.js` | Constants & dropdown options |
| `src/utils/validators.js` | Form validation logic |

### Common Components

| Component | Purpose |
|-----------|---------|
| `Button` | Reusable button with loading state |
| `Input` | Text input with validation |
| `Select` | Dropdown select with validation |
| `Textarea` | Multi-line text input |
| `StarRating` | 1-5 star rating component |

### Survey Sections

| Section | Purpose |
|---------|---------|
| `InstructionSection` | คำชี้แจง |
| `GeneralInfoSection` | เพศ, อายุ, ตำแหน่ง |
| `DesignAspectSection` | ด้านการออกแบบ (4 คำถาม) |
| `SystemQualitySection` | ด้านคุณภาพระบบ (4 คำถาม) |
| `UsabilitySection` | ด้านการใช้งาน (4 คำถาม) |
| `UsefulnessSection` | ด้านประโยชน์ (4 คำถาม) |
| `FeedbackSection` | ข้อเสนอแนะ (3 ช่อง, optional) |

### Pages

| Page | Purpose | Route |
|------|---------|-------|
| `SurveyPage` | หน้าแบบประเมินหลัก | `/` |
| `SuccessPage` | หน้าขอบคุณหลังส่งแบบฟอร์ม | `/success` |

---

## 📊 Component Hierarchy

```
App
└── RouterProvider
    ├── SurveyPage (/)
    │   ├── InstructionSection
    │   ├── GeneralInfoSection
    │   │   ├── Select (gender)
    │   │   ├── Select (age)
    │   │   ├── Input (age_other)
    │   │   ├── Select (department)
    │   │   └── Input (department_other)
    │   ├── DesignAspectSection
    │   │   └── StarRating × 4
    │   ├── SystemQualitySection
    │   │   └── StarRating × 4
    │   ├── UsabilitySection
    │   │   └── StarRating × 4
    │   ├── UsefulnessSection
    │   │   └── StarRating × 4
    │   ├── FeedbackSection
    │   │   └── Textarea × 3
    │   └── Button (submit)
    │
    └── SuccessPage (/success)
        └── Button (back to home)
```

---

## 🔄 Data Flow

```
User Input
    ↓
useSurveyForm Hook (State Management)
    ↓
validators.js (Validation)
    ↓
supabaseClient.js (API Call)
    ↓
Supabase Database
    ↓
Success/Error Response
    ↓
Navigate to SuccessPage
```

---

## 📝 Code Style Guidelines

### File Naming

- **Components:** PascalCase (e.g., `StarRating.jsx`)
- **Utilities:** camelCase (e.g., `validators.js`)
- **Pages:** PascalCase (e.g., `SurveyPage.jsx`)
- **Styles:** Same as component (e.g., `StarRating.css`)

### Component Structure

```jsx
// 1. Imports
import React from 'react';
import './Component.css';

// 2. Component
export default function Component({ props }) {
  // 3. State & Hooks
  const [state, setState] = useState();

  // 4. Functions
  const handleClick = () => {};

  // 5. Render
  return (
    <div className="component">
      {/* JSX */}
    </div>
  );
}
```

### CSS Structure

```css
/* 1. Component styles */
.component {
  /* layout */
  /* typography */
  /* colors */
  /* effects */
}

/* 2. Element styles */
.component__element {
}

/* 3. Modifier styles */
.component--modifier {
}

/* 4. Responsive */
@media (max-width: 768px) {
}
```

---

## 🚀 Build Output

After running `npm run build`, the output structure:

```
dist/
├── assets/
│   ├── index-[hash].js      # Main JS bundle
│   ├── index-[hash].css     # Main CSS bundle
│   └── vendor-[hash].js     # Vendor JS bundle
├── _redirects               # SPA routing fix
├── favicon.svg
└── index.html               # Entry HTML
```

---

## 📈 File Size Targets

| Category | Target | Actual |
|----------|--------|--------|
| Main JS | < 200 KB | ~150 KB |
| Vendor JS | < 300 KB | ~250 KB |
| Main CSS | < 50 KB | ~30 KB |
| Total | < 550 KB | ~430 KB |

---

## 🔍 Dependencies Overview

### Production Dependencies

```json
{
  "@supabase/supabase-js": "^2.39.0",  // Database client
  "react": "^18.2.0",                  // UI library
  "react-dom": "^18.2.0",              // React DOM
  "react-icons": "^4.12.0",            // Icons
  "react-router-dom": "^6.21.0"        // Routing
}
```

### Development Dependencies

```json
{
  "@vitejs/plugin-react": "^4.2.1",    // Vite React plugin
  "vite": "^5.0.8"                     // Build tool
}
```

---

## 📊 Performance Metrics

### Target Metrics

- **First Contentful Paint (FCP):** < 1.5s
- **Time to Interactive (TTI):** < 3s
- **Total Bundle Size:** < 500 KB
- **Lighthouse Score:** > 90

---

**Last Updated:** 2026-01-11