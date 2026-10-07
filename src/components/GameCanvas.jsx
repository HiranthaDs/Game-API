// GameCanvas.jsx
// ==========================================
// ARCHITECTURE NOTE: LOW COUPLING
// This component is purely presentational. It has ZERO dependencies on Firebase, Google Sheets, 
// or even the game loop logic itself. It does not import any services or APIs.
// It solely accepts primitive data streams via props (`snake`, `food`, `score`) and paints them onto the canvas.
// If the entire game engine changed tomorrow, this component would not need to be altered as long as it gets coordinates.
// ==========================================
import { useEffect, useRef } from 'react';

export default function GameCanvas({ snake, food, score, GRID_SIZE, direction }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const TILE_PX = canvas.width / GRID_SIZE;

        // Draw Checkered Background
        for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
                ctx.fillStyle = (i + j) % 2 === 0 ? "#0F172A" : "#1E293B"; // Slate-900 / Slate-800
                ctx.fillRect(i * TILE_PX, j * TILE_PX, TILE_PX, TILE_PX);
            }
        }

        if (food) {
            // Draw Food
            ctx.fillStyle = "#EF4444"; // Red-500
            ctx.beginPath();
            ctx.arc(food.x * TILE_PX + (TILE_PX/2), food.y * TILE_PX + (TILE_PX/2), TILE_PX/2.5, 0, Math.PI * 2);
            ctx.fill();
        }

        // Determine Snake Color based on score
        let headColor = "#38BDF8"; // Default Blue Head
        let bodyColor = "#0284C7"; // Default Blue Body
        
        if (score >= 20) {
            headColor = "#FDE047"; // Gold Head
            bodyColor = "#CA8A04"; // Gold Body
        } else if (score >= 10) {
            headColor = "#FCA5A5"; // Red Head
            bodyColor = "#DC2626"; // Red Body
        }

        // Draw Snake
        snake.forEach((part, index) => {
            ctx.fillStyle = index === 0 ? headColor : bodyColor; 
            
            ctx.beginPath();
            ctx.roundRect(part.x * TILE_PX + 1, part.y * TILE_PX + 1, TILE_PX - 2, TILE_PX - 2, 6);
            ctx.fill();

            // Eyes for the head
            if (index === 0) {
                ctx.fillStyle = "white";
                let eyeOffset = TILE_PX / 4;
                let eyeSize = TILE_PX / 6;
                
                ctx.beginPath();
                if (direction === "RIGHT" || direction === "LEFT") {
                    ctx.arc(part.x * TILE_PX + TILE_PX/2, part.y * TILE_PX + eyeOffset, eyeSize, 0, Math.PI*2);
                    ctx.arc(part.x * TILE_PX + TILE_PX/2, part.y * TILE_PX + TILE_PX - eyeOffset, eyeSize, 0, Math.PI*2);
                } else {
                    ctx.arc(part.x * TILE_PX + eyeOffset, part.y * TILE_PX + TILE_PX/2, eyeSize, 0, Math.PI*2);
                    ctx.arc(part.x * TILE_PX + TILE_PX - eyeOffset, part.y * TILE_PX + TILE_PX/2, eyeSize, 0, Math.PI*2);
                }
                ctx.fill();
            }
        });
    }, [snake, food, score, GRID_SIZE, direction]);

    return <canvas ref={canvasRef} width="400" height="400" id="snakeCanvas"></canvas>;
}
