// useSnakeGame.js
// ==========================================
// ARCHITECTURE NOTE: HIGH COHESION & LOW COUPLING
// HIGH COHESION: This hook groups EVERY mathematical calculation related specifically to Snake (grid bounds, 
// collision detection, food placement, coordinate math) into ONE single module.
// LOW COUPLING: This file doesn't import any UI. It doesn't know about `canvas` or React DOM elements. 
// It returns a strictly typed interface of variables (`snake`, `food`, etc.) which any UI can consume.
// ==========================================
import { useState, useEffect, useRef, useCallback } from 'react';
import { GAME_CONFIG } from '../gameConstants';

const GRID_SIZE = GAME_CONFIG.GRID_SIZE;

export function useSnakeGame({ onGameOver, onScoreChange }) {
    const [snake, setSnake] = useState([]);
    const [food, setFood] = useState({ x: 15, y: 15 });
    const [score, setScore] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [direction, setDirection] = useState("RIGHT");
    
    const directionRef = useRef("RIGHT");
    const nextDirectionRef = useRef("RIGHT");
    const isRunningRef = useRef(false);
    const scoreRef = useRef(0);
    const snakeRef = useRef([]);
    const foodRef = useRef({ x: 15, y: 15 });

    useEffect(() => {
        isRunningRef.current = isRunning;
        scoreRef.current = score;
        snakeRef.current = snake;
        foodRef.current = food;
    }, [isRunning, score, snake, food]);

    const changeDirection = useCallback((newD) => {
        if (!isRunningRef.current) return;
        const d = directionRef.current;
        if (newD === "LEFT" && d !== "RIGHT") nextDirectionRef.current = "LEFT";
        if (newD === "UP" && d !== "DOWN") nextDirectionRef.current = "UP";
        if (newD === "RIGHT" && d !== "LEFT") nextDirectionRef.current = "RIGHT";
        if (newD === "DOWN" && d !== "UP") nextDirectionRef.current = "DOWN";
    }, []);

    const placeFood = useCallback((currentSnake) => {
        let valid = false;
        let newFood = { x: 0, y: 0 };
        while(!valid) {
            newFood = {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE)
            };
            valid = true;
            for(let part of currentSnake) {
                if(part.x === newFood.x && part.y === newFood.y) valid = false;
            }
        }
        setFood(newFood);
        foodRef.current = newFood;
        return newFood;
    }, []);

    const resetSnakeGame = useCallback((initialScore = GAME_CONFIG.INITIAL_SCORE) => {
        const initialSnake = [];
        for (let i = 0; i < GAME_CONFIG.INITIAL_SNAKE_LENGTH; i++) {
            initialSnake.push({ x: 10 - i, y: 10 });
        }
        
        setSnake(initialSnake);
        directionRef.current = "RIGHT";
        nextDirectionRef.current = "RIGHT";
        setDirection("RIGHT");
        setScore(initialScore);
        placeFood(initialSnake);
        setIsRunning(true);
    }, [placeFood]);

    const resumeSnakeGame = useCallback((currentScore) => {
        let currentLen = GAME_CONFIG.INITIAL_SNAKE_LENGTH + currentScore * GAME_CONFIG.POINTS_PER_FOOD;
        let newSnake = [];
        let startX = Math.floor(GRID_SIZE / 2);
        for(let i = 0; i < currentLen; i++) {
            newSnake.push({x: startX, y: (10 + i) % GRID_SIZE});
        }
        setSnake(newSnake);
        directionRef.current = "UP";
        nextDirectionRef.current = "UP";
        setDirection("UP");
        placeFood(newSnake);
        setIsRunning(true);
    }, [placeFood]);

    const stopGame = useCallback(() => {
        setIsRunning(false);
    }, []);

    useEffect(() => {
        const checkSelfCollision = (head, snakeArr) => {
            for(let i = 0; i < snakeArr.length; i++) {
                if(head.x === snakeArr[i].x && head.y === snakeArr[i].y) return true;
            }
            return false;
        };

        const gameLoop = () => {
            if(!isRunningRef.current) return;
            
            directionRef.current = nextDirectionRef.current;
            const d = directionRef.current;
            setDirection(d);
            const currentSnake = [...snakeRef.current];
            
            if (currentSnake.length === 0) return;

            let head = { ...currentSnake[0] };
            
            if (d === "LEFT") head.x--;
            if (d === "UP") head.y--;
            if (d === "RIGHT") head.x++;
            if (d === "DOWN") head.y++;

            // Collision
            if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE || checkSelfCollision(head, currentSnake)) {
                setIsRunning(false);
                if (onGameOver) onGameOver(scoreRef.current);
                return;
            }

            currentSnake.unshift(head);

            // Food Eating
            if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
                const newScore = scoreRef.current + GAME_CONFIG.POINTS_PER_FOOD;
                setScore(newScore);
                if (onScoreChange) onScoreChange(newScore);
                placeFood(currentSnake);
            } else {
                currentSnake.pop();
            }

            setSnake(currentSnake);
        };

        if (isRunning) {
            const intervalId = setInterval(gameLoop, GAME_CONFIG.BASE_SPEED_MS);
            return () => clearInterval(intervalId);
        }
    }, [isRunning, onGameOver, onScoreChange, placeFood]);

    return {
        snake,
        food,
        score,
        isRunning,
        direction,
        changeDirection,
        resetSnakeGame,
        resumeSnakeGame,
        stopGame,
        GRID_SIZE
    };
}
