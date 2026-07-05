const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { authMiddleware } = require('../middleware/auth');

router.post('/stripe-deposit', authMiddleware, async (req, res) => {
  try {
    const { amount, token } = req.body;

    const charge = await stripe.charges.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      source: token,
      description: `Casino deposit - User ${req.user.id}`
    });

    // Record transaction
    await req.db.query(
      'INSERT INTO transactions (user_id, type, amount, status, payment_method, reference_id) VALUES ($1, $2, $3, $4, $5, $6)',
      [req.user.id, 'deposit', amount, 'completed', 'stripe', charge.id]
    );

    // Update balance
    await req.db.query(
      'UPDATE users SET balance = balance + $1 WHERE id = $2',
      [amount, req.user.id]
    );

    res.json({ message: 'Deposit successful', chargeId: charge.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Payment processing failed' });
  }
});

router.get('/crypto-address', authMiddleware, async (req, res) => {
  try {
    // Generate unique crypto address per user
    const cryptoAddress = `casino_${req.user.id}_${Date.now()}`;
    
    res.json({
      address: cryptoAddress,
      currency: 'BTC',
      message: 'Send Bitcoin to this address to deposit'
    });
  } catch (error) {
    res.status(500).json({ error: 'Error generating address' });
  }
});

router.post('/verify-payment', async (req, res) => {
  try {
    const { txId, amount, userId } = req.body;

    // TODO: Verify transaction on blockchain
    
    await req.db.query(
      'INSERT INTO transactions (user_id, type, amount, status, payment_method, reference_id) VALUES ($1, $2, $3, $4, $5, $6)',
      [userId, 'deposit', amount, 'completed', 'crypto', txId]
    );

    await req.db.query(
      'UPDATE users SET balance = balance + $1 WHERE id = $2',
      [amount, userId]
    );

    res.json({ message: 'Crypto deposit verified' });
  } catch (error) {
    res.status(500).json({ error: 'Error verifying payment' });
  }
});

module.exports = router;
