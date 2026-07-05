const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await req.db.query(
      'SELECT * FROM bets WHERE user_id = $1 ORDER BY created_at DESC LIMIT 100',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching bets' });
  }
});

router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const result = await req.db.query(
      'SELECT COUNT(*) as total_bets, SUM(bet_amount) as total_wagered, SUM(win_amount) as total_won FROM bets WHERE user_id = $1',
      [req.user.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching stats' });
  }
});

module.exports = router;
