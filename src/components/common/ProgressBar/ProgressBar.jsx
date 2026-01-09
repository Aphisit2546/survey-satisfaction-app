import './ProgressBar.css';

const STEPS = [
    { id: 1, label: 'คำชี้แจง' },
    { id: 2, label: 'ข้อมูลทั่วไป' },
    { id: 3, label: 'ด้านการออกแบบ' },
    { id: 4, label: 'ด้านคุณภาพ' },
    { id: 5, label: 'ด้านการใช้งาน' },
    { id: 6, label: 'ด้านประโยชน์' },
    { id: 7, label: 'ข้อเสนอแนะ' },
];

export default function ProgressBar({ currentStep }) {
    return (
        <div className="stepper-container">
            {STEPS.map((step, index) => {
                const isActive = step.id === currentStep;
                const isCompleted = step.id < currentStep;

                return (
                    <div
                        key={step.id}
                        className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                    >
                        {/* Connecting Line (except for first item) */}
                        {index > 0 && <div className="step-line"></div>}

                        <div className="step-content">
                            <div className="step-circle">
                                {step.id}
                            </div>
                            <span className="step-label">{step.label}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
