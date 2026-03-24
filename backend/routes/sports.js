import express from 'express';
export const router = express.Router();

// Mock Sports Data Engine (Simulating TheRundown or Sportmonks API)
const matches = [
    {
        id: 'm1',
        sport: 'soccer',
        league: 'Champions League',
        status: 'LIVE',
        time: '78:42',
        homeTeam: 'Man City',
        awayTeam: 'Real Madrid',
        score: { home: 2, away: 1 },
        odds: { home: 1.15, draw: 8.50, away: 21.00 }
    },
    {
        id: 'm2',
        sport: 'soccer',
        league: 'Premier League',
        status: 'UPCOMING',
        time: 'Today, 20:00',
        homeTeam: 'Chelsea',
        awayTeam: 'Man Utd',
        score: null,
        odds: { home: 1.95, draw: 4.00, away: 3.80 }
    }
];

router.get('/matches', (req, res) => {
    res.json({ success: true, matches });
});

router.post('/bet', (req, res) => {
    const { selections, wagerAmount, currency } = req.body;
    
    // Simulate complex bet parsing (Singles/Parlays)
    console.log(`[Sportsbook] Received bet: ${wagerAmount} ${currency} on ${selections.length} selections.`);

    res.json({
        success: true,
        message: 'Bet placed successfully',
        betId: `bet_${Date.now()}`
    });
});
