# 📊 Satisfaction Survey Web Application

แบบประเมินความพึงพอใจของผู้ใช้งานต่อระบบ (Satisfaction Survey System)

---

## 🎯 Overview

เว็บแอปพลิเคชันสำหรับประเมินความพึงพอใจของผู้ใช้งานต่อระบบ พัฒนาด้วย React และ Supabase โดยแยกโครงสร้างเป็น Frontend และ Backend อย่างชัดเจน รองรับการใช้งานจริงและสามารถนำไปต่อยอดได้ในอนาคต

---

## ✨ Features

- ✅ **Responsive Design** - รองรับทุกหน้าจอ (Mobile / Tablet / Desktop)
- ⭐ **Star Rating System** - ให้คะแนน 1-5 ดาวแบบ Interactive
- 📝 **Form Validation** - ตรวจสอบความถูกต้องของข้อมูลก่อนส่ง
- 💾 **Auto-save Timestamp** - บันทึกวันที่-เวลาอัตโนมัติ
- 🔒 **Secure** - ใช้ Supabase Row Level Security (RLS)
- 🚀 **Fast Performance** - Optimized build และ code splitting

---

## 🛠️ Tech Stack

### Frontend
- **React 18.2** - UI Library
- **Vite** - Build Tool
- **React Router DOM** - Routing
- **React Icons** - Icon Library

### Backend
- **Supabase** - Database & API
- **PostgreSQL** - Database

### DevOps
- **Git** - Version Control
- **GitLab / GitHub** - Repository
- **Render** - Deployment Platform

---

## 📂 Project Structure

```
survey-satisfaction-app/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Select/
│   │   │   ├── Textarea/
│   │   │   └── StarRating/
│   │   └── survey/
│   │       ├── InstructionSection/
│   │       ├── GeneralInfoSection/
│   │       ├── DesignAspectSection/
│   │       ├── SystemQualitySection/
│   │       ├── UsabilitySection/
│   │       ├── UsefulnessSection/
│   │       └── FeedbackSection/
│   ├── pages/
│   │   ├── SurveyPage/
│   │   └── SuccessPage/
│   ├── services/
│   │   └── supabaseClient.js
│   ├── hooks/
│   │   └── useSurveyForm.js
│   ├── utils/
│   │   ├── constants.js
│   │   └── validators.js
│   ├── routes.jsx
│   ├── App.jsx
│   └── main.jsx
├── .env
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase Account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd survey-satisfaction-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment Variables**
   
   สร้างไฟล์ `.env` ในโฟลเดอร์หลัก:
   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Setup Supabase Database**
   
   รัน SQL schema ใน Supabase SQL Editor (ดูไฟล์ `database-schema.sql`)

5. **Run Development Server**
   ```bash
   npm run dev
   ```

   เปิดเบราว์เซอร์ที่ `http://localhost:3000`

---

## 📊 Database Schema

ตาราง: `survey_responses`

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary Key |
| gender | VARCHAR | เพศ (ชาย/หญิง) |
| age_range | VARCHAR | ช่วงอายุ |
| department | VARCHAR | ตำแหน่ง/ฝ่าย |
| design_* | INTEGER | คะแนนด้านการออกแบบ (1-5) |
| quality_* | INTEGER | คะแนนด้านคุณภาพ (1-5) |
| usability_* | INTEGER | คะแนนด้านการใช้งาน (1-5) |
| usefulness_* | INTEGER | คะแนนด้านประโยชน์ (1-5) |
| feedback_* | TEXT | ข้อเสนอแนะ (Optional) |
| created_at | TIMESTAMP | วันเวลาที่สร้าง |

---

## 🔧 Build for Production

```bash
npm run build
```

ไฟล์ที่ Build แล้วจะอยู่ในโฟลเดอร์ `dist/`

---

## 🚢 Deployment

### Deploy to Render

1. **Push code to GitLab/GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Create New Web Service on Render**
   - เชื่อมต่อกับ Repository
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run preview`

3. **Set Environment Variables**
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

4. **Deploy!**

---

## 📝 Usage

### แบบประเมินประกอบด้วย 7 ส่วน:

1. **คำชี้แจง** - วัตถุประสงค์ของแบบประเมิน
2. **ข้อมูลทั่วไป** - เพศ, อายุ, ตำแหน่ง/ฝ่าย
3. **ด้านการออกแบบ** - ความสวยงาม, การจัดวาง, สี, ตัวอักษร
4. **ด้านคุณภาพระบบ** - ความถูกต้อง, ความเร็ว, เสถียรภาพ
5. **ด้านการใช้งาน** - ความง่าย, การเรียนรู้, ขั้นตอน
6. **ด้านประโยชน์** - ประสิทธิภาพ, ความผิดพลาด, ความพึงพอใจ
7. **ข้อเสนอแนะ** - ความคิดเห็นเพิ่มเติม (ไม่บังคับ)

---

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is for educational purposes only.

---

## 👥 Contact

- **Developer:** Pee Aphisit
- **Email:** apisit9048@gmail.com

---

## 🙏 Acknowledgments

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Supabase](https://supabase.com/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [Render](https://render.com/)

---

**Made with ❤️ by Pee Aphisit**