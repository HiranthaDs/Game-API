// GameScreen.jsx
// High Cohesion: Orchestrates the game area, the canvas size updates, and user interactions.
import { useState, useRef, useEffect } from 'react';
import GameCanvas from './GameCanvas';
import SideLeaderboard from './SideLeaderboard';
import { saveUserScore } from '../services/leaderboardService';

export default function GameScreen({ 
    user, 
    score, 
    snake, 
    food, 
    direction, 
    GRID_SIZE, 
    changeDirection, 
    onExit 
}) {
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    
    // Swipe Control Refs
    const touchStartRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.code)) {
                e.preventDefault(); // Prevent scrolling
            }
            if (e.code === "ArrowLeft") changeDirection("LEFT");
            if (e.code === "ArrowUp") changeDirection("UP");
            if (e.code === "ArrowRight") changeDirection("RIGHT");
            if (e.code === "ArrowDown") changeDirection("DOWN");
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [changeDirection]);

    const handleTouchStart = (e) => {
        touchStartRef.current = {
            x: e.changedTouches[0].screenX,
            y: e.changedTouches[0].screenY
        };
    };

    const handleTouchEnd = (e) => {
        let touchEndX = e.changedTouches[0].screenX;
        let touchEndY = e.changedTouches[0].screenY;
        
        let dx = touchEndX - touchStartRef.current.x;
        let dy = touchEndY - touchStartRef.current.y;
        
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 30) changeDirection('RIGHT');
            else if (dx < -30) changeDirection('LEFT');
        } else {
            if (dy > 30) changeDirection('DOWN');
            else if (dy < -30) changeDirection('UP');
        }
    };

    const handleSaveData = async () => {
        setSaving(true);
        try {
            await saveUserScore(user.name, user.email, score);
            setSaved(true);
            alert(`Data Saved! A clearance email has been dispatched to ${user.email}`);
            setTimeout(() => setSaved(false), 4000);
        } catch (error) {
            alert(error.message || "Failed to save score");
        }
        setSaving(false);
    };

    return (
        <div className="screen-layout arena-layout animate-pop-in">
            {/* Left Column: Game Area */}
            <div className="game-col">
                {/* Header / Dashboard Bar */}
                <div className="dash-header" style={{marginBottom: '1rem'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                        <h2 className="dash-title" style={{margin: 0}}>Heart Game API</h2>
                        <button onClick={handleSaveData} disabled={saving} className={`btn btn-save ${saved ? 'success' : ''}`}>
                            {saving ? (
                                <>
                                    <svg className="svg-icon animate-spin" style={{width: '1rem', height: '1rem'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
                                    <span>Saving...</span>
                                </>
                            ) : saved ? (
                                <>
                                    <svg className="svg-icon" style={{width: '1rem', height: '1rem'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                    <span>Saved!</span>
                                </>
                            ) : (
                                <>
                                    <svg className="svg-icon" style={{width: '1rem', height: '1rem'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                                    <span>Save Data</span>
                                </>
                            )}
                        </button>
                    </div>
                    
                    <button onClick={onExit} className="btn btn-action" title="Exit to Menu">
                        <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                    </button>
                </div>

                {/* Stats Dashboard */}
                <div className="stats-grid">
                    <div className="stat-box">
                        <span className="stat-label">Player Name</span>
                        <span className="stat-value">{user.name}</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-label">Your Score</span>
                        <span className="stat-value blue">{score}</span>
                    </div>
                </div>

                {/* Inner Glass Arena (Canvas) */}
                <div 
                    className="canvas-wrapper" 
                    onTouchStart={handleTouchStart} 
                    onTouchEnd={handleTouchEnd}
                >
                    <GameCanvas 
                        snake={snake} 
                        food={food} 
                        score={score} 
                        GRID_SIZE={GRID_SIZE} 
                        direction={direction} 
                    />
                </div>
            </div>

            {/* Right Column: In-Game Leaderboard */}
            <SideLeaderboard />
        </div>
    );
}
