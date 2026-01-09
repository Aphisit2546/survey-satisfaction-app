// ============================================
// Supabase Client Configuration
// ============================================
// ไฟล์นี้ใช้สำหรับเชื่อมต่อกับ Supabase Database
// ============================================

import { createClient } from '@supabase/supabase-js';

// ดึงค่าจาก Environment Variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ตรวจสอบว่ามีการตั้งค่า Environment Variables หรือไม่
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!');
  console.error('Please check your .env file and ensure:');
  console.error('- VITE_SUPABASE_URL is set');
  console.error('- VITE_SUPABASE_ANON_KEY is set');
}

// สร้าง Supabase Client Instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // ไม่ต้องการ Session (เพราะเป็นแบบสอบถามสาธารณะ)
  },
});

// ============================================
// Helper Functions for Survey
// ============================================

/**
 * บันทึกข้อมูลแบบประเมินลงฐานข้อมูล
 * @param {Object} surveyData - ข้อมูลแบบประเมินทั้งหมด
 * @returns {Promise<Object>} - ผลลัพธ์การบันทึก
 */
export async function submitSurveyResponse(surveyData) {
  try {
    const { data, error } = await supabase
      .from('survey_responses')
      .insert([surveyData])
      .select();

    if (error) {
      console.error('❌ Error submitting survey:', error);
      throw error;
    }

    console.log('✅ Survey submitted successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Exception in submitSurveyResponse:', error);
    return { success: false, error: error.message };
  }
}

/**
 * ดึงข้อมูลแบบประเมินทั้งหมด (สำหรับ Admin)
 * @param {number} limit - จำนวนข้อมูลที่ต้องการดึง
 * @returns {Promise<Object>} - ข้อมูลแบบประเมิน
 */
export async function getAllSurveyResponses(limit = 100) {
  try {
    const { data, error } = await supabase
      .from('survey_responses')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('❌ Error fetching surveys:', error);
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('❌ Exception in getAllSurveyResponses:', error);
    return { success: false, error: error.message };
  }
}

/**
 * นับจำนวนแบบประเมินทั้งหมด
 * @returns {Promise<number>} - จำนวนแบบประเมิน
 */
export async function getSurveyCount() {
  try {
    const { count, error } = await supabase
      .from('survey_responses')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('❌ Error counting surveys:', error);
      throw error;
    }

    return count;
  } catch (error) {
    console.error('❌ Exception in getSurveyCount:', error);
    return 0;
  }
}

/**
 * คำนวณค่าเฉลี่ยของแต่ละด้าน (สำหรับ Analytics)
 * @returns {Promise<Object>} - ค่าเฉลี่ยของแต่ละด้าน
 */
export async function getAverageScores() {
  try {
    const { data, error } = await supabase
      .from('survey_responses')
      .select('*');

    if (error) throw error;

    if (!data || data.length === 0) {
      return { success: false, message: 'No data available' };
    }

    // คำนวณค่าเฉลี่ย
    const averages = {
      design: {
        beauty_modern: calculateAverage(data, 'design_beauty_modern'),
        layout_appropriate: calculateAverage(data, 'design_layout_appropriate'),
        color_readable: calculateAverage(data, 'design_color_readable'),
        overall_convenient: calculateAverage(data, 'design_overall_convenient'),
      },
      quality: {
        correct: calculateAverage(data, 'quality_correct'),
        fast: calculateAverage(data, 'quality_fast'),
        stable: calculateAverage(data, 'quality_stable'),
        continuous: calculateAverage(data, 'quality_continuous'),
      },
      usability: {
        easy: calculateAverage(data, 'usability_easy'),
        learn_fast: calculateAverage(data, 'usability_learn_fast'),
        clear_steps: calculateAverage(data, 'usability_clear_steps'),
        reduce_time: calculateAverage(data, 'usability_reduce_time'),
      },
      usefulness: {
        increase_efficiency: calculateAverage(data, 'usefulness_increase_efficiency'),
        reduce_error: calculateAverage(data, 'usefulness_reduce_error'),
        meet_needs: calculateAverage(data, 'usefulness_meet_needs'),
        satisfaction: calculateAverage(data, 'usefulness_satisfaction'),
      },
    };

    return { success: true, data: averages, totalResponses: data.length };
  } catch (error) {
    console.error('❌ Exception in getAverageScores:', error);
    return { success: false, error: error.message };
  }
}

// Helper function สำหรับคำนวณค่าเฉลี่ย
function calculateAverage(data, field) {
  const sum = data.reduce((acc, curr) => acc + (curr[field] || 0), 0);
  return (sum / data.length).toFixed(2);
}

/**
 * ดึงข้อมูลแบบประเมินทั้งหมดเพื่อนำมาคำนวณสถิติ
 * @returns {Promise<Object>} - ข้อมูลแบบประเมินทั้งหมด
 */
export async function fetchAllResponses() {
  try {
    const { data, error } = await supabase
      .from('survey_responses')
      .select('*');

    if (error) {
      console.error('❌ Error fetching all responses:', error);
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('❌ Exception in fetchAllResponses:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// Export Default
// ============================================
export default supabase;