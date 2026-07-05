const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await req.db.query(
      'SELECT id, email, username, balance, total_wagered, total_won, created_at FROM users LIMIT 100'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

router.get('/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const stats = await req.db.query(`
      SELECT 
        COUNT(DISTINCT user_id) as total_users,
        SUM(bet_amount) as total_wagered,
        SUM(win_amount) as total_payouts,
        COUNT(*) as total_bets
      FROM bets
    `);

    const revenue = await req.db.query(`
      SELECT SUM(amount) as total_revenue FROM transactions WHERE type = 'deposit'
    `);

    res.json({
      stats: stats.rows[0],
      revenue: revenue.rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching stats' });
  }
});

router.post('/user/:userId/suspend', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await req.db.query(
      'UPDATE users SET status = $1 WHERE id = $2',
      ['suspended', req.params.userId]
    );
    res.json({ message: 'User suspended' });
  } catch (error) {
    res.status(500).json({ error: 'Error suspending user' });
  }
});

router.get('/transactions', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await req.db.query(
      'SELECT * FROM transactions ORDER BY created_at DESC LIMIT 100'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching transactions' });
  }
});

module.exports = router;
