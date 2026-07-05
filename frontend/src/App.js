import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Games from './pages/Games';
import Wallet from './pages/Wallet';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="app">
      {user && (
        <nav className="navbar">
          <div className="navbar-left">
            <Link to="/" className="logo">🎰 CasinoTKM</Link>
          </div>
          <div className="navbar-center">
            <Link to="/games">Oyunlar</Link>
            <Link to="/wallet">Cüzdan</Link>
            <Link to="/profile">Profilim</Link>
            <Link to="/admin">Admin</Link>
          </div>
          <div className="navbar-right">
            <span>Hoşgeldin, {user.username}</span>
            <button onClick={handleLogout}>Çıkış Yap</button>
          </div>
        </nav>
      )}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/games" element={<Games />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/" element={user ? <Games /> : <Login />} />
      </Routes>
    </div>
  );
}

export default App;
