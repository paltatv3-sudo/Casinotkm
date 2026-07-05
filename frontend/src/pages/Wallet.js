import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CurrencyFormatter from '../utils/CurrencyFormatter';

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [bonusBalance, setBonusBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, []);

  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/wallet/balance`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBalance(response.data.balance);
      setBonusBalance(response.data.bonus_balance);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/wallet/transactions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || depositAmount <= 0) {
      alert('Geçerli bir tutar girin');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/wallet/add-funds`,
        { amount: parseFloat(depositAmount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Para yatırıldı!');
      setDepositAmount('');
      fetchBalance();
      fetchTransactions();
    } catch (error) {
      alert('Yatırma hatası: ' + error.response?.data?.error);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || withdrawAmount <= 0) {
      alert('Geçerli bir tutar girin');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/wallet/withdraw`,
        { amount: parseFloat(withdrawAmount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Çekim başlatıldı!');
      setWithdrawAmount('');
      fetchBalance();
      fetchTransactions();
    } catch (error) {
      alert('Çekim hatası: ' + error.response?.data?.error);
    }
  };

  if (loading) return <div className="loading">Yükleniyor...</div>;

  return (
    <div className="wallet-container">
      <h1>Cüzdan</h1>
      
      <div className="balance-cards">
        <div className="balance-card">
          <h3>Ana Bakiye</h3>
          <p className="balance-amount">
            <CurrencyFormatter amount={balance} />
          </p>
        </div>
        
        <div className="balance-card bonus">
          <h3>Bonus Bakiye</h3>
          <p className="balance-amount">
            <CurrencyFormatter amount={bonusBalance} />
          </p>
        </div>
      </div>

      <div className="transactions-section">
        <h2>İşlemler</h2>
        <div className="deposit-withdraw">
          <div className="action-box">
            <h4>Para Yatır</h4>
            <input
              type="number"
              placeholder="Miktar (TMT)"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
            />
            <button onClick={handleDeposit}>Yatır</button>
          </div>

          <div className="action-box">
            <h4>Para Çek</h4>
            <input
              type="number"
              placeholder="Miktar (TMT)"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
            />
            <button onClick={handleWithdraw}>Çek</button>
          </div>
        </div>

        <div className="transactions-list">
          <h3>İşlem Geçmişi</h3>
          <table>
            <thead>
              <tr>
                <th>Tarih</th>
                <th>Tür</th>
                <th>Miktar</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{new Date(tx.created_at).toLocaleDateString('tr-TR')}</td>
                  <td>{tx.type === 'deposit' ? 'Yatırma' : 'Çekim'}</td>
                  <td><CurrencyFormatter amount={tx.amount} /></td>
                  <td><span className={`status ${tx.status}`}>{tx.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .wallet-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
        }

        .balance-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin: 20px 0;
        }

        .balance-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          border-radius: 10px;
          text-align: center;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .balance-card.bonus {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        .balance-amount {
          font-size: 2.5em;
          font-weight: bold;
          margin: 10px 0;
        }

        .deposit-withdraw {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin: 20px 0;
        }

        .action-box {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 10px;
          border: 1px solid #dee2e6;
        }

        .action-box input {
          width: 100%;
          padding: 10px;
          margin: 10px 0;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 1em;
        }

        .action-box button {
          width: 100%;
          padding: 10px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          transition: 0.3s;
        }

        .action-box button:hover {
          background: #5568d3;
        }

        .transactions-list table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }

        .transactions-list th,
        .transactions-list td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #dee2e6;
        }

        .transactions-list th {
          background: #f8f9fa;
          font-weight: bold;
        }

        .status {
          padding: 5px 10px;
          border-radius: 5px;
          font-size: 0.9em;
          font-weight: bold;
        }

        .status.completed {
          background: #d4edda;
          color: #155724;
        }

        .status.pending {
          background: #fff3cd;
          color: #856404;
        }

        @media (max-width: 768px) {
          .balance-cards,
          .deposit-withdraw {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Wallet;
