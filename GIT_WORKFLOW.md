# 🔀 Git Workflow Guide

คู่มือการใช้งาน Git สำหรับโปรเจกต์นี้ (ใช้ Sourcetree)

---

## 🎯 Git Strategy

ใช้ **Feature Branch Workflow** เพื่อความเป็นระเบียบ

```
main (production)
├── develop (staging)
    ├── feature/survey-form
    ├── feature/star-rating
    ├── feature/supabase-integration
    └── bugfix/validation-error
```

---

## 📦 Initial Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd survey-satisfaction-app
```

### 2. ติดตั้ง Dependencies

```bash
npm install
```

### 3. Setup Environment

```bash
# สร้างไฟล์ .env จาก template
cp .env.example .env

# แก้ไข .env และใส่ API keys
```

---

## 🌿 Branch Strategy

### Main Branches

1. **main** - Production code (Live)
2. **develop** - Development code (Staging)

### Feature Branches

```bash
feature/feature-name    # สำหรับ Feature ใหม่
bugfix/bug-name        # สำหรับแก้ Bug
hotfix/issue-name      # สำหรับแก้ไขเร่งด่วนใน Production
```

---

## 🚀 Common Git Commands

### 1. สร้าง Feature Branch ใหม่

```bash
# Switch ไปที่ develop
git checkout develop

# Pull ข้อมูลล่าสุด
git pull origin develop

# สร้าง Branch ใหม่
git checkout -b feature/survey-validation

# ทำงานใน Branch นี้...
```

### 2. Commit Changes

```bash
# ดูไฟล์ที่เปลี่ยนแปลง
git status

# Add ไฟล์ที่ต้องการ
git add src/components/survey/

# หรือ Add ทั้งหมด
git add .

# Commit with meaningful message
git commit -m "feat: add form validation for survey fields"
```

### 3. Push to Remote

```bash
# Push Branch ใหม่ครั้งแรก
git push -u origin feature/survey-validation

# Push แบบปกติ
git push
```

### 4. Merge กลับเข้า Develop

```bash
# Switch ไปที่ develop
git checkout develop

# Merge feature branch
git merge feature/survey-validation

# Push develop
git push origin develop
```

### 5. Deploy to Production

```bash
# Switch ไปที่ main
git checkout main

# Merge develop
git merge develop

# Push main (Auto-deploy บน Render!)
git push origin main
```

---

## 📝 Commit Message Convention

ใช้ **Conventional Commits** เพื่อความเป็นมาตรฐาน

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: Feature ใหม่
- `fix`: แก้ Bug
- `docs`: แก้ไข Documentation
- `style`: แก้ไข Code style (ไม่กระทบ logic)
- `refactor`: Refactor code
- `test`: เพิ่ม Tests
- `chore`: งานอื่นๆ (build, dependencies)

### Examples

```bash
# Feature ใหม่
git commit -m "feat: add star rating component"
git commit -m "feat(survey): implement form validation"

# แก้ Bug
git commit -m "fix: resolve validation error on submit"
git commit -m "fix(api): correct supabase connection issue"

# Documentation
git commit -m "docs: update README with deployment guide"

# Refactor
git commit -m "refactor: optimize form state management"

# Style
git commit -m "style: format CSS according to guidelines"

# Chore
git commit -m "chore: update dependencies to latest versions"
```

---

## 🔀 Using Sourcetree

### 1. Clone Repository

1. เปิด Sourcetree
2. File > Clone / New
3. Paste Repository URL
4. เลือก Destination Path
5. Clone

### 2. Create New Branch

1. คลิก **Branch** บนแถบเครื่องมือ
2. ตั้งชื่อ Branch (เช่น `feature/survey-form`)
3. เลือก Checkout Branch
4. OK

### 3. Stage & Commit

1. ดูไฟล์ที่เปลี่ยนแปลงใน **File Status**
2. เลือกไฟล์ที่ต้องการ Commit
3. คลิก **Stage Selected**
4. เขียน Commit Message
5. คลิก **Commit**

### 4. Push to Remote

1. คลิก **Push** บนแถบเครื่องมือ
2. เลือก Branch ที่ต้องการ Push
3. OK

### 5. Pull Latest Changes

1. คลิก **Pull** บนแถบเครื่องมือ
2. เลือก Remote branch
3. OK

### 6. Merge Branches

1. Checkout ไปที่ Branch ปลายทาง (เช่น develop)
2. คลิกขวาที่ Branch ต้นทาง (เช่น feature/survey-form)
3. เลือก **Merge**
4. Resolve conflicts (ถ้ามี)
5. Commit merge

---

## 🚨 Common Issues & Solutions

### Issue: Merge Conflict

**สาเหตุ:** มีการแก้ไขไฟล์เดียวกันใน 2 branches

**แก้ไข:**
```bash
# 1. Pull latest changes
git pull origin develop

# 2. ดู conflicted files
git status

# 3. แก้ไขไฟล์ที่ conflict (เปิดใน VS Code)
# <<<<<<< HEAD
# Your changes
# =======
# Incoming changes
# >>>>>>> feature/branch

# 4. หลังแก้ไขเสร็จ
git add <file-name>
git commit -m "fix: resolve merge conflict"
```

### Issue: Pushed Wrong Code

**สาเหตุ:** Commit ผิดและ Push ไปแล้ว

**แก้ไข:**
```bash
# 1. Revert last commit (สร้าง commit ใหม่ที่ยกเลิก)
git revert HEAD

# 2. Push
git push origin <branch-name>
```

### Issue: Want to Undo Local Changes

**แก้ไข:**
```bash
# ยกเลิกการเปลี่ยนแปลงไฟล์เดียว
git checkout -- <file-name>

# ยกเลิกทั้งหมด (ระวัง! จะหายถาวร)
git reset --hard HEAD
```

---

## 📊 GitLab vs GitHub

### GitLab Setup

```bash
# เพิ่ม GitLab remote
git remote add gitlab https://gitlab.com/username/survey-satisfaction-app.git

# Push to GitLab
git push gitlab main
```

### GitHub Setup

```bash
# เพิ่ม GitHub remote
git remote add github https://github.com/username/survey-satisfaction-app.git

# Push to GitHub
git push github main
```

### Mirror Repository

```bash
# Push to both GitLab and GitHub
git push gitlab main
git push github main

# หรือสร้าง alias
git config alias.pushall '!git push gitlab main && git push github main'

# ใช้งาน
git pushall
```

---

## 🔐 Best Practices

### 1. Commit Often, Perfect Later

- Commit บ่อยๆ ขณะทำงาน
- ใช้ Interactive Rebase เพื่อจัดระเบียบก่อน Push

### 2. Write Meaningful Commit Messages

```bash
# ❌ Bad
git commit -m "fix"
git commit -m "update"

# ✅ Good
git commit -m "fix: resolve form validation error on empty fields"
git commit -m "feat: add loading state to submit button"
```

### 3. Never Commit Sensitive Data

```bash
# ต้อง .gitignore เสมอ
.env
.env.local
.env.production
node_modules/
dist/
```

### 4. Pull Before Push

```bash
# ก่อน Push เสมอ
git pull origin develop
git push origin develop
```

### 5. Review Before Commit

```bash
# ดูว่าจะ Commit อะไรบ้าง
git diff

# ดูว่า Staged อะไรบ้าง
git diff --cached
```

---

## 📋 Git Workflow Checklist

### Starting New Feature

- [ ] `git checkout develop`
- [ ] `git pull origin develop`
- [ ] `git checkout -b feature/feature-name`
- [ ] ทำงานใน feature...
- [ ] `git add .`
- [ ] `git commit -m "feat: description"`
- [ ] `git push -u origin feature/feature-name`

### Merging to Develop

- [ ] `git checkout develop`
- [ ] `git pull origin develop`
- [ ] `git merge feature/feature-name`
- [ ] แก้ไข Conflicts (ถ้ามี)
- [ ] `git push origin develop`
- [ ] ลบ Feature Branch: `git branch -d feature/feature-name`

### Deploying to Production

- [ ] Test ใน Develop ให้ดีก่อน
- [ ] `git checkout main`
- [ ] `git pull origin main`
- [ ] `git merge develop`
- [ ] `git push origin main`
- [ ] ตรวจสอบ Auto-deploy บน Render

---

## 🎓 Learning Resources

- [Git Documentation](https://git-scm.com/doc)
- [Sourcetree Guide](https://confluence.atlassian.com/get-started-with-sourcetree)
- [GitLab CI/CD](https://docs.gitlab.com/ee/ci/)
- [GitHub Actions](https://docs.github.com/en/actions)

---

**Happy Coding! 🚀**