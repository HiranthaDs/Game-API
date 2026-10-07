// useGameState.js
import { useState, useCallback } from 'react';
import { SCREENS } from '../gameConstants';

export function useGameState() {
    const [currentScreen, setCurrentScreen] = useState(SCREENS.START); 
    const [user, setUser] = useState({ name: '', email: '' });
    const [gameOverState, setGameOverState] = useState(false); // Whether the final popup is showing

    const switchScreen = useCallback((screenId) => {
        setCurrentScreen(screenId);
    }, []);

    const loginUser = useCallback((name, email) => {
        setUser({ name, email });
    }, []);

    const showGameOver = useCallback(() => {
        setGameOverState(true);
    }, []);

    const hideGameOver = useCallback(() => {
        setGameOverState(false);
    }, []);

    const resetUser = useCallback(() => {
        setUser({ name: '', email: '' });
    }, []);

    return {
        currentScreen,
        switchScreen,
        user,
        loginUser,
        resetUser,
        gameOverState,
        showGameOver,
        hideGameOver
    };
}
