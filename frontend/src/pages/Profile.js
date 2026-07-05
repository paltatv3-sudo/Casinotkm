import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CurrencyFormatter from '../utils/CurrencyFormatter';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response.data);
      setFormData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Profil yüklenemedi:', error);
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/stats`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStats(response.data);
    } catch (error) {
      console.error('İstatistikler yüklenemedi:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/profile`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Profil güncellendi!');
      setEditing(false);
      fetchProfile();
    } catch (error) {
      alert('Güncelleme başarısız: ' + error.response?.data?.error);
    }
  };

  if (loading) return <div className="loading">Yükleniyor...</div>;

  return (
    <div className="profile-container">
      <h1>Profilim</h1>

      <div className="profile-grid">
        <div className="profile-card">
          <h2>Kişisel Bilgiler</h2>
          {!editing ? (
            <div className="info-display">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Kullanıcı Adı:</strong> {user.username}</p>
              <p><strong>VIP Seviye:</strong> {user.vip_level}</p>
              <p><strong>Hesap Durumu:</strong> {user.status}</p>
              <button onClick={() => setEditing(true)} className="edit-btn">
                Düzenle
              </button>
            </div>
          ) : (
            <div className="info-edit">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Kullanıcı Adı</label>
                <input
                  type="text"
                  value={formData.username || ''}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
              <div className="button-group">
                <button onClick={handleUpdate} className="save-btn">Kaydet</button>
                <button onClick={() => setEditing(false)} className="cancel-btn">İptal</button>
              </div>
            </div>
          )}
        </div>

        <div className="profile-card">
          <h2>Bakiye</h2>
          <div className="balance-display">
            <div className="balance-item">
              <span>Ana Bakiye</span>
              <p className="amount"><CurrencyFormatter amount={user.balance} /></p>
            </div>
            <div className="balance-item">
              <span>Bonus Bakiye</span>
              <p className="amount"><CurrencyFormatter amount={user.bonus_balance} /></p>
            </div>
          </div>
        </div>
      </div>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Toplam Bahis</h3>
            <p className="stat-value"><CurrencyFormatter amount={stats.total_wagered} /></p>
          </div>
          <div className="stat-card">
            <h3>Toplam Kazanç</h3>
            <p className="stat-value"><CurrencyFormatter amount={stats.total_won} /></p>
          </div>
          <div className="stat-card">
            <h3>Net Kar/Zarar</h3>
            <p className={`stat-value ${(stats.total_won - stats.total_wagered) >= 0 ? 'positive' : 'negative'}`}>
              <CurrencyFormatter amount={stats.total_won - stats.total_wagered} />
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        .profile-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
        }

        .profile-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin: 20px 0;
        }

        .profile-card {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .info-display p {
          margin: 10px 0;
          font-size: 1.1em;
        }

        .edit-btn, .save-btn {
          margin-top: 15px;
          padding: 10px 20px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
        }

        .cancel-btn {
          padding: 10px 20px;
          background: #ccc;
          color: #333;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin-left: 10px;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }

        .form-group input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          box-sizing: border-box;
        }

        .button-group {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }

        .balance-display {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .balance-item {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 5px;
          text-align: center;
        }

        .amount {
          font-size: 1.8em;
          font-weight: bold;
          color: #667eea;
          margin: 10px 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin: 20px 0;
        }

        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .stat-value {
          font-size: 1.8em;
          font-weight: bold;
          margin: 10px 0;
          color: #667eea;
        }

        .stat-value.positive {
          color: #28a745;
        }

        .stat-value.negative {
          color: #dc3545;
        }

        @media (max-width: 768px) {
          .profile-grid,
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;
