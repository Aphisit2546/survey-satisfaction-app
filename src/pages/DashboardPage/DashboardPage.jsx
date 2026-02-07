// ============================================
// DashboardPage Component
// ============================================
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFilePdf, FaTimes, FaDownload, FaCheckCircle } from 'react-icons/fa';
import { fetchAllResponses } from '../../services/supabaseClient';
import Button from '../../components/common/Button/Button';
import {
    DESIGN_QUESTIONS,
    QUALITY_QUESTIONS,
    USABILITY_QUESTIONS,
    USEFULNESS_QUESTIONS
} from '../../utils/constants';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import ReportPDF from '../../components/report/ReportPDF/ReportPDF';
import './DashboardPage.css';

// Register Chart.js components
ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);

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

    // Export Official PDF Report using html2canvas
    const exportOfficialPDF = async () => {
        if (!stats || stats.total === 0) {
            alert('ไม่มีข้อมูลสำหรับส่งออก');
            return;
        }

        setExporting(true);
        setExportStatus('pdf');

        try {
            const reportElement = document.getElementById('report-pdf-content');
            if (!reportElement) {
                throw new Error('Report element not found');
            }

            // Use html2canvas with high resolution
            const canvas = await html2canvas(reportElement, {
                scale: 3,
                backgroundColor: '#ffffff',
                useCORS: true,
                allowTaint: true,
                logging: false
            });

            const imgData = canvas.toDataURL('image/png');

            // Create PDF with A4 size
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            // Calculate dimensions to fit the image on A4
            const imgWidth = pageWidth - 20; // 10mm margin on each side
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // Handle multi-page if content is taller than one page
            let yPos = 10;
            const maxHeight = pageHeight - 20;

            if (imgHeight <= maxHeight) {
                // Single page
                pdf.addImage(imgData, 'PNG', 10, yPos, imgWidth, imgHeight);
            } else {
                // Scale to fit one page
                const scaledHeight = maxHeight;
                const scaledWidth = (canvas.width * scaledHeight) / canvas.height;
                pdf.addImage(imgData, 'PNG', (pageWidth - scaledWidth) / 2, yPos, scaledWidth, scaledHeight);
            }

            // Save PDF
            const now = new Date();
            const fileName = `Survey_Official_Report_${now.toISOString().split('T')[0]}.pdf`;
            pdf.save(fileName);

            setExportStatus('complete');
            setTimeout(() => {
                setExportStatus(null);
            }, 2000);

        } catch (err) {
            console.error('Error exporting official PDF:', err);
            alert('เกิดข้อผิดพลาดในการส่งออกรายงานทางการ: ' + err.message);
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
                            onClick={exportOfficialPDF}
                            disabled={exporting}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#003366' }}
                        >
                            <FaFilePdf /> ดาวน์โหลด PDF
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

                    {/* Charts Section */}
                    {stats?.total > 0 && (
                        <section className="charts-section">
                            <h2 className="aspect-title">แผนภูมิสรุปผลการประเมิน</h2>
                            <div className="charts-container">
                                {/* Bar Chart */}
                                <div className="chart-card">
                                    <h3 className="chart-title">แผนภูมิแท่งแสดงค่าเฉลี่ยความพึงพอใจแต่ละด้าน</h3>
                                    <div className="chart-wrapper">
                                        <Bar
                                            data={{
                                                labels: ['ด้านการออกแบบ', 'ด้านคุณภาพระบบ', 'ด้านการใช้งาน', 'ด้านประโยชน์'],
                                                datasets: [{
                                                    label: 'ค่าเฉลี่ย (Mean)',
                                                    data: [
                                                        parseFloat(stats?.design?.summary?.mean || 0),
                                                        parseFloat(stats?.quality?.summary?.mean || 0),
                                                        parseFloat(stats?.usability?.summary?.mean || 0),
                                                        parseFloat(stats?.usefulness?.summary?.mean || 0)
                                                    ],
                                                    backgroundColor: 'rgba(59, 130, 246, 0.7)',
                                                    borderColor: 'rgb(59, 130, 246)',
                                                    borderWidth: 1,
                                                    borderRadius: 4,
                                                    barThickness: 50
                                                }]
                                            }}
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                plugins: {
                                                    legend: {
                                                        display: true,
                                                        position: 'top',
                                                        align: 'end',
                                                        labels: {
                                                            boxWidth: 12,
                                                            padding: 15,
                                                            font: {
                                                                size: 12
                                                            }
                                                        }
                                                    },
                                                    title: {
                                                        display: false
                                                    },
                                                    tooltip: {
                                                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                                        titleFont: { size: 13 },
                                                        bodyFont: { size: 12 },
                                                        padding: 10,
                                                        callbacks: {
                                                            label: (context) => `ค่าเฉลี่ย: ${context.raw.toFixed(2)} คะแนน`
                                                        }
                                                    },
                                                    datalabels: {
                                                        anchor: 'end',
                                                        align: 'top',
                                                        offset: 4,
                                                        color: '#374151',
                                                        font: {
                                                            weight: '600',
                                                            size: 13
                                                        },
                                                        formatter: (value) => value.toFixed(2)
                                                    }
                                                },
                                                scales: {
                                                    x: {
                                                        grid: {
                                                            display: false
                                                        },
                                                        ticks: {
                                                            font: {
                                                                size: 11
                                                            },
                                                            color: '#4b5563'
                                                        }
                                                    },
                                                    y: {
                                                        beginAtZero: true,
                                                        max: 5,
                                                        ticks: {
                                                            stepSize: 1,
                                                            font: {
                                                                size: 11
                                                            },
                                                            color: '#4b5563'
                                                        },
                                                        grid: {
                                                            color: '#e5e7eb',
                                                            drawBorder: false
                                                        },
                                                        title: {
                                                            display: true,
                                                            text: 'คะแนนเฉลี่ย (1-5)',
                                                            font: {
                                                                size: 12,
                                                                weight: '500'
                                                            },
                                                            color: '#374151'
                                                        }
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Pie Chart */}
                                <div className="chart-card">
                                    <h3 className="chart-title">แผนภูมิวงกลมแสดงสัดส่วนคะแนนแต่ละด้าน</h3>
                                    <div className="chart-wrapper">
                                        <Pie
                                            data={{
                                                labels: ['ด้านการออกแบบ', 'ด้านคุณภาพระบบ', 'ด้านการใช้งาน', 'ด้านประโยชน์'],
                                                datasets: [{
                                                    data: [
                                                        parseFloat(stats?.design?.summary?.mean || 0),
                                                        parseFloat(stats?.quality?.summary?.mean || 0),
                                                        parseFloat(stats?.usability?.summary?.mean || 0),
                                                        parseFloat(stats?.usefulness?.summary?.mean || 0)
                                                    ],
                                                    backgroundColor: [
                                                        'rgba(59, 130, 246, 0.85)',
                                                        'rgba(34, 197, 94, 0.85)',
                                                        'rgba(249, 115, 22, 0.85)',
                                                        'rgba(168, 85, 247, 0.85)'
                                                    ],
                                                    borderColor: [
                                                        'rgb(59, 130, 246)',
                                                        'rgb(34, 197, 94)',
                                                        'rgb(249, 115, 22)',
                                                        'rgb(168, 85, 247)'
                                                    ],
                                                    borderWidth: 2,
                                                    hoverOffset: 8
                                                }]
                                            }}
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                layout: {
                                                    padding: {
                                                        top: 10,
                                                        bottom: 10
                                                    }
                                                },
                                                plugins: {
                                                    legend: {
                                                        position: 'right',
                                                        align: 'center',
                                                        labels: {
                                                            boxWidth: 14,
                                                            padding: 16,
                                                            font: {
                                                                size: 12
                                                            },
                                                            usePointStyle: true,
                                                            pointStyle: 'rectRounded'
                                                        }
                                                    },
                                                    tooltip: {
                                                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                                        titleFont: { size: 13 },
                                                        bodyFont: { size: 12 },
                                                        padding: 10,
                                                        callbacks: {
                                                            label: (context) => {
                                                                const label = context.label || '';
                                                                const value = context.raw.toFixed(2);
                                                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                                                const percentage = ((context.raw / total) * 100).toFixed(1);
                                                                return `${label}: ${value} (${percentage}%)`;
                                                            }
                                                        }
                                                    },
                                                    datalabels: {
                                                        color: '#ffffff',
                                                        font: {
                                                            weight: '600',
                                                            size: 12
                                                        },
                                                        formatter: (value, context) => {
                                                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                                            const percentage = ((value / total) * 100).toFixed(0);
                                                            return `${value.toFixed(2)}\n(${percentage}%)`;
                                                        },
                                                        textAlign: 'center'
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

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

                {/* Hidden ReportPDF for export */}
                {stats?.total > 0 && (
                    <div className="report-hidden-container">
                        <ReportPDF stats={stats} getInterpretation={getInterpretation} />
                    </div>
                )}
            </div>
        </div>
    );
}
