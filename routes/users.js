const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const result = await req.db.query(
      'SELECT id, email, username, balance, bonus_balance, total_wagered, total_won, vip_level FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching profile' });
  }
});

router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { first_name, last_name, phone, country } = req.body;

    await req.db.query(
      'UPDATE users SET first_name = $1, last_name = $2, phone = $3, country = $4, updated_at = NOW() WHERE id = $5',
      [first_name, last_name, phone, country, req.user.id]
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating profile' });
  }
});

router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const result = await req.db.query(
      'SELECT total_wagered, total_won, balance, vip_level FROM users WHERE id = $1',
      [req.user.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching stats' });
  }
});

module.exports = router;
