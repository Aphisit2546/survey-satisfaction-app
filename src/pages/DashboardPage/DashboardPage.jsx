// ============================================
// DashboardPage Component
// ============================================
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFilePdf, FaImage, FaTimes, FaDownload, FaCheckCircle } from 'react-icons/fa';
import { fetchAllResponses } from '../../services/supabaseClient';
import Button from '../../components/common/Button/Button';
import {
    DESIGN_QUESTIONS,
    QUALITY_QUESTIONS,
    USABILITY_QUESTIONS,
    USEFULNESS_QUESTIONS
} from '../../utils/constants';
import jsPDF from 'jspdf';
import './DashboardPage.css';

export default function DashboardPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);
    const [exporting, setExporting] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportStatus, setExportStatus] = useState(null); // 'pdf' | 'image' | 'complete'


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

    // Helper function to create export canvas with survey data
    const createExportCanvas = () => {
        const canvas = document.createElement('canvas');
        const width = 1200;
        const height = 1600;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        // Header gradient
        const headerGradient = ctx.createLinearGradient(0, 0, width, 200);
        headerGradient.addColorStop(0, '#667eea');
        headerGradient.addColorStop(1, '#764ba2');
        ctx.fillStyle = headerGradient;
        ctx.fillRect(0, 0, width, 180);

        // Title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('ผลการประเมินความพึงพอใจ', width / 2, 70);

        ctx.font = '20px system-ui, -apple-system, sans-serif';
        ctx.fillText('Survey Satisfaction Results', width / 2, 105);

        // Total respondents
        ctx.font = 'bold 28px system-ui, -apple-system, sans-serif';
        ctx.fillText(`ผู้ตอบแบบสอบถามทั้งหมด: ${stats?.total || 0} คน`, width / 2, 155);

        // Categories data
        const categories = [
            { title: 'ด้านการออกแบบ (Design)', data: stats?.design, color: '#3b82f6' },
            { title: 'ด้านคุณภาพระบบ (Quality)', data: stats?.quality, color: '#10b981' },
            { title: 'ด้านการใช้งาน (Usability)', data: stats?.usability, color: '#f59e0b' },
            { title: 'ด้านประโยชน์ (Usefulness)', data: stats?.usefulness, color: '#ef4444' }
        ];

        let yPos = 230;

        categories.forEach((category, catIndex) => {
            // Category header
            ctx.fillStyle = category.color;
            ctx.fillRect(40, yPos, 8, 30);
            ctx.fillStyle = '#1e293b';
            ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(category.title, 60, yPos + 22);
            yPos += 50;

            // Table header
            ctx.fillStyle = '#f1f5f9';
            ctx.fillRect(40, yPos, width - 80, 35);
            ctx.fillStyle = '#475569';
            ctx.font = '14px system-ui, -apple-system, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('หัวข้อการประเมิน', 55, yPos + 23);
            ctx.textAlign = 'center';
            ctx.fillText('Mean', width - 280, yPos + 23);
            ctx.fillText('S.D.', width - 180, yPos + 23);
            ctx.fillText('ความหมาย', width - 80, yPos + 23);
            yPos += 35;

            // Draw items
            category.data?.items?.forEach((item, idx) => {
                if (idx % 2 === 0) {
                    ctx.fillStyle = '#fafafa';
                    ctx.fillRect(40, yPos, width - 80, 28);
                }
                ctx.fillStyle = '#64748b';
                ctx.font = '13px system-ui, -apple-system, sans-serif';
                ctx.textAlign = 'left';
                const truncatedLabel = item.label.length > 50 ? item.label.substring(0, 50) + '...' : item.label;
                ctx.fillText(`${idx + 1}. ${truncatedLabel}`, 55, yPos + 18);
                ctx.textAlign = 'center';
                ctx.fillText(item.mean, width - 280, yPos + 18);
                ctx.fillText(item.sd, width - 180, yPos + 18);
                ctx.font = '12px system-ui, -apple-system, sans-serif';
                ctx.fillText(getInterpretation(item.mean), width - 80, yPos + 18);
                yPos += 28;
            });

            // Summary row
            ctx.fillStyle = '#e2e8f0';
            ctx.fillRect(40, yPos, width - 80, 32);
            ctx.fillStyle = '#1e293b';
            ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(`รวม${category.title}`, 55, yPos + 21);
            ctx.textAlign = 'center';
            ctx.fillText(category.data?.summary?.mean, width - 280, yPos + 21);
            ctx.fillText(category.data?.summary?.sd, width - 180, yPos + 21);
            ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
            ctx.fillText(getInterpretation(category.data?.summary?.mean), width - 80, yPos + 21);
            yPos += 50;
        });

        // Overall summary box
        const overallGradient = ctx.createLinearGradient(40, yPos, width - 40, yPos + 100);
        overallGradient.addColorStop(0, '#667eea');
        overallGradient.addColorStop(1, '#764ba2');
        ctx.fillStyle = overallGradient;
        ctx.roundRect(40, yPos, width - 80, 100, 16);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('สรุปภาพรวมระบบทั้งหมด', width / 2, yPos + 35);

        ctx.font = 'bold 48px system-ui, -apple-system, sans-serif';
        ctx.fillText(`${stats?.overall?.mean || '0.00'}`, width / 2 - 100, yPos + 75);

        ctx.font = '18px system-ui, -apple-system, sans-serif';
        ctx.fillText(`(${getInterpretation(stats?.overall?.mean)})`, width / 2 + 100, yPos + 75);

        // Footer
        yPos += 120;
        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        const now = new Date();
        ctx.fillText(`รายงานสร้างเมื่อ: ${now.toLocaleDateString('th-TH')} ${now.toLocaleTimeString('th-TH')}`, width / 2, yPos);

        return canvas;
    };

    const exportToPDF = async () => {
        if (!stats || stats.total === 0) {
            alert('ไม่มีข้อมูลสำหรับส่งออก');
            return;
        }

        setExporting(true);
        setExportStatus('pdf');

        try {
            const canvas = createExportCanvas();
            const imgData = canvas.toDataURL('image/png');

            // Create PDF
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            // Calculate dimensions to fit the image
            const imgWidth = pageWidth - 20; // 10mm margin on each side
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // If image is taller than one page, scale to fit
            if (imgHeight > pageHeight - 20) {
                const scaledHeight = pageHeight - 20;
                const scaledWidth = (canvas.width * scaledHeight) / canvas.height;
                pdf.addImage(imgData, 'PNG', (pageWidth - scaledWidth) / 2, 10, scaledWidth, scaledHeight);
            } else {
                pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
            }

            // Save PDF
            const now = new Date();
            const fileName = `Survey_Results_${now.toISOString().split('T')[0]}.pdf`;
            pdf.save(fileName);

            setExportStatus('complete');
            setTimeout(() => {
                setExportStatus(null);
            }, 2000);

        } catch (err) {
            console.error('Error exporting PDF:', err);
            alert('เกิดข้อผิดพลาดในการส่งออก PDF: ' + err.message);
            setExportStatus(null);
        } finally {
            setExporting(false);
        }
    };

    const exportToImage = async () => {
        if (!stats || stats.total === 0) {
            alert('ไม่มีข้อมูลสำหรับส่งออก');
            return;
        }

        setExporting(true);
        setExportStatus('image');

        try {
            const canvas = createExportCanvas();
            const imgData = canvas.toDataURL('image/png');

            // Create download link
            const link = document.createElement('a');
            const now = new Date();
            link.download = `Survey_Results_${now.toISOString().split('T')[0]}.png`;
            link.href = imgData;
            link.click();

            setExportStatus('complete');
            setTimeout(() => {
                setExportStatus(null);
            }, 2000);

        } catch (err) {
            console.error('Error exporting image:', err);
            alert('เกิดข้อผิดพลาดในการส่งออกรูปภาพ: ' + err.message);
            setExportStatus(null);
        } finally {
            setExporting(false);
        }
    };

    // Export Modal Component
    const ExportModal = () => {
        if (!showExportModal) return null;

        return (
            <div className="export-modal-overlay" onClick={() => setShowExportModal(false)}>
                <div className="export-modal" onClick={e => e.stopPropagation()}>
                    <div className="export-modal-header">
                        <h3><FaDownload /> ส่งออกรายงาน</h3>
                        <button className="export-modal-close" onClick={() => setShowExportModal(false)}>
                            <FaTimes />
                        </button>
                    </div>

                    <div className="export-modal-body">
                        {/* Preview Card */}
                        <div className="export-preview-container">
                            <div className="export-preview-content">
                                <div className="export-preview-header">
                                    <h2>📊 ผลการประเมินความพึงพอใจ</h2>
                                    <p>Survey Satisfaction Results</p>
                                </div>

                                <div className="export-preview-summary">
                                    <div className="export-summary-item">
                                        <span>Design</span>
                                        <strong>{stats?.design?.summary?.mean || '0.00'}</strong>
                                    </div>
                                    <div className="export-summary-item">
                                        <span>Quality</span>
                                        <strong>{stats?.quality?.summary?.mean || '0.00'}</strong>
                                    </div>
                                    <div className="export-summary-item">
                                        <span>Usability</span>
                                        <strong>{stats?.usability?.summary?.mean || '0.00'}</strong>
                                    </div>
                                    <div className="export-summary-item">
                                        <span>Usefulness</span>
                                        <strong>{stats?.usefulness?.summary?.mean || '0.00'}</strong>
                                    </div>
                                </div>

                                <div className="export-preview-overall">
                                    <div className="export-overall-score">
                                        <span className="score-value">{stats?.overall?.mean || '0.00'}</span>
                                        <span className="score-label">ค่าเฉลี่ยรวม / Overall Mean</span>
                                    </div>
                                    <div className="export-overall-level">
                                        {getInterpretation(stats?.overall?.mean)}
                                    </div>
                                </div>

                                <div className="export-preview-footer">
                                    <p>📋 ผู้ตอบแบบสอบถามทั้งหมด {stats?.total || 0} คน</p>
                                </div>
                            </div>
                        </div>

                        {/* Export Status */}
                        {exportStatus && (
                            <div className={`export-progress ${exportStatus === 'complete' ? 'complete' : ''}`}>
                                {exportStatus === 'complete' ? (
                                    <>
                                        <FaCheckCircle /> ส่งออกสำเร็จ!
                                    </>
                                ) : (
                                    <>
                                        <div className="spinner"></div>
                                        กำลังสร้าง{exportStatus === 'pdf' ? ' PDF' : 'รูปภาพ'}...
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="export-modal-footer">
                        <Button
                            variant="primary"
                            onClick={exportToPDF}
                            disabled={exporting}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        >
                            <FaFilePdf /> PDF
                        </Button>
                        <Button
                            variant="primary"
                            onClick={exportToImage}
                            disabled={exporting}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#10b981' }}
                        >
                            <FaImage /> รูปภาพ
                        </Button>
                    </div>
                </div>
            </div>
        );
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
                        ←
                    </button>
                </div>

                <div className="dashboard-content-export">

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
                        <Button
                            variant="primary"
                            onClick={() => setShowExportModal(true)}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            <FaDownload />
                            ส่งออกรายงาน
                        </Button>
                    )}
                    <Button variant="secondary" onClick={() => navigate('/')}>
                        กลับหน้าหลัก
                    </Button>
                </div>

                {/* Export Modal */}
                <ExportModal />
            </div>
        </div>
    );
}
