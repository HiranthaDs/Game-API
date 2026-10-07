// StartScreen.jsx
// ==========================================
// ARCHITECTURE NOTE: LOW COUPLING
// This screen acts only as a View. It contains input fields for email/name, but doesn't handle 
// the actual API communication. When a user logs in via Google, it triggers `signInWithGoogle()` 
// from `authService`. It then broadcasts an `onStartGame(name, email)` event up to `App.jsx`.
// It is completely decoupled from the Snake Game engine and the Leaderboard parsing logic.
// ==========================================
import { useState } from 'react';
import { signInWithGoogle } from '../services/authService';

export default function StartScreen({ onStartGame, onShowDashboard }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleManualStart = () => {
        if (!name || !email) {
            alert("Please enter both Name and Email to proceed.");
            return;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }
        onStartGame(name, email);
    };

    const handleGoogleSignIn = async () => {
        const result = await signInWithGoogle();
        if (result.success) {
            onStartGame(result.user.name, result.user.email);
        } else {
            alert(result.error);
        }
    };

    return (
        <div className="screen-layout centered-content animate-pop-in">
            <div className="logo-box squircle">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
            </div>
            
            <div style={{ textAlign: 'center', width: '100%' }}>
                <h1 className="start-title">Heart Game API</h1>
                <p className="start-desc">
                    Play Snake! Eat food to earn points. If you hit a wall or yourself, complete a visual challenge to continue.
                </p>
            </div>

            <div className="start-form">
                <input 
                    type="text" 
                    placeholder="Enter Player Name" 
                    className="input-field"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <input 
                    type="email" 
                    placeholder="Enter Email Address" 
                    className="input-field"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                
                <div style={{ display: 'flex', gap: '0.5rem', width: '100%', marginTop: '0.25rem' }}>
                    <button onClick={handleManualStart} className="btn btn-primary">Start Game</button>
                    <button onClick={onShowDashboard} className="btn btn-icon" title="Score Dashboard">
                        <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 20V10M12 20V4M6 20v-4"/>
                        </svg>
                    </button>
                </div>

                <div className="divider">
                    <div className="divider-line"></div>
                    <span className="divider-text">or</span>
                    <div className="divider-line"></div>
                </div>

                <button onClick={handleGoogleSignIn} className="btn btn-google">
                    <svg className="svg-icon" style={{width: '1.25rem', height: '1.25rem'}} viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign in with Google
                </button>
                
                <p className="dev-credit">Developed by A A H DIAS • ID: 2433350</p>
            </div>
        </div>
    );
}
