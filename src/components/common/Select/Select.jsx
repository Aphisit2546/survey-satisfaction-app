// ============================================
// Select Component
// ============================================
import './Select.css';

export default function Select({
    name,
    value,
    onChange,
    options = [],
    placeholder = 'กรุณาเลือก...',
    error,
    disabled = false,
    required = false,
    ...props
}) {
    const handleChange = (e) => {
        if (onChange) {
            onChange(name, e.target.value);
        }
    };

    return (
        <div className="select-wrapper">
            <select
                name={name}
                value={value}
                onChange={handleChange}
                disabled={disabled}
                required={required}
                className={`select-field ${error ? 'select-error' : ''}`}
                {...props}
            >
                <option value="" disabled>
                    {placeholder}
                </option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <div className="error-message">{error}</div>}
        </div>
    );
}