// ============================================
// Constants for Survey Application
// ============================================

// ============================================
// ข้อมูลทั่วไป (General Information)
// ============================================

export const GENDER_OPTIONS = [
  { value: 'ชาย', label: 'ชาย' },
  { value: 'หญิง', label: 'หญิง' },
];

export const AGE_RANGE_OPTIONS = [
  { value: '18–25', label: '18–25 ปี' },
  { value: '26–30', label: '26–30 ปี' },
  { value: '31–35', label: '31–35 ปี' },
  { value: '36–40', label: '36–40 ปี' },
  { value: '41–45', label: '41–45 ปี' },
  { value: 'มากกว่า 45', label: 'มากกว่า 45 ปี' },
  { value: 'อื่นๆ', label: 'อื่นๆ (โปรดระบุ)' },
];

export const DEPARTMENT_OPTIONS = [
  { value: 'Administration Department', label: 'Administration Department' },
  { value: 'Account & Finance Department', label: 'Account & Finance Department' },
  { value: 'Human Resource Department', label: 'Human Resource Department' },
  { value: 'Sales & Marketing Department', label: 'Sales & Marketing Department' },
  { value: 'Software Development Department', label: 'Software Development Department' },
  { value: 'Research & Development (R&D) Department', label: 'Research & Development (R&D) Department' },
  { value: 'Project Department', label: 'Project Department' },
  { value: 'อื่นๆ', label: 'อื่นๆ (โปรดระบุ)' },
];

// ============================================
// คำถามแบบประเมิน (Survey Questions)
// ============================================

export const DESIGN_QUESTIONS = [
  {
    id: 'design_beauty_modern',
    label: 'รูปแบบหน้าจอของระบบมีความสวยงามและทันสมัย',
  },
  {
    id: 'design_layout_appropriate',
    label: 'การจัดวางองค์ประกอบบนหน้าจอมีความเหมาะสม',
  },
  {
    id: 'design_color_readable',
    label: 'สีและตัวอักษรอ่านง่าย',
  },
  {
    id: 'design_overall_convenient',
    label: 'การออกแบบโดยรวมช่วยให้ใช้งานสะดวก',
  },
];

export const QUALITY_QUESTIONS = [
  {
    id: 'quality_correct',
    label: 'ระบบทำงานได้ถูกต้อง',
  },
  {
    id: 'quality_fast',
    label: 'ระบบประมวลผลรวดเร็ว',
  },
  {
    id: 'quality_stable',
    label: 'ระบบมีความเสถียร',
  },
  {
    id: 'quality_continuous',
    label: 'ระบบสามารถใช้งานได้อย่างต่อเนื่อง',
  },
];

export const USABILITY_QUESTIONS = [
  {
    id: 'usability_easy',
    label: 'ระบบใช้งานง่าย',
  },
  {
    id: 'usability_learn_fast',
    label: 'เรียนรู้การใช้งานได้รวดเร็ว',
  },
  {
    id: 'usability_clear_steps',
    label: 'ขั้นตอนชัดเจน',
  },
  {
    id: 'usability_reduce_time',
    label: 'ลดขั้นตอนและเวลาในการทำงาน',
  },
];

export const USEFULNESS_QUESTIONS = [
  {
    id: 'usefulness_increase_efficiency',
    label: 'เพิ่มประสิทธิภาพการทำงาน',
  },
  {
    id: 'usefulness_reduce_error',
    label: 'ลดความผิดพลาด',
  },
  {
    id: 'usefulness_meet_needs',
    label: 'ตอบสนองความต้องการผู้ใช้',
  },
  {
    id: 'usefulness_satisfaction',
    label: 'พึงพอใจในการนำไปใช้งานจริง',
  },
];

// ============================================
// คำถาม Feedback
// ============================================

export const FEEDBACK_QUESTIONS = [
  {
    id: 'feedback_like_most',
    label: 'สิ่งที่ชอบมากที่สุดในระบบ',
    placeholder: 'เช่น ใช้งานง่าย, สวยงาม, รวดเร็ว...',
  },
  {
    id: 'feedback_improvement',
    label: 'สิ่งที่ต้องการให้พัฒนาเพิ่มเติมหรือแก้ไข',
    placeholder: 'เช่น เพิ่ม Dark Mode, ปรับปรุง UX...',
  },
  {
    id: 'feedback_other_comments',
    label: 'ข้อคิดเห็นอื่น ๆ',
    placeholder: 'ความคิดเห็นเพิ่มเติมของคุณ...',
  },
];

// ============================================
// Form Validation Messages
// ============================================

export const VALIDATION_MESSAGES = {
  REQUIRED_FIELD: 'กรุณากรอกข้อมูลในช่องนี้',
  REQUIRED_RATING: 'กรุณาเลือกคะแนนสำหรับคำถามนี้',
  REQUIRED_SELECT: 'กรุณาเลือกตัวเลือก',
};

// ============================================
// Success Messages
// ============================================

export const SUCCESS_MESSAGES = {
  SUBMIT_SUCCESS: 'ส่งแบบประเมินสำเร็จ! ขอบคุณสำหรับความคิดเห็นของคุณ',
  SUBMIT_ERROR: 'เกิดข้อผิดพลาดในการส่งแบบประเมิน กรุณาลองใหม่อีกครั้ง',
};