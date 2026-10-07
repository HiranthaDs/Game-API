// leaderboardService.js
// ==========================================
// ARCHITECTURE NOTE: HIGH COHESION & LOW COUPLING
// HIGH COHESION: This entire module does exactly one job: Google Sheets interactions.
// It leverages `apiService` for decoupling the network layer.
// ==========================================

import { get, postForm } from './apiService';

const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL; 
const CSV_LEADERBOARD_URL = import.meta.env.VITE_CSV_LEADERBOARD_URL;

export async function fetchLeaderboard() {
    try {
        const csvText = await get(CSV_LEADERBOARD_URL, 'text');
        
        const rows = csvText.split(/\r?\n/);
        const dataRows = rows.slice(1).filter(r => r.trim().length > 0);
        
        const leaderboard = dataRows.map(r => {
            const cols = r.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            return {
                name: cols[1] ? cols[1].replace(/^"|"$/g, '').trim() : "Unknown",
                score: parseInt(cols[3]) || 0
            };
        }).sort((a, b) => b.score - a.score);
        
        return leaderboard.slice(0, 15);
    } catch (error) {
        console.error("Dashboard Load Error:", error);
        throw new Error("Failed to load scores.");
    }
}

export async function saveUserScore(name, email, score) {
    if (APPS_SCRIPT_URL === "YOUR_APP_SCRIPT_WEB_APP_URL_HERE") {
        throw new Error("Please add your Google Apps Script URL in the code to enable saving.");
    }

    const formData = new URLSearchParams();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('score', score);

    try {
        const text = await postForm(APPS_SCRIPT_URL, formData);
        return JSON.parse(text);
    } catch(error) {
        console.error('Error saving score:', error);
        throw new Error("Failed to save score or send email.");
    }
}
