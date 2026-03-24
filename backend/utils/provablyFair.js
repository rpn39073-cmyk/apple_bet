import crypto from 'crypto';

/**
 * Provably Fair RNG System (Stake.com style)
 * Generates a deterministic, provably fair hash using Server Seed, Client Seed, and Nonce.
 */

// Generate a new server seed
export const generateServerSeed = () => {
    return crypto.randomBytes(32).toString('hex');
};

// Hash the server seed to share with the client BEFORE the bets are placed
export const hashServerSeed = (serverSeed) => {
    return crypto.createHash('sha256').update(serverSeed).digest('hex');
};

// Calculate Crash Game Multiplier
// Uses the standard crypto-gambling formula (e.g., Stake, Bustabit)
export const calculateCrashMultiplier = (serverSeed, clientSeed, nonce) => {
    const hash = crypto.createHmac('sha256', serverSeed)
        .update(`${clientSeed}:${nonce}`)
        .digest('hex');
    
    // Take the first 52 bits of the hash (13 hex characters)
    const h = parseInt(hash.slice(0, 52 / 4), 16);
    const e = Math.pow(2, 52);

    // 1% House Edge
    const multiplier = Math.floor((100 * e - h) / (e - h)) / 100;

    return Math.max(1.00, multiplier); // Minimum 1.00x crash
};

// Generic Dice Game RNG (0 to 100)
export const calculateDiceRoll = (serverSeed, clientSeed, nonce) => {
    const hash = crypto.createHmac('sha256', serverSeed)
        .update(`${clientSeed}:${nonce}`)
        .digest('hex');
    
    const h = parseInt(hash.slice(0, 52 / 4), 16);
    const e = Math.pow(2, 52);
    
    return (h / e) * 100; // Roll from 0.00 to 99.99
};
