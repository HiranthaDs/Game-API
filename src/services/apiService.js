// apiService.js
// ==========================================
// ARCHITECTURE NOTE: HIGH COHESION (Data Access Layer)
// HIGH COHESION: This module is strictly responsible for performing HTTP fetch requests. 
// It centralizes error handling, JSON parsing, and text parsing for the entire application.
// LOW COUPLING: Specialized services do not need to implement their own `try/catch` fetch blocks,
// they just use these pure functions.
// ==========================================

export async function get(url, returnType = 'json') {
    const response = await fetch(url);
    if (!response.ok) throw new Error("API Network error");
    return returnType === 'json' ? await response.json() : await response.text();
}

export async function postForm(url, formData) {
    const response = await fetch(url, {
        method: 'POST',
        body: formData
    });
    if (!response.ok) throw new Error("API Network error");
    return await response.text();
}
