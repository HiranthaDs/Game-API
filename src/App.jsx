// App.jsx
// ==========================================
// ARCHITECTURE NOTE: ORCHESTRATOR
// This is where HIGH COHESION and LOW COUPLING meet.
// The `useSnakeGame` and `useGameState` hooks encapsulate all complex state (High Cohesion).
// The UI components like `GameScreen` and `StartScreen` are strictly visual (Low Coupling).
// `App.jsx` acts purely as the Controller/Orchestrator, passing the state from the hooks down 
// into the props of the UI components.
// ==========================================
// The UI components do not fetch or process data internally, keeping them decoupled.

import { useState, useCallback, useEffect } from 'react';
import { useGameState } from './hooks/useGameState';
import { useSnakeGame } from './hooks/useSnakeGame';
import { fetchHeartChallenge } from './services/heartGameService';

import StartScreen from './components/StartScreen';
import DashboardScreen from './components/DashboardScreen';
import GameScreen from './components/GameScreen';
import HeartGameAPI from './components/HeartGameAPI';
import GameOverPopup from './components/GameOverPopup';
import { saveUserScore } from './services/leaderboardService';
import { SCREENS, GAME_CONFIG } from './gameConstants';

function App() {
    const {
        currentScreen,
        switchScreen,
        user,
        loginUser,
        resetUser,
        gameOverState,
        showGameOver,
        hideGameOver
    } = useGameState();

    const [penaltyData, setPenaltyData] = useState({ loading: false, imageUrl: '', solution: -1, shakeAuth: false });

    // Handle what happens when snake crashes
    const handleGameOver = useCallback((finalScore) => {
        // Stop the game loop and transition to penalty
        switchScreen(SCREENS.PENALTY);
        setPenaltyData({ loading: true, imageUrl: '', solution: -1, shakeAuth: false });
        
        fetchHeartChallenge().then(challenge => {
            setPenaltyData({
                loading: false,
                imageUrl: challenge.imageUrl,
                solution: challenge.solution,
                shakeAuth: false
            });
        });
    }, [switchScreen]);

    const {
        snake,
        food,
        score,
        direction,
        changeDirection,
        resetSnakeGame,
        resumeSnakeGame,
        stopGame,
        GRID_SIZE
    } = useSnakeGame({ onGameOver: handleGameOver });

    // Component event handlers
    const handleStartGame = (name, email) => {
        loginUser(name, email);
        switchScreen(SCREENS.PLAYING);
        resetSnakeGame(GAME_CONFIG.INITIAL_SCORE);
    };

    const handleExitToMenu = () => {
        stopGame();
        resetUser();
        switchScreen(SCREENS.START);
    };

    const handlePenaltyAnswer = (num) => {
        if (penaltyData.solution === -1) return; // Still loading

        if (num === penaltyData.solution) {
            // Correct - return to game
            switchScreen(SCREENS.PLAYING);
            resumeSnakeGame(score);
        } else {
            // Incorrect - Game Over sequence
            setPenaltyData(prev => ({ ...prev, shakeAuth: true }));
            
            setTimeout(() => {
                setPenaltyData(prev => ({ ...prev, shakeAuth: false }));
                showGameOver();
                
                // Auto-save the score after delay, then return to start
                setTimeout(() => {
                    saveUserScore(user.name, user.email, score).catch(e => console.error(e));
                    hideGameOver();
                    resetUser();
                    switchScreen(SCREENS.START);
                }, GAME_CONFIG.AUTO_SAVE_WAIT_MS);

            }, GAME_CONFIG.PENALTY_FAILED_WAIT_MS);
        }
    };

    // Render logic - conditionally rendering based on state
    return (
        <div className="main-wrapper">
            {/* Mesh Gradient Background (retained from original) */}
            <div className="mesh-bg">
                <div className="blob-1"></div>
                <div className="blob-2"></div>
            </div>

            <div className="glass-panel">
                {currentScreen === SCREENS.START && (
                    <StartScreen 
                        onStartGame={handleStartGame} 
                        onShowDashboard={() => switchScreen(SCREENS.DASHBOARD)} 
                    />
                )}

                {currentScreen === SCREENS.DASHBOARD && (
                    <DashboardScreen 
                        onBack={() => switchScreen(SCREENS.START)} 
                    />
                )}

                {currentScreen === SCREENS.PLAYING && (
                    <GameScreen 
                        user={user}
                        score={score}
                        snake={snake}
                        food={food}
                        direction={direction}
                        GRID_SIZE={GRID_SIZE}
                        changeDirection={changeDirection}
                        onExit={handleExitToMenu}
                    />
                )}

                {currentScreen === SCREENS.PENALTY && (
                    <HeartGameAPI 
                        challengeImage={penaltyData.imageUrl}
                        loading={penaltyData.loading}
                        shakeMode={penaltyData.shakeAuth}
                        onAnswer={handlePenaltyAnswer}
                    />
                )}

                {gameOverState && (
                    <GameOverPopup finalScore={score} />
                )}
            </div>
        </div>
    );
}

export default App;
