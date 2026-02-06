// ============================================
// DashboardPage Component
// ============================================
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaFilePdf, FaImage } from 'react-icons/fa';
import { fetchAllResponses } from '../../services/supabaseClient';
import Button from '../../components/common/Button/Button';
import {
    DESIGN_QUESTIONS,
    QUALITY_QUESTIONS,
    USABILITY_QUESTIONS,
    USEFULNESS_QUESTIONS
} from '../../utils/constants';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './DashboardPage.css';

export default function DashboardPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);
    const [exporting, setExporting] = useState(false);
    const contentRef = useRef(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const { success, data, error } = await fetchAllResponses();
            if (success) {
                calculateStats(data);
            } else {
                setError(error);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (data) => {
        if (!data || data.length === 0) {
            setStats({ total: 0 });
            return;
        }

        const total = data.length;

        // Helper to calculate Mean and SD from an array of numbers
        const calculateMeanSD = (values) => {
            const sum = values.reduce((a, b) => a + b, 0);
            const mean = sum / total;

            const squareDiffs = values.map(value => {
                const diff = value - mean;
                return diff * diff;
            });
            const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / total;
            const sd = Math.sqrt(avgSquareDiff);

            return {
                mean: mean.toFixed(2),
                sd: sd.toFixed(2),
                rawMean: mean // Keep for aggregate calculations
            };
        };

        // Helper to get stats for a single question
        const getQuestionStats = (fieldId) => {
            const values = data.map(d => d[fieldId] || 0);
            return calculateMeanSD(values);
        };

        // Helper to get Aggregate Stats (Average of multiple fields per user)
        const getCategoryStats = (fieldIds) => {
            // For each user, calculate their average for this category
            const userAverages = data.map(d => {
                const sum = fieldIds.reduce((acc, field) => acc + (d[field] || 0), 0);
                return sum / fieldIds.length;
            });
            return calculateMeanSD(userAverages);
        };

        // Process Categories
        const designIds = DESIGN_QUESTIONS.map(q => q.id);
        const qualityIds = QUALITY_QUESTIONS.map(q => q.id);
        const usabilityIds = USABILITY_QUESTIONS.map(q => q.id);
        const usefulnessIds = USEFULNESS_QUESTIONS.map(q => q.id);

        const designStats = {
            items: DESIGN_QUESTIONS.map(q => ({ ...q, ...getQuestionStats(q.id) })),
            summary: getCategoryStats(designIds)
        };

        const qualityStats = {
            items: QUALITY_QUESTIONS.map(q => ({ ...q, ...getQuestionStats(q.id) })),
            summary: getCategoryStats(qualityIds)
        };

        const usabilityStats = {
            items: USABILITY_QUESTIONS.map(q => ({ ...q, ...getQuestionStats(q.id) })),
            summary: getCategoryStats(usabilityIds)
        };

        const usefulnessStats = {
            items: USEFULNESS_QUESTIONS.map(q => ({ ...q, ...getQuestionStats(q.id) })),
            summary: getCategoryStats(usefulnessIds)
        };

        // Overall Summary (Average of all 4 category scores per user)
        const allIds = [...designIds, ...qualityIds, ...usabilityIds, ...usefulnessIds];
        const overallStats = getCategoryStats(allIds);

        setStats({
            total,
            design: designStats,
            quality: qualityStats,
            usability: usabilityStats,
            usefulness: usefulnessStats,
            overall: overallStats
        });
    };

    const getInterpretation = (mean) => {
        const score = parseFloat(mean);
        if (score >= 4.50) return 'มากที่สุด (ดีมาก)';
        if (score >= 3.50) return 'มาก (ดี)';
        if (score >= 2.50) return 'ปานกลาง';
        if (score >= 1.50) return 'น้อย (พอใช้)';
        return 'น้อยที่สุด (ควรปรับปรุง)';
    };

    const getInterpretationEN = (mean) => {
        const score = parseFloat(mean);
        if (score >= 4.50) return 'Excellent';
        if (score >= 3.50) return 'Good';
        if (score >= 2.50) return 'Fair';
        if (score >= 1.50) return 'Poor';
        return 'Very Poor';
    };

    const exportToPDF = async () => {
        if (!stats || stats.total === 0) {
            alert('ไม่มีข้อมูลสำหรับส่งออก');
            return;
        }

        if (!contentRef.current) {
            alert('ไม่พบเนื้อหาสำหรับส่งออก');
            return;
        }

        setExporting(true);

        try {
            const element = contentRef.current;

            // Capture the element as canvas
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');

            // Create PDF
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            // Calculate dimensions to fit the image
            const imgWidth = pageWidth - 20; // 10mm margin on each side
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let yPosition = 10;

            // If image is taller than one page, we need to split it
            if (imgHeight > pageHeight - 20) {
                // Scale to fit width and use multiple pages if needed
                const scaledHeight = pageHeight - 20;
                const scaledWidth = (canvas.width * scaledHeight) / canvas.height;

                if (scaledWidth <= pageWidth - 20) {
                    // Image can fit on one page with height constraint
                    pdf.addImage(imgData, 'PNG', (pageWidth - scaledWidth) / 2, 10, scaledWidth, scaledHeight);
                } else {
                    // Use original width-based scaling and split across pages
                    const pagesNeeded = Math.ceil(imgHeight / (pageHeight - 20));

                    for (let i = 0; i < pagesNeeded; i++) {
                        if (i > 0) pdf.addPage();

                        const sourceY = i * ((canvas.height / pagesNeeded));
                        const sourceHeight = canvas.height / pagesNeeded;

                        // Create a temporary canvas for this portion
                        const tempCanvas = document.createElement('canvas');
                        tempCanvas.width = canvas.width;
                        tempCanvas.height = sourceHeight;
                        const ctx = tempCanvas.getContext('2d');
                        ctx.drawImage(canvas, 0, sourceY, canvas.width, sourceHeight, 0, 0, canvas.width, sourceHeight);

                        const portionData = tempCanvas.toDataURL('image/png');
                        const portionHeight = (sourceHeight * imgWidth) / canvas.width;

                        pdf.addImage(portionData, 'PNG', 10, 10, imgWidth, portionHeight);
                    }
                }
            } else {
                // Image fits on one page
                pdf.addImage(imgData, 'PNG', 10, yPosition, imgWidth, imgHeight);
            }

            // Save PDF
            const now = new Date();
            const fileName = `Survey_Results_${now.toISOString().split('T')[0]}.pdf`;
            pdf.save(fileName);

        } catch (err) {
            console.error('Error exporting PDF:', err);
            alert('เกิดข้อผิดพลาดในการส่งออก PDF: ' + err.message);
        } finally {
            setExporting(false);
        }
    };

    const exportToImage = async () => {
        if (!stats || stats.total === 0) {
            alert('ไม่มีข้อมูลสำหรับส่งออก');
            return;
        }

        if (!contentRef.current) {
            alert('ไม่พบเนื้อหาสำหรับส่งออก');
            return;
        }

        setExporting(true);

        try {
            const element = contentRef.current;

            // Capture the element as canvas
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            // Convert to PNG
            const imgData = canvas.toDataURL('image/png');

            // Create download link
            const link = document.createElement('a');
            const now = new Date();
            link.download = `Survey_Results_${now.toISOString().split('T')[0]}.png`;
            link.href = imgData;
            link.click();

        } catch (err) {
            console.error('Error exporting image:', err);
            alert('เกิดข้อผิดพลาดในการส่งออกรูปภาพ: ' + err.message);
        } finally {
            setExporting(false);
        }
    };

    if (loading) return <div className="loading-container">กำลังโหลดข้อมูล...</div>;
    if (error) return <div className="error-container">เกิดข้อผิดพลาด: {error}</div>;

    const renderTable = (title, dataObj, summaryLabel) => (
        <section className="aspect-section">
            <h2 className="aspect-title">{title}</h2>
            <div className="stats-table-container">
                <table className="stats-table">
                    <thead>
                        <tr>
                            <th>หัวข้อการประเมิน</th>
                            <th className="center" width="100">Mean</th>
                            <th className="center" width="100">S.D.</th>
                            <th className="center" width="150">ความหมาย</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataObj.items.map((item, idx) => (
                            <tr key={idx}>
                                <td>{idx + 1}. {item.label}</td>
                                <td className="center">{item.mean}</td>
                                <td className="center">{item.sd}</td>
                                <td className="center">{getInterpretation(item.mean)}</td>
                            </tr>
                        ))}
                        {/* Summary Row */}
                        <tr className="summary-row">
                            <td><strong>5. {summaryLabel}</strong></td>
                            <td className="center"><strong>{dataObj.summary.mean}</strong></td>
                            <td className="center"><strong>{dataObj.summary.sd}</strong></td>
                            <td className="center"><strong>{getInterpretation(dataObj.summary.mean)}</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    );

    return (
        <div className="dashboard-page">
            <div className="dashboard-container">
                <div className="dashboard-top-nav">
                    <button className="nav-back-btn" onClick={() => navigate('/')} title="กลับหน้าหลัก">
                        <FaArrowLeft />
                    </button>
                </div>

                <div ref={contentRef} className="dashboard-content-export">

                    <header className="dashboard-header">
                        <h1 className="dashboard-title">ผลการประเมินความพึงพอใจ</h1>
                        <p className="dashboard-subtitle">ตารางแสดงค่าเฉลี่ย (Mean) และส่วนเบี่ยงเบนมาตรฐาน (S.D.)</p>
                    </header>

                    <div className="stats-summary">
                        <div className="stat-card">
                            <div className="stat-value">{stats?.total || 0}</div>
                            <div className="stat-label">ผู้ตอบแบบสอบถามทั้งหมด</div>
                        </div>
                    </div>

                    {stats?.total > 0 ? (
                        <>
                            {renderTable('ด้านการออกแบบ (Design Aspect)', stats.design, 'ภาพรวมด้านการออกแบบ (Design Aspect)')}
                            {renderTable('ด้านคุณภาพระบบ (System Quality)', stats.quality, 'ภาพรวมด้านคุณภาพระบบ (System Quality)')}
                            {renderTable('ด้านการใช้งาน (Usability)', stats.usability, 'ภาพรวมด้านการใช้งาน (Usability)')}
                            {renderTable('ด้านประโยชน์ที่ได้รับ (Usefulness)', stats.usefulness, 'ภาพรวมด้านประโยชน์ที่ได้รับ (Usefulness)')}

                            {/* Grand Total Summary */}
                            <section className="aspect-section">
                                <h2 className="aspect-title">สรุปภาพรวมทั้ง 4 ด้าน</h2>
                                <div className="stats-table-container">
                                    <table className="stats-table">
                                        <thead>
                                            <tr>
                                                <th>หัวข้อการประเมิน</th>
                                                <th className="center" width="100">Mean</th>
                                                <th className="center" width="100">S.D.</th>
                                                <th className="center" width="150">ความหมาย</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>1. ภาพรวมด้านการออกแบบ (Design Aspect)</td>
                                                <td className="center">{stats.design.summary.mean}</td>
                                                <td className="center">{stats.design.summary.sd}</td>
                                                <td className="center">{getInterpretation(stats.design.summary.mean)}</td>
                                            </tr>
                                            <tr>
                                                <td>2. ภาพรวมด้านคุณภาพระบบ (System Quality)</td>
                                                <td className="center">{stats.quality.summary.mean}</td>
                                                <td className="center">{stats.quality.summary.sd}</td>
                                                <td className="center">{getInterpretation(stats.quality.summary.mean)}</td>
                                            </tr>
                                            <tr>
                                                <td>3. ภาพรวมด้านการใช้งาน (Usability)</td>
                                                <td className="center">{stats.usability.summary.mean}</td>
                                                <td className="center">{stats.usability.summary.sd}</td>
                                                <td className="center">{getInterpretation(stats.usability.summary.mean)}</td>
                                            </tr>
                                            <tr>
                                                <td>4. ภาพรวมด้านประโยชน์ที่ได้รับ (Usefulness)</td>
                                                <td className="center">{stats.usefulness.summary.mean}</td>
                                                <td className="center">{stats.usefulness.summary.sd}</td>
                                                <td className="center">{getInterpretation(stats.usefulness.summary.mean)}</td>
                                            </tr>
                                            <tr className="grand-total-row">
                                                <td><strong>สรุปภาพรวมระบบทั้งหมด</strong></td>
                                                <td className="center"><strong>{stats.overall.mean}</strong></td>
                                                <td className="center"><strong>{stats.overall.sd}</strong></td>
                                                <td className="center"><strong>{getInterpretation(stats.overall.mean)}</strong></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </>
                    ) : (
                        <div className="no-data">ยังไม่มีข้อมูลการตอบแบบสอบถาม</div>
                    )}
                </div>

                <div className="back-button-container">
                    {stats?.total > 0 && (
                        <>
                            <Button
                                variant="primary"
                                onClick={exportToPDF}
                                disabled={exporting}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                <FaFilePdf />
                                {exporting ? 'กำลังส่งออก...' : 'ส่งออก PDF'}
                            </Button>
                            <Button
                                variant="primary"
                                onClick={exportToImage}
                                disabled={exporting}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#10b981' }}
                            >
                                <FaImage />
                                {exporting ? 'กำลังส่งออก...' : 'ส่งออกรูปภาพ'}
                            </Button>
                        </>
                    )}
                    <Button variant="secondary" onClick={() => navigate('/')}>
                        กลับหน้าหลัก
                    </Button>
                </div>
            </div>
        </div>
    );
}
