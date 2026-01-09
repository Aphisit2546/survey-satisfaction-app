// ============================================
// StarRating Component
// ============================================
import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import './StarRating.css';

export default function StarRating({
    name,
    value = 0,
    onChange,
    error,
    disabled = false
}) {
    const [hover, setHover] = useState(0);

    const handleClick = (rating) => {
        if (!disabled && onChange) {
            onChange(name, rating);
        }
    };

    return (
        <div className="star-rating-container">
            <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        className={`star-button ${disabled ? 'disabled' : ''}`}
                        onClick={() => handleClick(star)}
                        onMouseEnter={() => !disabled && setHover(star)}
                        onMouseLeave={() => !disabled && setHover(0)}
                        disabled={disabled}
                        aria-label={`${star} star${star > 1 ? 's' : ''}`}
                    >
                        <FaStar
                            className={`star-icon ${star <= (hover || value) ? 'filled' : 'empty'
                                }`}
                            size={32}
                        />
                    </button>
                ))}
            </div>

            {value > 0 && (
                <span className="rating-label">
                    {value} {value === 1 ? 'ดาว' : 'ดาว'}
                </span>
            )}

            {error && <div className="star-error">{error}</div>}
        </div>
    );
}