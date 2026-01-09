// ============================================
// SurveyPage Component - หน้าแบบประเมินหลัก
// ============================================
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSurveyForm } from '../../hooks/useSurveyForm';
import ProgressBar from '../../components/common/ProgressBar/ProgressBar';
import InstructionSection from '../../components/survey/InstructionSection/InstructionSection';
import GeneralInfoSection from '../../components/survey/GeneralInfoSection/GeneralInfoSection';
import DesignAspectSection from '../../components/survey/DesignAspectSection/DesignAspectSection';
import SystemQualitySection from '../../components/survey/SystemQualitySection/SystemQualitySection';
import UsabilitySection from '../../components/survey/UsabilitySection/UsabilitySection';
import UsefulnessSection from '../../components/survey/UsefulnessSection/UsefulnessSection';
import FeedbackSection from '../../components/survey/FeedbackSection/FeedbackSection';
import Button from '../../components/common/Button/Button';
import {
    DESIGN_QUESTIONS,
    QUALITY_QUESTIONS,
    USABILITY_QUESTIONS,
    USEFULNESS_QUESTIONS
} from '../../utils/constants';
import './SurveyPage.css';

const TOTAL_STEPS = 7;

export default function SurveyPage() {
    const navigate = useNavigate();
    const {
        formData,
        errors: formErrors,
        isSubmitting,
        submitSuccess,
        submitError,
        handleChange,
        handleRatingChange,
        handleSubmit,
        setErrors,
    } = useSurveyForm();

    const [currentStep, setCurrentStep] = useState(1);
    const [stepError, setStepError] = useState('');

    // Clear step error when form data changes
    useEffect(() => {
        if (stepError) setStepError('');
    }, [formData, stepError]);

    const validateStep = (step) => {
        let isValid = true;
        const newErrors = {};

        switch (step) {
            case 1: // Instruction
                isValid = true;
                break;
            case 2: // General Info
                if (!formData.gender) newErrors.gender = 'กรุณาระบุเพศ';
                if (!formData.age_range) newErrors.age_range = 'กรุณาระบุอายุ';
                if (formData.age_range === 'อื่นๆ' && !formData.age_other?.trim()) {
                    newErrors.age_other = 'กรุณาระบุอายุของคุณ';
                }
                if (!formData.department) newErrors.department = 'กรุณาระบุตำแหน่ง/ฝ่าย';
                if (formData.department === 'อื่นๆ' && !formData.department_other?.trim()) {
                    newErrors.department_other = 'กรุณาระบุตำแหน่ง/ฝ่ายของคุณ';
                }
                break;
            case 3: // Design Aspect
                DESIGN_QUESTIONS.forEach(q => {
                    if (!formData[q.id]) newErrors[q.id] = 'กรุณาให้คะแนนความพึงพอใจ';
                });
                break;
            case 4: // System Quality
                QUALITY_QUESTIONS.forEach(q => {
                    if (!formData[q.id]) newErrors[q.id] = 'กรุณาให้คะแนนความพึงพอใจ';
                });
                break;
            case 5: // Usability
                USABILITY_QUESTIONS.forEach(q => {
                    if (!formData[q.id]) newErrors[q.id] = 'กรุณาให้คะแนนความพึงพอใจ';
                });
                break;
            case 6: // Usefulness
                USEFULNESS_QUESTIONS.forEach(q => {
                    if (!formData[q.id]) newErrors[q.id] = 'กรุณาให้คะแนนความพึงพอใจ';
                });
                break;
            case 7: // Feedback (Optional)
                isValid = true;
                break;
            default:
                isValid = true;
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setStepError('กรุณากรอกข้อมูลให้ครบถ้วนในจุดที่ระบุสีแดง');
            isValid = false;
        } else {
            setErrors({});
            setStepError('');
        }

        return isValid;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrev = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        // Prevent submission if not on the last step
        if (currentStep !== TOTAL_STEPS) return;

        const success = await handleSubmit(e);
        if (success) {
            navigate('/success');
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return <InstructionSection />;
            case 2:
                return <GeneralInfoSection formData={formData} errors={formErrors} onChange={handleChange} />;
            case 3:
                return <DesignAspectSection formData={formData} errors={formErrors} onChange={handleRatingChange} />;
            case 4:
                return <SystemQualitySection formData={formData} errors={formErrors} onChange={handleRatingChange} />;
            case 5:
                return <UsabilitySection formData={formData} errors={formErrors} onChange={handleRatingChange} />;
            case 6:
                return <UsefulnessSection formData={formData} errors={formErrors} onChange={handleRatingChange} />;
            case 7:
                return <FeedbackSection formData={formData} errors={formErrors} onChange={handleChange} />;
            default:
                return null;
        }
    };

    return (
        <div className="survey-page">
            <div className="survey-container">
                {/* Header */}
                <header className="survey-header">
                    <h1 className="survey-title">
                        แบบประเมินความพึงพอใจของผู้ใช้งานต่อระบบ
                    </h1>
                    <p className="survey-subtitle">
                        ระบบเปิด-ปิดประตูม้วนเหล็กระยะไกล
                    </p>
                </header>

                {/* Progress Bar */}
                <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />

                {/* Error Message */}
                {(submitError || stepError) && (
                    <div className="alert alert-error">
                        <strong>✗ เกิดข้อผิดพลาด!</strong> {submitError || stepError}
                    </div>
                )}

                {/* Survey Form Wrapper (Changed from form to div to prevent auto-submit) */}
                <div className="survey-form">
                    {renderStepContent()}

                    {/* Navigation Buttons */}
                    <div className="navigation-buttons">
                        {currentStep > 1 && (
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handlePrev}
                                disabled={isSubmitting}
                            >
                                ย้อนกลับ
                            </Button>
                        )}

                        {currentStep < TOTAL_STEPS ? (
                            <Button
                                type="button"
                                variant="primary"
                                onClick={handleNext}
                            >
                                ถัดไป
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                variant="primary"
                                onClick={onSubmit}
                                loading={isSubmitting}
                                disabled={isSubmitting}
                            >
                                ส่งแบบประเมิน
                            </Button>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <footer className="survey-footer">
                    <p>© 2026 Satisfaction Survey System. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
}