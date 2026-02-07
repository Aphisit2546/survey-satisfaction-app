// ============================================
// ReportPDF Component
// Formal PDF Report for Satisfaction Survey Results
// ============================================
import './ReportPDF.css';

export default function ReportPDF({ stats, getInterpretation }) {
    if (!stats || stats.total === 0) {
        return null;
    }

    // Render evaluation table for each category
    const renderCategoryTable = (title, categoryData, startIndex = 1) => (
        <div className="report-table-section">
            <h3 className="report-table-title">{title}</h3>
            <table className="report-table">
                <thead>
                    <tr>
                        <th className="col-no">ลำดับ</th>
                        <th className="col-topic">หัวข้อการประเมิน</th>
                        <th className="col-mean">ค่าเฉลี่ย<br />(Mean)</th>
                        <th className="col-sd">ส่วนเบี่ยงเบน<br />มาตรฐาน (S.D.)</th>
                        <th className="col-meaning">ความหมาย</th>
                    </tr>
                </thead>
                <tbody>
                    {categoryData.items.map((item, idx) => (
                        <tr key={item.id}>
                            <td className="center">{startIndex + idx}</td>
                            <td>{item.label}</td>
                            <td className="center">{item.mean}</td>
                            <td className="center">{item.sd}</td>
                            <td className="center">{getInterpretation(item.mean)}</td>
                        </tr>
                    ))}
                    <tr className="summary-row">
                        <td className="center" colSpan="2"><strong>รวม{title}</strong></td>
                        <td className="center"><strong>{categoryData.summary.mean}</strong></td>
                        <td className="center"><strong>{categoryData.summary.sd}</strong></td>
                        <td className="center"><strong>{getInterpretation(categoryData.summary.mean)}</strong></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="report-pdf-container" id="report-pdf-content">
            {/* Document Header */}
            <header className="report-header">
                <h1 className="report-main-title">ผลการประเมินความพึงพอใจ</h1>
                <p className="report-subtitle">ตารางแสดงค่าเฉลี่ย (Mean) และส่วนเบี่ยงเบนมาตรฐาน (S.D.)</p>

                <div className="report-info">
                    <p><strong>จำนวนผู้ตอบแบบสอบถาม:</strong> {stats.total} คน</p>
                    <p><strong>ผู้จัดทำ:</strong> 654295028 นายอภิสิทธิ์ จันมุณี</p>
                </div>
            </header>

            {/* Evaluation Tables */}
            <main className="report-content">
                {/* 1. Design Aspect */}
                {renderCategoryTable('ด้านการออกแบบ (Design Aspect)', stats.design)}

                {/* 2. System Quality */}
                {renderCategoryTable('ด้านคุณภาพระบบ (System Quality)', stats.quality)}

                {/* 3. Usability */}
                {renderCategoryTable('ด้านการใช้งาน (Usability)', stats.usability)}

                {/* 4. Usefulness */}
                {renderCategoryTable('ด้านประโยชน์ที่ได้รับ (Usefulness)', stats.usefulness)}

                {/* 5. Overall Summary Table */}
                <div className="report-table-section">
                    <h3 className="report-table-title">สรุปภาพรวมทั้ง 4 ด้าน</h3>
                    <table className="report-table">
                        <thead>
                            <tr>
                                <th className="col-no">ลำดับ</th>
                                <th className="col-topic">หัวข้อการประเมิน</th>
                                <th className="col-mean">ค่าเฉลี่ย<br />(Mean)</th>
                                <th className="col-sd">ส่วนเบี่ยงเบน<br />มาตรฐาน (S.D.)</th>
                                <th className="col-meaning">ความหมาย</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="center">1</td>
                                <td>ภาพรวมด้านการออกแบบ (Design Aspect)</td>
                                <td className="center">{stats.design.summary.mean}</td>
                                <td className="center">{stats.design.summary.sd}</td>
                                <td className="center">{getInterpretation(stats.design.summary.mean)}</td>
                            </tr>
                            <tr>
                                <td className="center">2</td>
                                <td>ภาพรวมด้านคุณภาพระบบ (System Quality)</td>
                                <td className="center">{stats.quality.summary.mean}</td>
                                <td className="center">{stats.quality.summary.sd}</td>
                                <td className="center">{getInterpretation(stats.quality.summary.mean)}</td>
                            </tr>
                            <tr>
                                <td className="center">3</td>
                                <td>ภาพรวมด้านการใช้งาน (Usability)</td>
                                <td className="center">{stats.usability.summary.mean}</td>
                                <td className="center">{stats.usability.summary.sd}</td>
                                <td className="center">{getInterpretation(stats.usability.summary.mean)}</td>
                            </tr>
                            <tr>
                                <td className="center">4</td>
                                <td>ภาพรวมด้านประโยชน์ที่ได้รับ (Usefulness)</td>
                                <td className="center">{stats.usefulness.summary.mean}</td>
                                <td className="center">{stats.usefulness.summary.sd}</td>
                                <td className="center">{getInterpretation(stats.usefulness.summary.mean)}</td>
                            </tr>
                            <tr className="grand-total-row">
                                <td className="center" colSpan="2"><strong>สรุปภาพรวมระบบทั้งหมด</strong></td>
                                <td className="center"><strong>{stats.overall.mean}</strong></td>
                                <td className="center"><strong>{stats.overall.sd}</strong></td>
                                <td className="center"><strong>{getInterpretation(stats.overall.mean)}</strong></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </main>

            {/* Footer */}
            <footer className="report-footer">
                <p>รายงานสร้างเมื่อ: {new Date().toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}</p>
            </footer>
        </div>
    );
}
