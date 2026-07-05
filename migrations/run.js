const { Pool } = require('pg');
const pool = new Pool();

const migrations = [
  // Users Table
  `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    country VARCHAR(100),
    date_of_birth DATE,
    kyc_verified BOOLEAN DEFAULT FALSE,
    kyc_document_id VARCHAR(255),
    balance DECIMAL(15,2) DEFAULT 0,
    bonus_balance DECIMAL(15,2) DEFAULT 0,
    total_wagered DECIMAL(15,2) DEFAULT 0,
    total_won DECIMAL(15,2) DEFAULT 0,
    vip_level INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
  )`,

  // Games Table
  `CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    min_bet DECIMAL(10,2),
    max_bet DECIMAL(10,2),
    rtp DECIMAL(5,2),
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,

  // Bets Table
  `CREATE TABLE IF NOT EXISTS bets (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    game_id INT NOT NULL REFERENCES games(id),
    bet_amount DECIMAL(15,2) NOT NULL,
    win_amount DECIMAL(15,2),
    multiplier DECIMAL(10,2),
    result VARCHAR(20),
    game_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,

  // Transactions Table
  `CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    type VARCHAR(50) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(10),
    status VARCHAR(20) DEFAULT 'pending',
    payment_method VARCHAR(50),
    reference_id VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,

  // Bonuses Table
  `CREATE TABLE IF NOT EXISTS bonuses (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    type VARCHAR(50) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    wagering_requirement DECIMAL(15,2),
    wagered_amount DECIMAL(15,2) DEFAULT 0,
    expiry_date DATE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,

  // Game History Table
  `CREATE TABLE IF NOT EXISTS game_history (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    game_id INT NOT NULL REFERENCES games(id),
    bet_id INT REFERENCES bets(id),
    outcome VARCHAR(50),
    bet_amount DECIMAL(15,2),
    win_amount DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,

  // Admin Users Table
  `CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'moderator',
    permissions JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`
];

const runMigrations = async () => {
  try {
    console.log('Running migrations...');
    for (const migration of migrations) {
      await pool.query(migration);
    }
    console.log('Migrations completed successfully!');
    
    // Insert default games
    await insertDefaultGames();
    
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};

const insertDefaultGames = async () => {
  const games = [
    { name: 'Golden Slots', type: 'slots', min_bet: 0.1, max_bet: 1000, rtp: 96.5 },
    { name: 'Blackjack Classic', type: 'blackjack', min_bet: 1, max_bet: 500, rtp: 99.6 },
    { name: 'European Roulette', type: 'roulette', min_bet: 0.5, max_bet: 2000, rtp: 97.3 },
    { name: 'Texas Hold\'em', type: 'poker', min_bet: 0.1, max_bet: 5000, rtp: 98.0 },
    { name: 'Baccarat Pro', type: 'baccarat', min_bet: 1, max_bet: 1000, rtp: 98.8 },
    { name: 'Craps Master', type: 'craps', min_bet: 0.5, max_bet: 1000, rtp: 98.6 },
    { name: 'Video Poker', type: 'video_poker', min_bet: 0.1, max_bet: 500, rtp: 99.5 },
    { name: 'Keno Game', type: 'keno', min_bet: 0.1, max_bet: 100, rtp: 95.0 },
    { name: 'Bingo Hall', type: 'bingo', min_bet: 0.5, max_bet: 500, rtp: 94.0 },
    { name: 'Sports Betting', type: 'sports', min_bet: 1, max_bet: 5000, rtp: 95.5 }
  ];

  for (const game of games) {
    await pool.query(
      'INSERT INTO games (name, type, min_bet, max_bet, rtp) VALUES ($1, $2, $3, $4, $5)',
      [game.name, game.type, game.min_bet, game.max_bet, game.rtp]
    );
  }
  console.log('Default games inserted!');
};

runMigrations();
