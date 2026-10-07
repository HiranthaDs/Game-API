// HeartGameAPI.jsx
// ==========================================
// ARCHITECTURE NOTE: LOW COUPLING
// This screen doesn't perform the API request to fetch the heart challenge. It simply accepts 
// `challengeImage` as a string and an `onAnswer` callback. This makes it a "dumb" presentational 
// component that is highly reusable and easy to test.
// ==========================================

export default function HeartGameAPI({ challengeImage, onAnswer, loading, shakeMode }) {
    return (
        <div className="penalty-overlay animate-fade-in">
            <div className={`penalty-modal animate-slide-up ${shakeMode ? 'animate-shake' : ''}`}>
                <div className="mobile-handle">
                    <div></div>
                </div>
                
                <div className="penalty-left">
                    <div className="penalty-header">
                        <div className="warning-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                        </div>
                        <h2 className="penalty-title">Heart Check Required</h2>
                        <p className="penalty-desc">
                            Game Over! You crashed. Count the hearts correctly to respawn. You only have <strong className="text-orange">ONE chance!</strong>
                        </p>
                    </div>

                    <div className="image-container">
                        {loading ? (
                            <div className="loader-overlay" style={{background: 'white', borderRadius: '32px'}}>
                                <svg className="svg-icon animate-spin" style={{marginBottom: '0.5rem', color: 'var(--text-light)'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
                                </svg>
                                <span style={{fontSize: '0.875rem', fontWeight: 500}}>Connecting...</span>
                            </div>
                        ) : (
                            <img src={challengeImage} alt="Count the hearts" className="challenge-img" />
                        )}
                    </div>
                </div>

                <div className="penalty-right">
                    <div className="numpad">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                            <button key={num} onClick={() => onAnswer(num)} disabled={shakeMode} className="num-btn">{num}</button>
                        ))}
                        <button onClick={() => onAnswer(0)} disabled={shakeMode} className="num-btn col-start-2">0</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
