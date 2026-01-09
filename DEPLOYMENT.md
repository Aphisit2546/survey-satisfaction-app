# 🚀 Deployment Guide - Render

คู่มือการ Deploy แบบประเมินความพึงพอใจบน Render.com

---

## 📋 Prerequisites (สิ่งที่ต้องเตรียม)

- ✅ บัญชี [Render.com](https://render.com) (ฟรี)
- ✅ บัญชี [Supabase](https://supabase.com) (ฟรี)
- ✅ Repository บน GitLab หรือ GitHub
- ✅ โค้ดพร้อม Deploy

---

## 🗄️ Part 1: Setup Supabase Database

### 1.1 สร้างโปรเจกต์ Supabase

1. ไปที่ [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. คลิก **"New Project"**
3. กรอกข้อมูล:
   - **Project Name:** `survey-satisfaction`
   - **Database Password:** สร้างรหัสผ่านที่แข็งแรง
   - **Region:** เลือก `Southeast Asia (Singapore)` (ใกล้ไทยที่สุด)
4. คลิก **"Create New Project"**
5. รอประมาณ 2-3 นาที

### 1.2 สร้าง Database Schema

1. ไปที่ **SQL Editor** (เมนูด้านซ้าย)
2. คลิก **"New Query"**
3. Copy SQL Schema จากไฟล์ที่สร้างไว้แล้ว (ดูใน Artifact: `supabase_schema`)
4. Paste และคลิก **"Run"**
5. ตรวจสอบว่าตาราง `survey_responses` ถูกสร้างแล้ว

### 1.3 ดึง API Keys

1. ไปที่ **Settings** > **API**
2. Copy ข้อมูลเหล่านี้:
   - **Project URL** → จะใช้เป็น `VITE_SUPABASE_URL`
   - **anon public** → จะใช้เป็น `VITE_SUPABASE_ANON_KEY`
3. เก็บไว้ใช้ในขั้นตอนถัดไป

---

## 🔧 Part 2: Prepare Code for Deployment

### 2.1 ตรวจสอบไฟล์สำคัญ

ตรวจสอบว่ามีไฟล์เหล่านี้:

```
✅ render.yaml           # Render configuration
✅ public/_redirects     # SPA routing fix
✅ .env.example          # Environment template
✅ package.json          # Dependencies
✅ vite.config.js        # Vite configuration
```

### 2.2 Test Local Build

```bash
# ติดตั้ง dependencies
npm install

# Build โปรเจกต์
npm run build

# Test production build
npm run preview
```

หากไม่มีข้อผิดพลาด แสดงว่าพร้อม Deploy แล้ว!

### 2.3 Push to GitLab/GitHub

```bash
# Initialize Git (ถ้ายังไม่ได้ทำ)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for deployment"

# Add remote repository
git remote add origin <your-repository-url>

# Push to main branch
git push -u origin main
```

---

## 🚀 Part 3: Deploy to Render

### 3.1 Create New Web Service

1. ไปที่ [https://dashboard.render.com](https://dashboard.render.com)
2. คลิก **"New +"** → **"Web Service"**
3. เชื่อมต่อกับ GitLab/GitHub
   - คลิก **"Connect Account"**
   - Authorize Render
4. เลือก Repository `survey-satisfaction-app`
5. คลิก **"Connect"**

### 3.2 Configure Web Service

กรอกข้อมูลดังนี้:

| Field | Value |
|-------|-------|
| **Name** | `survey-satisfaction-app` |
| **Region** | Singapore (Southeast Asia) |
| **Branch** | `main` |
| **Root Directory** | (เว้นว่าง) |
| **Environment** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm run preview` |
| **Plan** | `Free` |

### 3.3 Add Environment Variables

Scroll ลงไปหา **Environment Variables**:

1. คลิก **"Add Environment Variable"**
2. เพิ่มตัวแปรเหล่านี้:

```
Key: NODE_ENV
Value: production

Key: VITE_SUPABASE_URL
Value: <paste-your-supabase-url>

Key: VITE_SUPABASE_ANON_KEY
Value: <paste-your-anon-key>
```

### 3.4 Deploy!

1. คลิก **"Create Web Service"**
2. Render จะเริ่ม Build และ Deploy อัตโนมัติ
3. รอประมาณ 2-5 นาที
4. เมื่อเสร็จจะแสดงสถานะ **"Live"** สีเขียว

### 3.5 Get Your URL

URL จะอยู่ในรูปแบบ:
```
https://survey-satisfaction-app.onrender.com
```

---

## ✅ Part 4: Verify Deployment

### 4.1 ทดสอบเว็บไซต์

1. เปิด URL ที่ได้จาก Render
2. ตรวจสอบว่า:
   - ✅ หน้าเว็บโหลดได้
   - ✅ แบบฟอร์มแสดงครบถ้วน
   - ✅ Star Rating ใช้งานได้
   - ✅ กรอกข้อมูลและส่งได้

### 4.2 ตรวจสอบข้อมูลใน Supabase

1. กลับไปที่ Supabase Dashboard
2. ไปที่ **Table Editor** > `survey_responses`
3. ตรวจสอบว่ามีข้อมูลที่เพิ่งส่งมา

---

## 🔄 Part 5: Auto-Deploy Setup

Render รองรับ Auto-Deploy อยู่แล้ว!

เมื่อคุณ Push code ใหม่:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Render จะ **Deploy อัตโนมัติ** ทันที! 🎉

---

## 🐛 Troubleshooting (แก้ปัญหา)

### ❌ Build Failed

**สาเหตุ:** Dependencies ไม่ครบ

**แก้ไข:**
```bash
# ตรวจสอบ package.json
npm install
npm run build

# ถ้า Build ผ่าน ให้ Push ใหม่
git push origin main
```

### ❌ 404 Error เมื่อ Refresh

**สาเหตุ:** ไม่มีไฟล์ `_redirects`

**แก้ไข:**
1. สร้างไฟล์ `public/_redirects`
2. เพิ่มบรรทัด: `/*  /index.html  200`
3. Push ใหม่

### ❌ Database Connection Failed

**สาเหตุ:** Environment Variables ไม่ถูกต้อง

**แก้ไข:**
1. ไปที่ Render Dashboard > Environment
2. ตรวจสอบว่า `VITE_SUPABASE_URL` และ `VITE_SUPABASE_ANON_KEY` ถูกต้อง
3. คลิก **"Save Changes"**
4. Render จะ Re-deploy อัตโนมัติ

### ❌ Slow Loading

**สาเหตุ:** Free plan มี cold start

**แก้ไข:**
- อัปเกรดเป็น Starter Plan ($7/month)
- หรือใช้ Render Cron Jobs เพื่อ Ping ทุก 15 นาที

---

## 📊 Part 6: Monitoring & Analytics

### 6.1 View Logs

ใน Render Dashboard:
- ไปที่ **Logs** tab
- ดู Real-time logs
- ตรวจสอบ Errors

### 6.2 Supabase Analytics

ใน Supabase Dashboard:
- ไปที่ **Database** > **Reports**
- ดูจำนวน Requests
- ดูประสิทธิภาพของ Queries

---

## 🎨 Part 7: Custom Domain (Optional)

### 7.1 Add Custom Domain

1. ไปที่ Render Dashboard > **Settings**
2. Scroll ไปที่ **Custom Domains**
3. คลิก **"Add Custom Domain"**
4. กรอก Domain ของคุณ (เช่น `survey.yourdomain.com`)
5. ตั้งค่า DNS Records ตามที่ Render แนะนำ

### 7.2 Enable HTTPS

Render จะสร้าง SSL Certificate อัตโนมัติ (ฟรี!)

---

## 💰 Cost Estimation

### Free Plan (Render + Supabase)
- ✅ 750 ชั่วโมง/เดือน (พอใช้งานทั่วไป)
- ✅ 500 MB RAM
- ✅ Auto sleep หลัง 15 นาที ไม่มีการใช้งาน
- ✅ Database: 500 MB storage
- ⚠️ Cold start: 30 วินาที - 1 นาที

### Starter Plan ($7/month)
- ✅ ไม่มี Cold start
- ✅ 512 MB RAM
- ✅ เหมาะสำหรับ Production

---

## 📞 Support

หากมีปัญหา:

1. **Render Support:** [https://render.com/docs](https://render.com/docs)
2. **Supabase Docs:** [https://supabase.com/docs](https://supabase.com/docs)
3. **Community:** [Render Community](https://community.render.com)

---

## ✅ Deployment Checklist

- [ ] Supabase Database สร้างแล้ว
- [ ] SQL Schema รันแล้ว
- [ ] API Keys เตรียมไว้แล้ว
- [ ] Code Push ไปที่ GitLab/GitHub แล้ว
- [ ] Render Web Service สร้างแล้ว
- [ ] Environment Variables ตั้งค่าแล้ว
- [ ] Deploy สำเร็จ (สถานะ Live)
- [ ] ทดสอบเว็บไซต์แล้ว
- [ ] ส่งแบบประเมินทดสอบได้
- [ ] ข้อมูลบันทึกใน Supabase แล้ว

---

🎉 **ยินดีด้วย! แอปพลิเคชันของคุณ Live แล้ว!**

---

**Made with ❤️ for Educational Purposes**