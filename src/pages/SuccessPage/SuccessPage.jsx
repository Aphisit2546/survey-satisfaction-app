// ============================================
// SuccessPage Component - หน้าขอบคุณ
// ============================================
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import Button from '../../components/common/Button/Button';
import './SuccessPage.css';

export default function SuccessPage() {
    const navigate = useNavigate();

    const handleBackToHome = () => {
        navigate('/');
    };

    return (
        <div className="success-page">
            <div className="success-container">
                <div className="success-card">
                    {/* Success Icon */}
                    <div className="success-icon-wrapper">
                        <FaCheckCircle className="success-icon" />
                    </div>

                    {/* Success Message */}
                    <h1 className="success-title">ส่งแบบประเมินสำเร็จ!</h1>

                    <p className="success-message">
                        ขอบคุณครับที่สละเวลาให้ข้อมูล
                    </p>

                    {/* Divider */}
                    <div className="success-divider"></div>

                    {/* Additional Info */}
                    <div className="success-info">
                        <p className="info-item">
                            <strong>✓</strong> ข้อมูลของคุณได้รับการบันทึกเรียบร้อยแล้ว
                        </p>
                        <p className="info-item">
                            <strong>✓</strong> ข้อมูลจะถูกนำไปใช้เพื่อการศึกษาและพัฒนาเท่านั้น
                        </p>
                        <p className="info-item">
                            <strong>✓</strong> ข้อมูลของคุณจะถูกเก็บเป็นความลับ
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="success-actions">
                        <Button
                            variant="primary"
                            onClick={handleBackToHome}
                            fullWidth
                        >
                            กลับไปหน้าแรก
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}