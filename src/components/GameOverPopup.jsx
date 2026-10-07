// GameOverPopup.jsx
// Low Coupling: Presents game over data, completely stateless popup wrapper.

export default function GameOverPopup({ finalScore }) {
    return (
        <div className="popup-overlay animate-fade-in">
            <div className="popup-modal animate-pop-in">
                <div className="popup-icon">
                    <svg className="svg-icon" style={{width: '2.5rem', height: '2.5rem'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                </div>
                <h3 className="popup-title">Incorrect!</h3>
                <p className="popup-text">
                    Game Over. You ran out of chances. Automatically saving your final score of <strong className="popup-score">{finalScore}</strong>...
                </p>
                <div className="popup-status">
                    <svg className="svg-icon animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
                    </svg>
                    <span>Saving Data...</span>
                </div>
            </div>
        </div>
    );
}
