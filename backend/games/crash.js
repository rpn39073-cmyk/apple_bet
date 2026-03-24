import { generateServerSeed, hashServerSeed, calculateCrashMultiplier } from '../utils/provablyFair.js';

let roundId = 0;
let gameState = 'STARTING'; // STARTING, IN_PROGRESS, CRASHED
let currentMultiplier = 1.00;
let crashPoint = 0;
let timeRemaining = 5.0; // Seconds to place bets
let activeBets = []; // { userId, amount, cashOutAt, username }

// Provably Fair Setup
let prevServerSeed = null;
let currentServerSeed = generateServerSeed();
let activeClientSeed = "0000000000000000000000000000000000000000000000000000000000000000"; // Based on block hash usually

export const initCrashGame = (io) => {
    const crashNamespace = io.of('/crash');

    crashNamespace.on('connection', (socket) => {
        console.log(`[Crash] Player connected: ${socket.id}`);
        
        // Send current state
        socket.emit('gameState', {
            gameState,
            currentMultiplier,
            timeRemaining,
            activeBets,
            hashedServerSeed: hashServerSeed(currentServerSeed),
            prevServerSeed // Reveal previous seed for verification
        });

        socket.on('placeBet', (betData) => {
            if (gameState !== 'STARTING') {
                return socket.emit('error', 'Game already in progress');
            }
            activeBets.push(betData);
            crashNamespace.emit('betsUpdated', activeBets);
        });

        socket.on('cashOut', (userId) => {
            if (gameState !== 'IN_PROGRESS') return;
            const bet = activeBets.find(b => b.userId === userId && !b.cashedOut);
            if (bet) {
                bet.cashedOut = true;
                bet.cashedOutMultiplier = currentMultiplier;
                bet.payout = bet.amount * currentMultiplier;
                crashNamespace.emit('betsUpdated', activeBets);
            }
        });
    });

    const runGameLoop = () => {
        if (gameState === 'STARTING') {
            timeRemaining -= 0.1;
            crashNamespace.emit('tick', { gameState, timeRemaining: timeRemaining.toFixed(1) });
            
            if (timeRemaining <= 0) {
                // START GAME
                gameState = 'IN_PROGRESS';
                roundId++;
                crashPoint = calculateCrashMultiplier(currentServerSeed, activeClientSeed, roundId);
                currentMultiplier = 1.00;
                crashNamespace.emit('gameStarted', { currentMultiplier });
            }
        } 
        else if (gameState === 'IN_PROGRESS') {
             // Non-linear exponential curve for Stake-style feel
            currentMultiplier += (currentMultiplier * 0.005); 
            
            crashNamespace.emit('tick', { gameState, currentMultiplier: currentMultiplier.toFixed(2) });

            if (currentMultiplier >= crashPoint) {
                // CRASH
                gameState = 'CRASHED';
                currentMultiplier = crashPoint;
                processPayouts();
                crashNamespace.emit('crashed', { currentMultiplier: crashPoint.toFixed(2), hash: hashServerSeed(currentServerSeed) });
                
                // Cycle Seeds for next round
                prevServerSeed = currentServerSeed;
                currentServerSeed = generateServerSeed();

                setTimeout(() => {
                    gameState = 'STARTING';
                    timeRemaining = 6.0;
                    activeBets = [];
                    crashNamespace.emit('gameState', {
                         gameState, timeRemaining, activeBets, hashedServerSeed: hashServerSeed(currentServerSeed), prevServerSeed
                    });
                }, 3000); // 3 seconds before next round starts
            }
        }
    };

    const processPayouts = () => {
        // Logic to update DB balances for players who didn't cash out
        activeBets.forEach(bet => {
            if (!bet.cashedOut) {
                bet.lost = true;
            }
        });
        crashNamespace.emit('betsUpdated', activeBets);
    };

    // Engine Loop ~30 ticks per second
    setInterval(runGameLoop, 33);
};
