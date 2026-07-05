# CasinoTKM - Online Casino Platform
## Tam Kurulum ve Başlangıç Rehberi

### 🚀 Hızlı Başlangıç (Docker ile)

```bash
docker-compose up -d
```

Bundan sonra:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Database: PostgreSQL on localhost:5432

### 📋 Manuel Kurulum

#### 1. Backend Setup

```bash
# Bağımlılıkları yükle
npm install

# .env dosyasını oluştur
cp .env.example .env

# Database migration'ları çalıştır
node migrations/run.js

# Backend'i başlat
npm start
# Veya development modunda:
npm run dev
```

#### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend http://localhost:3000 adresinde açılacaktır.

### 💾 Database Kurulumu

PostgreSQL 12+ kurulu olmalıdır.

```bash
# PostgreSQL'e bağlan
psql -U postgres

# Database oluştur
CREATE DATABASE casinotkm;
```

Veya `.env` dosyasında veritabanı bilgilerini ayarla:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=casinotkm
DB_USER=postgres
DB_PASSWORD=your_password
```

### 🔑 Ortam Değişkenleri (.env)

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=casinotkm
DB_USER=postgres
DB_PASSWORD=your_password

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_jwt_secret_key_here_change_it
JWT_EXPIRE=7d

# Stripe (Ödeme)
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_PUBLIC_KEY=pk_test_your_stripe_key

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 🎮 Test Hesabı

Kaydol sayfasından yeni hesap oluştur:
- Email: test@example.com
- Şifre: 123456
- Kullanıcı Adı: testuser

### 📊 API Endpoints

#### Authentication
```
POST   /api/auth/register      - Kayıt
POST   /api/auth/login         - Giriş
POST   /api/auth/logout        - Çıkış
```

#### Games
```
GET    /api/games              - Tüm oyunları listele
GET    /api/games/:id          - Oyun detayları
POST   /api/games/:id/play     - Oyun oyna
GET    /api/games/:id/history  - Oyun geçmişi
```

#### Wallet
```
GET    /api/wallet/balance          - Bakiye
GET    /api/wallet/transactions     - İşlem geçmişi
POST   /api/wallet/add-funds        - Para yatır
POST   /api/wallet/withdraw         - Para çek
```

#### Payments
```
POST   /api/payments/stripe-deposit      - Stripe ile yatırma
GET    /api/payments/crypto-address      - Kripto adresi al
POST   /api/payments/verify-payment      - Ödeme doğrula
```

#### Bets
```
GET    /api/bets               - Bahis geçmişi
GET    /api/bets/stats         - Bahis istatistikleri
```

#### Admin
```
GET    /api/admin/stats        - Platform istatistikleri
GET    /api/admin/users        - Kullanıcı listesi
GET    /api/admin/transactions - İşlem geçmişi
POST   /api/admin/user/:id/suspend - Kullanıcıyı sustur
```

### 🎯 Özellikler

✅ **Oyunlar:**
- 🎰 Slot Makineleri
- 🎴 Blackjack
- 🎡 Rulet
- 🃏 Poker
- 🎲 Craps
- 🎴 Baccarat
- 🎮 Video Poker
- 🎯 Keno
- 🎪 Bingo
- ⚽ Spor Bahisleri

✅ **Kullanıcı Sistemi:**
- Kayıt ve Giriş
- Profil Yönetimi
- VIP Sistemleri
- KYC Doğrulama

✅ **Ödeme Sistemleri:**
- Stripe entegrasyonu
- Kripto ödemeleri (Bitcoin, Ethereum)
- E-Cüzdan

✅ **İçerik Yönetimi:**
- Admin Paneli
- Kullanıcı Yönetimi
- İstatistikler
- İşlem Geçmişi

### 💱 Para Birimi

Tüm tutarlar **Türkmenistan Manatı (TMT)** olarak gösterilir.

### 🔒 Güvenlik

- JWT Token Authentication
- Bcrypt Şifre Hashleme
- CORS Koruması
- SQL Injection Koruması
- Rate Limiting (eklenebilir)

### 📱 Responsive Design

- ✅ Desktop
- ✅ Tablet
- ✅ Mobile

### 🐛 Troubleshooting

**Port zaten kullanılıyorsa:**
```bash
# Backend portu değiştir
PORT=5001 npm start

# Frontend portu değiştir
PORT=3001 npm start
```

**Database bağlantı hatası:**
```bash
# PostgreSQL çalışıyor mu kontrol et
sudo systemctl start postgresql

# veya
brew services start postgresql
```

**Dependencies hatası:**
```bash
rm -rf node_modules
npm install
```

### 📝 Lisans

MIT

### 📞 Destek

Sorularınız için GitHub Issues açabilirsiniz.

---

**Yapıldığı tarih:** 2026-07-05
**Versiyon:** 1.0.0
