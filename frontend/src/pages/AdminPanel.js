import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CurrencyFormatter from '../utils/CurrencyFormatter';

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, usersRes, transRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/admin/stats`, { headers }),
        axios.get(`${process.env.REACT_APP_API_URL}/api/admin/users`, { headers }),
        axios.get(`${process.env.REACT_APP_API_URL}/api/admin/transactions`, { headers })
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setTransactions(transRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Admin veri yüklenemedi:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Yükleniyor...</div>;

  return (
    <div className="admin-panel">
      <h1>Admin Paneli</h1>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          İstatistikler
        </button>
        <button
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Kullanıcılar
        </button>
        <button
          className={`tab ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          İşlemler
        </button>
      </div>

      {activeTab === 'stats' && stats && (
        <div className="stats-section">
          <div className="stat-card">
            <h3>Toplam Kullanıcı</h3>
            <p className="stat-value">{stats.stats.total_users || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Toplam Bahis</h3>
            <p className="stat-value">{stats.stats.total_bets || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Toplam Bahis Tutarı</h3>
            <p className="stat-value">
              <CurrencyFormatter amount={stats.stats.total_wagered || 0} />
            </p>
          </div>
          <div className="stat-card">
            <h3>Toplam Ödemeler</h3>
            <p className="stat-value">
              <CurrencyFormatter amount={stats.stats.total_payouts || 0} />
            </p>
          </div>
          <div className="stat-card revenue">
            <h3>Toplam Gelir</h3>
            <p className="stat-value">
              <CurrencyFormatter amount={stats.revenue.total_revenue || 0} />
            </p>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="users-section">
          <h2>Kayıtlı Kullanıcılar</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Kullanıcı Adı</th>
                <th>Bakiye</th>
                <th>Toplam Bahis</th>
                <th>Toplam Kazanç</th>
                <th>Kayıt Tarihi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.email}</td>
                  <td>{user.username}</td>
                  <td><CurrencyFormatter amount={user.balance} /></td>
                  <td><CurrencyFormatter amount={user.total_wagered} /></td>
                  <td><CurrencyFormatter amount={user.total_won} /></td>
                  <td>{new Date(user.created_at).toLocaleDateString('tr-TR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="transactions-section">
          <h2>İşlem Geçmişi</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Kullanıcı</th>
                <th>Tür</th>
                <th>Miktar</th>
                <th>Durum</th>
                <th>Ödeme Yöntemi</th>
                <th>Tarih</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{tx.id}</td>
                  <td>{tx.user_id}</td>
                  <td>{tx.type === 'deposit' ? 'Yatırma' : 'Çekim'}</td>
                  <td><CurrencyFormatter amount={tx.amount} /></td>
                  <td><span className={`status ${tx.status}`}>{tx.status}</span></td>
                  <td>{tx.payment_method || 'N/A'}</td>
                  <td>{new Date(tx.created_at).toLocaleDateString('tr-TR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>{`
        .admin-panel {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
        }

        .tabs {
          display: flex;
          gap: 10px;
          margin: 20px 0;
          border-bottom: 2px solid #ddd;
        }

        .tab {
          padding: 10px 20px;
          background: none;
          border: none;
          cursor: pointer;
          font-weight: bold;
          color: #666;
          border-bottom: 3px solid transparent;
          transition: 0.3s;
        }

        .tab.active {
          color: #667eea;
          border-bottom-color: #667eea;
        }

        .tab:hover {
          color: #667eea;
        }

        .stats-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin: 20px 0;
        }

        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border-left: 4px solid #667eea;
        }

        .stat-card.revenue {
          border-left-color: #28a745;
          background: linear-gradient(135deg, #28a74515 0%, #28a74505 100%);
        }

        .stat-value {
          font-size: 2em;
          font-weight: bold;
          color: #667eea;
          margin: 10px 0;
        }

        .users-section,
        .transactions-section {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }

        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        th {
          background: #f8f9fa;
          font-weight: bold;
          color: #333;
        }

        tr:hover {
          background: #f8f9fa;
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

        .loading {
          text-align: center;
          padding: 40px;
          font-size: 1.2em;
        }
      `}</style>
    </div>
  );
};

export default AdminPanel;
