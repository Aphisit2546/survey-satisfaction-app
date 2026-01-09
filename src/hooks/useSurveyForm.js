// ============================================
// Custom Hook: useSurveyForm
// ============================================
// จัดการ State และ Logic ของแบบฟอร์มประเมิน
// ============================================

import { useState } from 'react';
import { validateSurveyForm, prepareDataForSubmission } from '../utils/validators';
import { submitSurveyResponse } from '../services/supabaseClient';

export function useSurveyForm() {
  // ============================================
  // Initial State
  // ============================================
  const initialFormData = {
    // ข้อมูลทั่วไป
    gender: '',
    age_range: '',
    age_other: '',
    department: '',
    department_other: '',

    // ด้านการออกแบบ
    design_beauty_modern: 0,
    design_layout_appropriate: 0,
    design_color_readable: 0,
    design_overall_convenient: 0,

    // ด้านคุณภาพระบบ
    quality_correct: 0,
    quality_fast: 0,
    quality_stable: 0,
    quality_continuous: 0,

    // ด้านการใช้งาน
    usability_easy: 0,
    usability_learn_fast: 0,
    usability_clear_steps: 0,
    usability_reduce_time: 0,

    // ด้านประโยชน์
    usefulness_increase_efficiency: 0,
    usefulness_reduce_error: 0,
    usefulness_meet_needs: 0,
    usefulness_satisfaction: 0,

    // ข้อเสนอแนะ
    feedback_like_most: '',
    feedback_improvement: '',
    feedback_other_comments: '',
  };

  // ============================================
  // States
  // ============================================
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // ============================================
  // Handle Input Change
  // ============================================
  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // ลบ error ของ field นั้นๆ เมื่อมีการแก้ไข
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // ============================================
  // Handle Rating Change
  // ============================================
  const handleRatingChange = (name, rating) => {
    handleChange(name, rating);
  };

  // ============================================
  // Handle Submit
  // ============================================
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    // รีเซ็ต error และ success states
    setErrors({});
    setSubmitSuccess(false);
    setSubmitError(null);

    // Validate Form
    const validation = validateSurveyForm(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      
      // Scroll ไปยัง error แรก
      const firstErrorField = Object.keys(validation.errors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      return false;
    }

    // เตรียมข้อมูลสำหรับส่ง
    const preparedData = prepareDataForSubmission(formData);

    // Submit to Supabase
    setIsSubmitting(true);

    try {
      const result = await submitSurveyResponse(preparedData);

      if (result.success) {
        setSubmitSuccess(true);
        // รีเซ็ตฟอร์ม
        setFormData(initialFormData);
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        return true;
      } else {
        setSubmitError(result.error || 'เกิดข้อผิดพลาดในการส่งแบบประเมิน');
        return false;
      }
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitError('เกิดข้อผิดพลาดในการส่งแบบประเมิน กรุณาลองใหม่อีกครั้ง');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================
  // Reset Form
  // ============================================
  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
    setSubmitSuccess(false);
    setSubmitError(null);
  };

  // ============================================
  // Return Hook Values
  // ============================================
  return {
    formData,
    errors,
    isSubmitting,
    submitSuccess,
    submitError,
    handleChange,
    handleRatingChange,
    handleSubmit,
    resetForm,
    setErrors, // Exposed for step validation
  };
}