// ============================================
// GeneralInfoSection Component
// ============================================
import Select from '../../common/Select/Select';
import Input from '../../common/Input/Input';
import { GENDER_OPTIONS, AGE_RANGE_OPTIONS, DEPARTMENT_OPTIONS } from '../../../utils/constants';
import './GeneralInfoSection.css';

export default function GeneralInfoSection({ formData, errors, onChange }) {
    return (
        <div className="survey-section">
            <h2 className="section-title">ส่วนที่ 2 : ข้อมูลทั่วไป</h2>

            <div className="form-group">
                <label className="form-label required">เพศ</label>
                <Select
                    name="gender"
                    value={formData.gender}
                    onChange={onChange}
                    options={GENDER_OPTIONS}
                    placeholder="เลือกเพศ"
                    error={errors.gender}
                    required
                />
            </div>

            <div className="form-group">
                <label className="form-label required">อายุ</label>
                <Select
                    name="age_range"
                    value={formData.age_range}
                    onChange={onChange}
                    options={AGE_RANGE_OPTIONS}
                    placeholder="เลือกช่วงอายุ"
                    error={errors.age_range}
                    required
                />

                {formData.age_range === 'อื่นๆ' && (
                    <div className="conditional-input">
                        <Input
                            name="age_other"
                            type="text"
                            value={formData.age_other}
                            onChange={onChange}
                            placeholder="โปรดระบุอายุ (เช่น 50 ปี)"
                            error={errors.age_other}
                            required
                        />
                    </div>
                )}
            </div>

            <div className="form-group">
                <label className="form-label required">ตำแหน่ง / ฝ่าย</label>
                <Select
                    name="department"
                    value={formData.department}
                    onChange={onChange}
                    options={DEPARTMENT_OPTIONS}
                    placeholder="เลือกตำแหน่ง/ฝ่าย"
                    error={errors.department}
                    required
                />

                {formData.department === 'อื่นๆ' && (
                    <div className="conditional-input">
                        <Input
                            name="department_other"
                            type="text"
                            value={formData.department_other}
                            onChange={onChange}
                            placeholder="โปรดระบุตำแหน่ง/ฝ่าย"
                            error={errors.department_other}
                            required
                        />
                    </div>
                )}
            </div>
        </div>
    );
}