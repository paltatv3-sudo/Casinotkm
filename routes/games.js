const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const result = await req.db.query('SELECT id, name, type, min_bet, max_bet, rtp FROM games WHERE is_active = TRUE');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching games' });
  }
});

router.get('/:gameId', async (req, res) => {
  try {
    const result = await req.db.query('SELECT * FROM games WHERE id = $1', [req.params.gameId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Game not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching game' });
  }
});

router.post('/:gameId/play', authMiddleware, async (req, res) => {
  try {
    const { bet_amount } = req.body;
    const gameId = req.params.gameId;

    const userResult = await req.db.query('SELECT balance FROM users WHERE id = $1', [req.user.id]);
    const user = userResult.rows[0];

    if (user.balance < bet_amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const gameResult = await req.db.query('SELECT * FROM games WHERE id = $1', [gameId]);
    const game = gameResult.rows[0];

    if (bet_amount < game.min_bet || bet_amount > game.max_bet) {
      return res.status(400).json({ error: 'Bet amount out of range' });
    }

    // Simulate game result
    const multiplier = Math.random() * 2.5;
    const winAmount = bet_amount * multiplier;
    const result_status = multiplier > 1 ? 'win' : 'lose';

    // Deduct bet and add win
    const newBalance = user.balance - bet_amount + (result_status === 'win' ? winAmount : 0);

    // Insert bet
    const betResult = await req.db.query(
      'INSERT INTO bets (user_id, game_id, bet_amount, win_amount, multiplier, result, game_data) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [req.user.id, gameId, bet_amount, result_status === 'win' ? winAmount : 0, multiplier, result_status, JSON.stringify({ multiplier })]
    );

    // Update user balance
    await req.db.query(
      'UPDATE users SET balance = $1, total_wagered = total_wagered + $2, total_won = total_won + $3 WHERE id = $4',
      [newBalance, bet_amount, result_status === 'win' ? winAmount : 0, req.user.id]
    );

    req.io.emit('game-result', {
      userId: req.user.id,
      gameId,
      result: result_status,
      multiplier,
      winAmount: result_status === 'win' ? winAmount : 0
    });

    res.json({
      betId: betResult.rows[0].id,
      result: result_status,
      multiplier,
      winAmount: result_status === 'win' ? winAmount : 0,
      newBalance
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error playing game' });
  }
});

router.get('/:gameId/history', authMiddleware, async (req, res) => {
  try {
    const result = await req.db.query(
      'SELECT * FROM bets WHERE user_id = $1 AND game_id = $2 ORDER BY created_at DESC LIMIT 50',
      [req.user.id, req.params.gameId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching history' });
  }
});

module.exports = router;
