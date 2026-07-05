# CasinoTKM - Online Casino Platform

Kapsamlı web tabanlı online casino platformu.

## Özellikler

- 🎰 Slot Makineleri
- 🃏 Blackjack
- 🎡 Rulet
- 🎴 Poker
- 🎲 Craps
- 🃏 Baccarat
- 🎯 Spor Bahisleri
- 👥 Canlı Dealer Desteği
- 💳 Ödeme Sistemi (Stripe + Kripto)
- 📊 Admin Paneli
- 🏆 VIP Sistemi
- 🎁 Bonus Sistemi

## Kurulum

### Gereksinimler
- Node.js 16+
- PostgreSQL 12+
- npm/yarn

### Backend Setup

```bash
npm install
cp .env.example .env
# .env dosyasını düzenle
node migrations/run.js
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

## Yapı

```
root/
├── server.js
├── package.json
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── games.js
│   ├── wallet.js
│   ├── payments.js
│   ├── admin.js
│   └── bets.js
├── middleware/
│   ├── auth.js
│   └── validation.js
├── games/
│   ├── slots.js
│   ├── blackjack.js
│   ├── roulette.js
│   └── ...
├── migrations/
│   └── run.js
└── frontend/ (React)
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Kayıt
- POST `/api/auth/login` - Giriş
- POST `/api/auth/logout` - Çıkış

### Games
- GET `/api/games` - Tüm oyunları listele
- POST `/api/games/:gameId/play` - Oyun oyna
- GET `/api/games/:gameId/history` - Oyun geçmişi

### Wallet
- GET `/api/wallet/balance` - Bakiye
- GET `/api/wallet/transactions` - İşlem geçmişi

### Payments
- POST `/api/payments/deposit` - Yatırma
- POST `/api/payments/withdraw` - Çekme

## Lisans

MIT
