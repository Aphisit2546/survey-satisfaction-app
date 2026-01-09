// ============================================
// Form Validation Functions
// ============================================

import {
  DESIGN_QUESTIONS,
  QUALITY_QUESTIONS,
  USABILITY_QUESTIONS,
  USEFULNESS_QUESTIONS,
} from './constants';

/**
 * ตรวจสอบว่าฟอร์มทั้งหมดถูกต้องหรือไม่
 * @param {Object} formData - ข้อมูลฟอร์มทั้งหมด
 * @returns {Object} - { isValid: boolean, errors: Object }
 */
export function validateSurveyForm(formData) {
  const errors = {};

  // ============================================
  // ตรวจสอบข้อมูลทั่วไป
  // ============================================
  if (!formData.gender) {
    errors.gender = 'กรุณาเลือกเพศ';
  }

  if (!formData.age_range) {
    errors.age_range = 'กรุณาเลือกช่วงอายุ';
  }

  // ถ้าเลือก "อื่นๆ" ต้องระบุอายุ
  if (formData.age_range === 'อื่นๆ' && !formData.age_other?.trim()) {
    errors.age_other = 'กรุณาระบุอายุของคุณ';
  }

  if (!formData.department) {
    errors.department = 'กรุณาเลือกตำแหน่ง/ฝ่าย';
  }

  // ถ้าเลือก "อื่นๆ" ต้องระบุฝ่าย
  if (formData.department === 'อื่นๆ' && !formData.department_other?.trim()) {
    errors.department_other = 'กรุณาระบุตำแหน่ง/ฝ่ายของคุณ';
  }

  // ============================================
  // ตรวจสอบคะแนนด้านการออกแบบ
  // ============================================
  DESIGN_QUESTIONS.forEach((q) => {
    if (!formData[q.id] || formData[q.id] < 1 || formData[q.id] > 5) {
      errors[q.id] = 'กรุณาเลือกคะแนน 1-5 ดาว';
    }
  });

  // ============================================
  // ตรวจสอบคะแนนด้านคุณภาพระบบ
  // ============================================
  QUALITY_QUESTIONS.forEach((q) => {
    if (!formData[q.id] || formData[q.id] < 1 || formData[q.id] > 5) {
      errors[q.id] = 'กรุณาเลือกคะแนน 1-5 ดาว';
    }
  });

  // ============================================
  // ตรวจสอบคะแนนด้านการใช้งาน
  // ============================================
  USABILITY_QUESTIONS.forEach((q) => {
    if (!formData[q.id] || formData[q.id] < 1 || formData[q.id] > 5) {
      errors[q.id] = 'กรุณาเลือกคะแนน 1-5 ดาว';
    }
  });

  // ============================================
  // ตรวจสอบคะแนนด้านประโยชน์
  // ============================================
  USEFULNESS_QUESTIONS.forEach((q) => {
    if (!formData[q.id] || formData[q.id] < 1 || formData[q.id] > 5) {
      errors[q.id] = 'กรุณาเลือกคะแนน 1-5 ดาว';
    }
  });

  // ============================================
  // Feedback ไม่บังคับ ไม่ต้อง validate
  // ============================================

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * ตรวจสอบว่าค่าว่างหรือไม่
 * @param {any} value - ค่าที่ต้องการตรวจสอบ
 * @returns {boolean}
 */
export function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * ตรวจสอบว่าคะแนนอยู่ในช่วง 1-5 หรือไม่
 * @param {number} rating - คะแนน
 * @returns {boolean}
 */
export function isValidRating(rating) {
  return rating >= 1 && rating <= 5;
}

/**
 * แปลง Form Data ให้เป็นรูปแบบที่พร้อมส่งไปยัง Supabase
 * @param {Object} formData - ข้อมูลฟอร์ม
 * @returns {Object} - ข้อมูลที่พร้อมส่ง
 */
export function prepareDataForSubmission(formData) {
  const prepared = { ...formData };

  // ถ้าไม่ได้เลือก "อื่นๆ" ให้ลบ field _other ออก
  if (formData.age_range !== 'อื่นๆ') {
    prepared.age_other = null;
  }

  if (formData.department !== 'อื่นๆ') {
    prepared.department_other = null;
  }

  // แปลง empty string เป็น null สำหรับ Feedback (เพื่อให้ Database เก็บเป็น NULL)
  if (!formData.feedback_like_most?.trim()) {
    prepared.feedback_like_most = null;
  }
  if (!formData.feedback_improvement?.trim()) {
    prepared.feedback_improvement = null;
  }
  if (!formData.feedback_other_comments?.trim()) {
    prepared.feedback_other_comments = null;
  }

  return prepared;
}