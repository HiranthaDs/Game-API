// heartGameService.js
// ==========================================
// ARCHITECTURE NOTE: HIGH COHESION
// HIGH COHESION: This entire file only cares about interacting with the Heart Game API. 
// It utilizes `apiService` for the actual network call, and handles formatting the response.
// ==========================================

import { get } from './apiService';

export async function fetchHeartChallenge() {
    try {
        const data = await get('https://marcconrad.com/uob/heart/api.php');
        
        let imgUrl = data.question;
        if (!imgUrl.startsWith('http')) {
            imgUrl = 'https://marcconrad.com/uob/heart/' + imgUrl;
        }
        
        return {
            success: true,
            imageUrl: imgUrl,
            solution: data.solution
        };

    } catch (error) {
        console.error("Heart Challenge API Error:", error);
        // Fallback
        return {
            success: false,
            imageUrl: 'https://marcconrad.com/uob/heart/img/4.png',
            solution: 4
        };
    }
}
