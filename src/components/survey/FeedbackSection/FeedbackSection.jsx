// ============================================
// FeedbackSection Component
// ============================================
import Textarea from '../../common/Textarea/Textarea';
import { FEEDBACK_QUESTIONS } from '../../../utils/constants';
import screenImage from '../../../assets/images/screen.png';
import './FeedbackSection.css';

export default function FeedbackSection({ formData, errors, onChange }) {
    return (
        <div className="survey-section">
            <h2 className="section-title">ส่วนที่ 7 : ข้อเสนอแนะเพิ่มเติม</h2>
            <p className="section-description optional-note">
                ส่วนนี้ไม่บังคับ แต่ความคิดเห็นของคุณจะช่วยให้เราพัฒนาระบบให้ดียิ่งขึ้น
            </p>

            <div className="section-image-container">
                <img src={screenImage} alt="Screen Preview" className="section-image-preview" />
            </div>

            {FEEDBACK_QUESTIONS.map((question) => (
                <div key={question.id} className="feedback-group">
                    <label className="feedback-label">
                        {question.label}
                    </label>
                    <Textarea
                        name={question.id}
                        value={formData[question.id]}
                        onChange={onChange}
                        placeholder={question.placeholder}
                        error={errors[question.id]}
                        rows={4}
                        maxLength={500}
                    />
                </div>
            ))}
        </div>
    );
}