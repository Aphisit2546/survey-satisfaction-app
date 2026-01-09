// ============================================
// Button Component
// ============================================
import './Button.css';

export default function Button({
    children,
    type = 'button',
    variant = 'primary',
    onClick,
    disabled = false,
    loading = false,
    fullWidth = false,
    ...props
}) {
    const handleClick = (e) => {
        if (!disabled && !loading && onClick) {
            onClick(e);
        }
    };

    return (
        <button
            type={type}
            className={`btn btn-${variant} ${fullWidth ? 'btn-full-width' : ''} ${loading ? 'btn-loading' : ''
                }`}
            onClick={handleClick}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <>
                    <span className="spinner"></span>
                    <span>กำลังส่ง...</span>
                </>
            ) : (
                children
            )}
        </button>
    );
}