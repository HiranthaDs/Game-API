// SideLeaderboard.jsx
import { useState, useEffect, useCallback } from 'react';
import { fetchLeaderboard } from '../services/leaderboardService';

export default function SideLeaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(() => {
        setLoading(true);
        fetchLeaderboard().then(data => {
            setLeaderboard(data);
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return (
        <div className="side-leaderboard animate-pop-in">
            <div className="side-lb-header">
                <h3 className="side-lb-title">
                    <svg className="svg-icon" style={{color: 'var(--primary)', width: '1rem', height: '1rem'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                    Live Rankings
                </h3>
                <button onClick={loadData} className="btn" style={{padding: '0.25rem', color: 'var(--text-light)', background: 'transparent'}} title="Refresh">
                    <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                        <path d="M3 3v5h5"/>
                    </svg>
                </button>
            </div>
            
            <div className="side-lb-body hide-scrollbar">
                {loading && (
                    <div className="loader-overlay" id="inGameDashboardLoader">
                        <svg className="svg-icon animate-spin" style={{marginBottom: '0.5rem', color: 'var(--primary)'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
                        </svg>
                    </div>
                )}
                
                <table className="mini-table">
                    <tbody>
                        {!loading && leaderboard.length === 0 && (
                            <tr><td colSpan="3" style={{textAlign: 'center', padding: '1.5rem', color: 'var(--text-light)'}}>No scores yet.</td></tr>
                        )}
                        {!loading && leaderboard.map((item, index) => (
                            <tr key={index}>
                                <td className="rank-col" style={{width: '2.5rem'}}>#{index + 1}</td>
                                <td>
                                    <span className="truncate" style={{display: 'inline-block', verticalAlign: 'middle', maxWidth: '100px'}}>{item.name}</span>
                                </td>
                                <td className="score-col" style={{fontSize: '0.875rem'}}>{item.score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
