// DashboardScreen.jsx
// Low Coupling: Displays data passed into it, calls an update function when explicitly told to.
import { useState, useEffect } from 'react';
import { fetchLeaderboard } from '../services/leaderboardService';

export default function DashboardScreen({ onBack }) {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        fetchLeaderboard().then(data => {
            if (mounted) {
                setLeaderboard(data);
                setLoading(false);
            }
        }).catch(() => {
            if (mounted) {
                setError(true);
                setLoading(false);
            }
        });
        return () => mounted = false;
    }, []);

    return (
        <div className="screen-layout animate-pop-in dashboard-container">
            <div className="dash-header">
                <h2 className="dash-title">Global Leaderboard</h2>
                <button onClick={onBack} className="btn btn-action">
                    <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                </button>
            </div>
            
            <div className="table-card hide-scrollbar">
                {loading && (
                    <div className="loader-overlay">
                        <svg className="svg-icon animate-spin" style={{marginBottom: '0.75rem', width: '2rem', height: '2rem', color: 'var(--primary)'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
                        </svg>
                        <span style={{fontWeight: 500}}>Syncing live scores...</span>
                    </div>
                )}
                {error && (
                    <div className="loader-overlay">
                        <span style={{color: 'var(--danger)', fontWeight: 500}}>Failed to load scores.</span>
                    </div>
                )}
                {!loading && !error && (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Player Name</th>
                                <th style={{textAlign: 'right'}}>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboard.length === 0 ? (
                                <tr>
                                    <td colSpan="3" style={{textAlign: 'center', padding: '1.5rem', color: 'var(--text-light)'}}>
                                        No scores yet. Be the first!
                                    </td>
                                </tr>
                            ) : (
                                leaderboard.map((item, index) => (
                                    <tr key={index}>
                                        <td className="rank-col">#{index + 1}</td>
                                        <td className="player-col">
                                            <div className="avatar">{item.name.charAt(0).toUpperCase()}</div>
                                            <span className="truncate">{item.name}</span>
                                        </td>
                                        <td className="score-col">{item.score}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
