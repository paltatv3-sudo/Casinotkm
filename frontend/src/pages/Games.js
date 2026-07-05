import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CurrencyFormatter from '../utils/CurrencyFormatter';

const Games = () => {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [betAmount, setBetAmount] = useState('');
  const [balance, setBalance] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGames();
    fetchBalance();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/games`
      );
      setGames(response.data);
    } catch (error) {
      console.error('Oyunlar alınamadı:', error);
    }
  };

  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/wallet/balance`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBalance(response.data.balance);
    } catch (error) {
      console.error('Bakiye alınamadı:', error);
    }
  };

  const playGame = async () => {
    if (!selectedGame || !betAmount || betAmount <= 0) {
      alert('Lütfen oyun ve bahis miktarı seçin');
      return;
    }

    if (parseFloat(betAmount) > balance) {
      alert('Yetersiz bakiye!');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/games/${selectedGame.id}/play`,
        { bet_amount: parseFloat(betAmount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResult(response.data);
      setBalance(response.data.newBalance);
      setBetAmount('');
    } catch (error) {
      alert('Oyun hatası: ' + error.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  const gameTypeTranslation = {
    slots: '🎰 Slot Makinesi',
    blackjack: '🃏 Blackjack',
    roulette: '🎡 Rulet',
    poker: '🎴 Poker',
    baccarat: '🃏 Baccarat',
    craps: '🎲 Craps',
    video_poker: '🎮 Video Poker',
    keno: '🎯 Keno',
    bingo: '🎪 Bingo',
    sports: '⚽ Spor Bahisleri'
  };

  return (
    <div className="games-container">
      <h1>Oyunlar</h1>
      
      <div className="current-balance">
        <h3>Mevcut Bakiye: <CurrencyFormatter amount={balance} /></h3>
      </div>

      <div className="games-grid">
        {games.map((game) => (
          <div
            key={game.id}
            className={`game-card ${selectedGame?.id === game.id ? 'selected' : ''}`}
            onClick={() => setSelectedGame(game)}
          >
            <h3>{gameTypeTranslation[game.type] || game.name}</h3>
            <p>{game.name}</p>
            <div className="game-info">
              <span>Min: <CurrencyFormatter amount={game.min_bet} /></span>
              <span>Max: <CurrencyFormatter amount={game.max_bet} /></span>
              <span>RTP: {game.rtp}%</span>
            </div>
          </div>
        ))}
      </div>

      {selectedGame && (
        <div className="play-section">
          <h2>{selectedGame.name}</h2>
          <div className="game-details">
            <p>Min Bahis: <CurrencyFormatter amount={selectedGame.min_bet} /></p>
            <p>Max Bahis: <CurrencyFormatter amount={selectedGame.max_bet} /></p>
            <p>RTP: {selectedGame.rtp}%</p>
          </div>

          <div className="bet-input">
            <input
              type="number"
              placeholder="Bahis Miktarı (TMT)"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              min={selectedGame.min_bet}
              max={Math.min(selectedGame.max_bet, balance)}
              step="0.01"
            />
            <button
              onClick={playGame}
              disabled={loading}
              className="play-btn"
            >
              {loading ? 'Oynanıyor...' : 'Oyna'}
            </button>
          </div>

          {result && (
            <div className={`result ${result.result}`}>
              <h3>{result.result === 'win' ? '🎉 KAZANDDIN!' : '😢 Kaybettin'}</h3>
              <p>Çarpan: {result.multiplier.toFixed(2)}x</p>
              {result.result === 'win' && (
                <p>Kazanç: <CurrencyFormatter amount={result.winAmount} /></p>
              )}
              <p>Yeni Bakiye: <CurrencyFormatter amount={result.newBalance} /></p>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .games-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .current-balance {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          border-radius: 10px;
          margin: 20px 0;
          text-align: center;
        }

        .games-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 15px;
          margin: 20px 0;
        }

        .game-card {
          background: white;
          border: 2px solid #ddd;
          border-radius: 10px;
          padding: 15px;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .game-card:hover {
          border-color: #667eea;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .game-card.selected {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .game-info {
          font-size: 0.9em;
          margin-top: 10px;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .play-section {
          background: #f8f9fa;
          padding: 30px;
          border-radius: 10px;
          margin: 30px 0;
        }

        .game-details {
          background: white;
          padding: 15px;
          border-radius: 5px;
          margin: 15px 0;
        }

        .bet-input {
          display: flex;
          gap: 10px;
          margin: 20px 0;
        }

        .bet-input input {
          flex: 1;
          padding: 12px;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 1em;
        }

        .play-btn {
          padding: 12px 30px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 5px;
          font-weight: bold;
          cursor: pointer;
          transition: 0.3s;
        }

        .play-btn:hover:not(:disabled) {
          background: #218838;
        }

        .play-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .result {
          margin-top: 20px;
          padding: 20px;
          border-radius: 10px;
          text-align: center;
          font-weight: bold;
        }

        .result.win {
          background: #d4edda;
          color: #155724;
        }

        .result.lose {
          background: #f8d7da;
          color: #721c24;
        }

        @media (max-width: 768px) {
          .games-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          }
        }
      `}</style>
    </div>
  );
};

export default Games;
