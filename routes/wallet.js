const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');

router.get('/balance', authMiddleware, async (req, res) => {
  try {
    const result = await req.db.query(
      'SELECT balance, bonus_balance FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching balance' });
  }
});

router.get('/transactions', authMiddleware, async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const result = await req.db.query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [req.user.id, limit, offset]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching transactions' });
  }
});

router.post('/add-funds', authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;

    if (amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Create transaction record
    const result = await req.db.query(
      'INSERT INTO transactions (user_id, type, amount, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, 'deposit', amount, 'completed']
    );

    // Update balance
    await req.db.query(
      'UPDATE users SET balance = balance + $1 WHERE id = $2',
      [amount, req.user.id]
    );

    res.json({ message: 'Funds added successfully', transaction: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding funds' });
  }
});

router.post('/withdraw', authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;

    if (amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const userResult = await req.db.query('SELECT balance FROM users WHERE id = $1', [req.user.id]);
    const user = userResult.rows[0];

    if (user.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const result = await req.db.query(
      'INSERT INTO transactions (user_id, type, amount, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, 'withdrawal', amount, 'pending']
    );

    await req.db.query(
      'UPDATE users SET balance = balance - $1 WHERE id = $2',
      [amount, req.user.id]
    );

    res.json({ message: 'Withdrawal requested', transaction: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error processing withdrawal' });
  }
});

module.exports = router;
