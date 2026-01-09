// ============================================
// InstructionSection Component
// ============================================
import { FaInfoCircle, FaExclamationTriangle, FaStar, FaAndroid, FaMobileAlt } from 'react-icons/fa';
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
                </div>

                {/* QR Code Section */}
                <div className="qr-section">
                    <img src={qrcodeImage} alt="QR Code for APK" className="qr-code" />
                    <p className="qr-caption">
                        <FaAndroid className="android-icon" /> QR Code เพื่อโหลดเป็นไฟล์ APK เพื่อทดสอบการใช้งานระบบ<br />
                        <span className="note">(ใช้ได้แค่ Android)</span>
                    </p>
                </div>

                {/* Warning / Demo Note */}
                <div className="demo-alert">
                    <div className="alert-item">
                        <FaExclamationTriangle className="alert-icon" />
                        <span>เป็น Demo ไม่ได้เชื่อมต่อกับระบบหรือฐานข้อมูลจริง</span>
                    </div>
                    <div className="alert-item">
                        <FaExclamationTriangle className="alert-icon" />
                        <span>หากไม่ทดสอบหรือทดสอบไม่ได้ สามารถดู UI ข้างบนแทนได้เลยครับ</span>
                    </div>
                </div>

                <div className="info-grid">
                    {/* Test Credentials */}
                    <div className="info-card credentials-card">
                        <h3 className="card-title"><FaMobileAlt /> เบอร์โทรและ OTP ในการทดสอบ</h3>
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

                    {/* Limitations */}
                    <div className="info-card limitations-card">
                        <h3 className="card-title">ข้อจำกัดของระบบ Demo</h3>
                        <ul className="limitations-list">
                            <li>ดึงมาแค่ภาพจากกล้องวงจรปิด โดยรีโหลดภาพทุกๆ 0.5 วินาที</li>
                            <li>เนื่องจากเป็น Demo ไม่สามารถใช้ปุ่มเมนูแฮมเบอร์เกอร์ได้</li>
                            <li>เนื่องจากเป็น Demo เลยไม่ได้พัฒนาในส่วนของตัวเต็มให้ Demo ต่อ</li>
                        </ul>
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