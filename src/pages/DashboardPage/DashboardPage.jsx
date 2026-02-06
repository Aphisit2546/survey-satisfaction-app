// ============================================
// DashboardPage Component
// ============================================
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaFilePdf } from 'react-icons/fa';
import { fetchAllResponses } from '../../services/supabaseClient';
import Button from '../../components/common/Button/Button';
import {
    DESIGN_QUESTIONS,
    QUALITY_QUESTIONS,
    USABILITY_QUESTIONS,
    USEFULNESS_QUESTIONS
} from '../../utils/constants';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './DashboardPage.css';

export default function DashboardPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);
    const [exporting, setExporting] = useState(false);

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

    const exportToPDF = async () => {
        if (!stats || stats.total === 0) {
            alert('ไม่มีข้อมูลสำหรับส่งออก');
            return;
        }

        setExporting(true);

        try {
            // Create PDF document
            const doc = new jsPDF('p', 'mm', 'a4');

            // Load Thai font (THSarabunNew)
            const fontUrl = 'https://cdn.jsdelivr.net/npm/@aspect-ratio/thai-fonts@1.0.0/THSarabunNew.ttf';

            try {
                const response = await fetch(fontUrl);
                const fontBuffer = await response.arrayBuffer();
                const fontBase64 = btoa(String.fromCharCode(...new Uint8Array(fontBuffer)));
                doc.addFileToVFS('THSarabunNew.ttf', fontBase64);
                doc.addFont('THSarabunNew.ttf', 'THSarabunNew', 'normal');
                doc.setFont('THSarabunNew');
            } catch (fontError) {
                console.warn('Could not load Thai font, using default font');
            }

            const pageWidth = doc.internal.pageSize.getWidth();
            let yPosition = 20;

            // Title
            doc.setFontSize(18);
            doc.text('ผลการประเมินความพึงพอใจ', pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 10;

            doc.setFontSize(12);
            doc.text('ตารางแสดงค่าเฉลี่ย (Mean) และส่วนเบี่ยงเบนมาตรฐาน (S.D.)', pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 10;

            // Total respondents
            doc.setFontSize(14);
            doc.text(`ผู้ตอบแบบสอบถามทั้งหมด: ${stats.total} คน`, 14, yPosition);
            yPosition += 10;

            // Export Date/Time
            const now = new Date();
            const dateStr = now.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
            const timeStr = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
            doc.setFontSize(10);
            doc.text(`วันที่ส่งออก: ${dateStr} เวลา ${timeStr}`, 14, yPosition);
            yPosition += 15;

            // Table styling options
            const tableStyles = {
                headStyles: {
                    fillColor: [59, 130, 246],
                    textColor: 255,
                    fontSize: 10,
                    halign: 'center'
                },
                bodyStyles: {
                    fontSize: 9,
                    textColor: 50
                },
                alternateRowStyles: {
                    fillColor: [245, 247, 250]
                },
                columnStyles: {
                    0: { cellWidth: 'auto' },
                    1: { cellWidth: 25, halign: 'center' },
                    2: { cellWidth: 25, halign: 'center' },
                    3: { cellWidth: 40, halign: 'center' }
                },
                margin: { left: 14, right: 14 },
                tableWidth: 'auto'
            };

            // Helper function to add a table section
            const addTableSection = (title, dataObj, summaryLabel) => {
                // Check if need new page
                if (yPosition > 240) {
                    doc.addPage();
                    yPosition = 20;
                }

                // Section title
                doc.setFontSize(12);
                doc.setTextColor(59, 130, 246);
                doc.text(title, 14, yPosition);
                doc.setTextColor(0, 0, 0);
                yPosition += 5;

                // Prepare table data
                const tableData = dataObj.items.map((item, idx) => [
                    `${idx + 1}. ${item.label}`,
                    item.mean,
                    item.sd,
                    getInterpretation(item.mean)
                ]);

                // Add summary row
                tableData.push([
                    `5. ${summaryLabel}`,
                    dataObj.summary.mean,
                    dataObj.summary.sd,
                    getInterpretation(dataObj.summary.mean)
                ]);

                doc.autoTable({
                    startY: yPosition,
                    head: [['หัวข้อการประเมิน', 'Mean', 'S.D.', 'ความหมาย']],
                    body: tableData,
                    ...tableStyles,
                    didParseCell: function (data) {
                        // Style summary row
                        if (data.row.index === tableData.length - 1) {
                            data.cell.styles.fontStyle = 'bold';
                            data.cell.styles.fillColor = [220, 230, 245];
                        }
                    }
                });

                yPosition = doc.lastAutoTable.finalY + 15;
            };

            // Add each section
            addTableSection('ด้านการออกแบบ (Design Aspect)', stats.design, 'ภาพรวมด้านการออกแบบ');
            addTableSection('ด้านคุณภาพระบบ (System Quality)', stats.quality, 'ภาพรวมด้านคุณภาพระบบ');
            addTableSection('ด้านการใช้งาน (Usability)', stats.usability, 'ภาพรวมด้านการใช้งาน');
            addTableSection('ด้านประโยชน์ที่ได้รับ (Usefulness)', stats.usefulness, 'ภาพรวมด้านประโยชน์ที่ได้รับ');

            // Grand Total Summary Table
            if (yPosition > 200) {
                doc.addPage();
                yPosition = 20;
            }

            doc.setFontSize(12);
            doc.setTextColor(59, 130, 246);
            doc.text('สรุปภาพรวมทั้ง 4 ด้าน', 14, yPosition);
            doc.setTextColor(0, 0, 0);
            yPosition += 5;

            const grandTotalData = [
                ['1. ภาพรวมด้านการออกแบบ (Design Aspect)', stats.design.summary.mean, stats.design.summary.sd, getInterpretation(stats.design.summary.mean)],
                ['2. ภาพรวมด้านคุณภาพระบบ (System Quality)', stats.quality.summary.mean, stats.quality.summary.sd, getInterpretation(stats.quality.summary.mean)],
                ['3. ภาพรวมด้านการใช้งาน (Usability)', stats.usability.summary.mean, stats.usability.summary.sd, getInterpretation(stats.usability.summary.mean)],
                ['4. ภาพรวมด้านประโยชน์ที่ได้รับ (Usefulness)', stats.usefulness.summary.mean, stats.usefulness.summary.sd, getInterpretation(stats.usefulness.summary.mean)],
                ['สรุปภาพรวมระบบทั้งหมด', stats.overall.mean, stats.overall.sd, getInterpretation(stats.overall.mean)]
            ];

            doc.autoTable({
                startY: yPosition,
                head: [['หัวข้อการประเมิน', 'Mean', 'S.D.', 'ความหมาย']],
                body: grandTotalData,
                ...tableStyles,
                didParseCell: function (data) {
                    // Style grand total row
                    if (data.row.index === grandTotalData.length - 1) {
                        data.cell.styles.fontStyle = 'bold';
                        data.cell.styles.fillColor = [59, 130, 246];
                        data.cell.styles.textColor = 255;
                    }
                }
            });

            // Save PDF
            const fileName = `ผลการประเมินความพึงพอใจ_${now.toISOString().split('T')[0]}.pdf`;
            doc.save(fileName);

        } catch (err) {
            console.error('Error exporting PDF:', err);
            alert('เกิดข้อผิดพลาดในการส่งออก PDF');
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

                <div className="back-button-container">
                    {stats?.total > 0 && (
                        <Button
                            variant="primary"
                            onClick={exportToPDF}
                            disabled={exporting}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            <FaFilePdf />
                            {exporting ? 'กำลังส่งออก...' : 'ส่งออก PDF'}
                        </Button>
                    )}
                    <Button variant="secondary" onClick={() => navigate('/')}>
                        กลับหน้าหลัก
                    </Button>
                </div>
            </div>
        </div>
    );
}
