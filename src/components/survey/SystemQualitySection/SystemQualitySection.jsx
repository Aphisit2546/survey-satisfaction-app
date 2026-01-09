// ============================================
// SystemQualitySection Component
// ============================================
import StarRating from '../../common/StarRating/StarRating';
import { QUALITY_QUESTIONS } from '../../../utils/constants';
import '../DesignAspectSection/DesignAspectSection.css';

export default function SystemQualitySection({ formData, errors, onChange }) {
    return (
        <div className="survey-section">
            <h2 className="section-title">ส่วนที่ 4 : ด้านคุณภาพระบบ (System Quality)</h2>
            <p className="section-description">
                โปรดให้คะแนนความพึงพอใจในด้านคุณภาพของระบบ (1 = น้อยที่สุด, 5 = มากที่สุด)
            </p>

            <div className="section-image-container">
                <img src="/src/assets/images/screen.png" alt="Screen Preview" className="section-image-preview" />
            </div>

            {QUALITY_QUESTIONS.map((question, index) => (
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