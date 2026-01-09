// ============================================
// UsabilitySection Component
// ============================================
import StarRating from '../../common/StarRating/StarRating';
import { USABILITY_QUESTIONS } from '../../../utils/constants';
import '../DesignAspectSection/DesignAspectSection.css';

export default function UsabilitySection({ formData, errors, onChange }) {
    return (
        <div className="survey-section">
            <h2 className="section-title">ส่วนที่ 5 : ด้านการใช้งาน (Usability)</h2>
            <p className="section-description">
                โปรดให้คะแนนความพึงพอใจในด้านการใช้งานของระบบ (1 = น้อยที่สุด, 5 = มากที่สุด)
            </p>

            <div className="section-image-container">
                <img src="/src/assets/images/screen.png" alt="Screen Preview" className="section-image-preview" />
            </div>

            {USABILITY_QUESTIONS.map((question, index) => (
                <div key={question.id} className="rating-group">
                    <label className="rating-label required">
                        {index + 1}. {question.label}
                    </label>
                    <StarRating
                        name={question.id}
                        value={formData[question.id]}
                        onChange={onChange}
                        error={errors[question.id]}
                    />
                </div>
            ))}
        </div>
    );
}