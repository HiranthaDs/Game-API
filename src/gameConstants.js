// gameConstants.js
// ==========================================
// ARCHITECTURE NOTE: LOW COUPLING
// By extracting magic numbers (grid sizes, speeds, default points) into a purely data-driven
// file, we decouple the rules of the game from the engine of the game. 
// You can change difficulty and pacing here without touching `useSnakeGame.js` or `App.jsx`.
// ==========================================

export const GAME_CONFIG = {
    GRID_SIZE: 20,
    INITIAL_SNAKE_LENGTH: 3,
    INITIAL_SCORE: 0,
    BASE_SPEED_MS: 130,
    POINTS_PER_FOOD: 1,
    PENALTY_FAILED_WAIT_MS: 600,
    AUTO_SAVE_WAIT_MS: 2500,
};

export const SCREENS = {
    START: 'start',
    DASHBOARD: 'dashboard',
    PLAYING: 'screen-playing',
    PENALTY: 'screen-penalty'
};
