// ============================================
// InstructionSection Component
// ============================================
import { FaInfoCircle, FaExclamationTriangle, FaStar, FaAndroid, FaMobileAlt, FaGlobe, FaExternalLinkAlt } from 'react-icons/fa';
import screenImage from '../../../assets/images/screen.png';
import qrcodeImage from '../../../assets/images/qrcode.jpg';
import './InstructionSection.css';

export default function InstructionSection() {
    return (
        <div className="instruction-section">
            <div className="instruction-header">
                <h2 className="instruction-title">ส่วนที่ 1 : คำชี้แจง</h2>
            </div>

            <div className="instruction-content">

                {/* Screen Image */}
                <div className="section-image-container">
                    <img src={screenImage} alt="Screen Preview" className="section-image-preview" />

                    <button
                        type="button"
                        className="dashboard-btn"
                        onClick={() => window.open('/dashboard', '_self')}
                    >
                        <span className="btn-icon">📊</span>
                        <span>ดูผลสรุปการประเมิน (Dashboard)</span>
                    </button>
                </div>

                {/* Testing Options Section */}
                <div className="testing-options-section">
                    <h3 className="testing-title">ช่องทางทดสอบระบบ</h3>

                    <div className="testing-options-grid">
                        {/* Option 1: QR Code APK */}
                        <div className="testing-option">
                            <div className="option-badge">
                                <FaAndroid className="badge-icon android" />
                                <span>APK Download</span>
                            </div>
                            <img src={qrcodeImage} alt="QR Code for APK" className="qr-code" />
                            <p className="option-description">
                                QR Code เพื่อโหลดเป็นไฟล์ APK<br />เพื่อทดสอบการใช้งานระบบ
                            </p>
                            <span className="platform-note android-note">
                                <FaAndroid /> ใช้ได้แค่ Android
                            </span>
                        </div>

                        {/* OR Divider */}
                        <div className="or-divider">
                            <span>หรือ</span>
                        </div>

                        {/* Option 2: Web App */}
                        <div className="testing-option">
                            <div className="option-badge">
                                <FaGlobe className="badge-icon web" />
                                <span>Web App</span>
                            </div>
                            <div className="web-option-content">
                                <p className="option-description">
                                    ทดสอบผ่านเว็บแอป
                                </p>
                                <a
                                    href="https://nid-remote-demo.onrender.com/login"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="webapp-link"
                                >
                                    <FaExternalLinkAlt />
                                    <span>nid-remote-demo.onrender.com</span>
                                </a>
                            </div>
                            <span className="platform-note web-note">
                                <FaGlobe /> ใช้ได้ทุกอุปกรณ์
                            </span>
                        </div>
                    </div>

                    {/* Alert Notice */}
                    <div className="testing-notice">
                        <FaExclamationTriangle className="notice-icon" />
                        <span>หากไม่ทดสอบหรือทดสอบไม่ได้ สามารถดู UI ข้างบนแทนได้เลยครับ</span>
                    </div>
                </div>

                <div className="info-grid">
                    {/* Test Credentials */}
                    <div className="info-card credentials-card">
                        <h3 className="card-title"><FaMobileAlt /> เบอร์โทรและ OTP ในการทดสอบสำหรับไฟล์ APK ส่วนเว็บแอปใส่อะไรก็ได้ครับ</h3>
                        <div className="credential-list">
                            <div className="credential-item">
                                <div className="credential-group">
                                    <span className="label">เบอร์โทร:</span>
                                    <span className="value">081-111-1111</span>
                                </div>
                                <div className="credential-group">
                                    <span className="label">OTP:</span>
                                    <span className="value otp-value">123456</span>
                                </div>
                            </div>
                            <div className="credential-item">
                                <div className="credential-group">
                                    <span className="label">เบอร์โทร:</span>
                                    <span className="value">088-888-8888</span>
                                </div>
                                <div className="credential-group">
                                    <span className="label">OTP:</span>
                                    <span className="value otp-value">888888</span>
                                </div>
                            </div>
                            <div className="credential-item">
                                <div className="credential-group">
                                    <span className="label">เบอร์โทร:</span>
                                    <span className="value">099-999-9999</span>
                                </div>
                                <div className="credential-group">
                                    <span className="label">OTP:</span>
                                    <span className="value otp-value">999999</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rating Scale */}
                <div className="rating-scale-section">
                    <h3 className="scale-title"><FaStar className="star-icon" /> ระดับความพึงพอใจ</h3>
                    <div className="scale-list-visual">
                        {[
                            { stars: 5, label: 'มากที่สุด' },
                            { stars: 4, label: 'มาก' },
                            { stars: 3, label: 'ปานกลาง' },
                            { stars: 2, label: 'น้อย' },
                            { stars: 1, label: 'น้อยที่สุด' }
                        ].map((item) => (
                            <div key={item.stars} className="scale-row">
                                <div className="stars-display">
                                    {[...Array(5)].map((_, index) => (
                                        <FaStar
                                            key={index}
                                            className={index < item.stars ? 'star-filled' : 'star-empty'}
                                        />
                                    ))}
                                </div>
                                <div className="scale-meaning">
                                    หมายถึง <span className="meaning-highlight">{item.label}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}