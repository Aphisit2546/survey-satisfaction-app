// ============================================
// Input Component
// ============================================
import './Input.css';

export default function Input({
    name,
    type = 'text',
    value,
    onChange,
    placeholder,
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
        <div className="input-wrapper">
            <input
                type={type}
                name={name}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                className={`input-field ${error ? 'input-error' : ''}`}
                {...props}
            />
            {error && <div className="error-message">{error}</div>}
        </div>
    );
}