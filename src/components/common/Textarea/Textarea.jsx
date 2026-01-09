// ============================================
// Textarea Component
// ============================================
import './Textarea.css';

export default function Textarea({
    name,
    value,
    onChange,
    placeholder,
    error,
    disabled = false,
    required = false,
    rows = 4,
    maxLength,
    ...props
}) {
    const handleChange = (e) => {
        if (onChange) {
            onChange(name, e.target.value);
        }
    };

    return (
        <div className="textarea-wrapper">
            <textarea
                name={name}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                rows={rows}
                maxLength={maxLength}
                className={`textarea-field ${error ? 'textarea-error' : ''}`}
                {...props}
            />
            {maxLength && (
                <div className="character-count">
                    {value?.length || 0} / {maxLength}
                </div>
            )}
            {error && <div className="error-message">{error}</div>}
        </div>
    );
}