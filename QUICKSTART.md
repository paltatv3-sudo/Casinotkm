# CasinoTKM Hızlı Başlangıç

## 📋 Gereksinimler

- Node.js 16+
- PostgreSQL 12+
- npm veya yarn
- Docker (opsiyonel)

## 🚀 5 Dakikada Başla

### Seçenek 1: Docker ile (En Kolay)

```bash
# Tüm servisleri başlat
docker-compose up -d

# Başarılı olup olmadığını kontrol et
docker-compose ps
```

Sonra açıyoruz:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/health

### Seçenek 2: Manuel Kurulum

#### Adım 1: Backend Setup

```bash
# Repo klonan
cd casinotkm

# Bağımlılıkları kur
npm install

# .env dosyasını ayarla
cp .env.example .env

# Database migrasyonlarını çalıştır
node migrations/run.js

# Backend'i başlat
npm start
```

Backend çalışıyor olmalı: `http://localhost:5000`

#### Adım 2: Frontend Setup (Yeni Terminal)

```bash
cd frontend
npm install
npm start
```

Frontend açılacak: `http://localhost:3000`

## 🔑 Test Hesabı Oluştur

1. http://localhost:3000 adresine git
2. **Kaydol** butonuna tıkla
3. Bilgiler gir:
   - Email: `test@example.com`
   - Şifre: `123456`
   - Kullanıcı Adı: `testuser`
4. Kaydolduktan sonra otomatik giriş yapılacak
5. 100 TMT hoş geldin bonusu alacaksın!

## 🎮 Oyunları Dene

1. **Oyunlar** sekmesine tıkla
2. Bir oyun seç (örn: Golden Slots)
3. Bahis miktarı gir (0.1 - 1000 TMT)
4. **Oyna** butonuna tıkla
5. Sonucu gör!

## 💳 Cüzdan İşlemleri

1. **Cüzdan** sekmesine git
2. Para yat ya da çek
3. Tüm işlemler TMT cinsinden
4. İşlem geçmişini görmek için aşağı kaydır

## 👤 Profilim

1. **Profilim** sekmesine git
2. Bilgilerini görebilirsin
3. VIP seviyesi ve istatistikleri görebilirsin

## 🛠️ Admin Paneli

1. **Admin** sekmesine git
2. Aşağıdakiler görülebilir:
   - 📊 Platform İstatistikleri
   - 👥 Kayıtlı Kullanıcılar
   - 💰 İşlem Geçmişi

## 📁 Proje Yapısı

```
casinotkm/
├── server.js                 # Backend ana dosyası
├── package.json
├── .env.example
├── migrations/
│   └── run.js               # Database setup
├── routes/
│   ├── auth.js              # Kayıt/Giriş
│   ├── games.js             # Oyun mekanikçi
│   ├── wallet.js            # Cüzdan
│   ├── payments.js          # Ödeme
│   ├── admin.js             # Admin API
│   └── bets.js              # Bahis geçmişi
├── middleware/
│   └── auth.js              # JWT kontrol
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Games.js
    │   │   ├── Wallet.js
    │   │   ├── Profile.js
    │   │   └── AdminPanel.js
    │   ├── utils/
    │   │   └── CurrencyFormatter.js
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## 🎲 Oyun Türleri

| Oyun | Min Bahis | Max Bahis | RTP |
|------|-----------|-----------|-----|
| 🎰 Golden Slots | 0.1 TMT | 1000 TMT | 96.5% |
| 🎴 Blackjack | 1 TMT | 500 TMT | 99.6% |
| 🎡 Rulet | 0.5 TMT | 2000 TMT | 97.3% |
| 🃏 Poker | 0.1 TMT | 5000 TMT | 98.0% |
| 🎲 Baccarat | 1 TMT | 1000 TMT | 98.8% |
| 🎪 Craps | 0.5 TMT | 1000 TMT | 98.6% |
| 🕹️ Video Poker | 0.1 TMT | 500 TMT | 99.5% |
| 🎯 Keno | 0.1 TMT | 100 TMT | 95.0% |
| 🎫 Bingo | 0.5 TMT | 500 TMT | 94.0% |
| ⚽ Spor Bahisleri | 1 TMT | 5000 TMT | 95.5% |

## 🔐 Önemli Bilgiler

### Para Birimi
✅ Tüm tutarlar **Türkmenistan Manatı (TMT)** olarak gösterilir.

### Güvenlik
✅ Tüm şifreler bcrypt ile hashlenir
✅ API JWT token kullanır
✅ CORS koruması etkin

### İlk Bakiye
✅ Her yeni kullanıcı **100 TMT** hoş geldin bonusu alır

## 🆘 Sorun Giderme

### "Port 5000 zaten kullanılıyor" hatası
```bash
PORT=5001 npm start
```

### "Cannot connect to database" hatası
```bash
# PostgreSQL'in çalışıp çalışmadığını kontrol et
sudo systemctl status postgresql

# PostgreSQL'i başlat
sudo systemctl start postgresql
```

### "npm install" hataları
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## 📞 API Örnekleri

### Kayıt
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456","username":"testuser"}'
```

### Giriş
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'
```

### Oyun Oyna
```bash
curl -X POST http://localhost:5000/api/games/1/play \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"bet_amount":10}'
```

## 📊 Veri Tabanı

Otomatik oluşturulan tablolar:
- `users` - Kullanıcı bilgileri
- `games` - Oyun bilgileri
- `bets` - Bahis kayıtları
- `transactions` - Para işlemleri
- `bonuses` - Bonus bilgileri
- `game_history` - Oyun geçmişi
- `admin_users` - Admin hesapları

## 🚀 Production'a Alma

### Önce kontrol et:
1. `.env` dosyasında güvenli şifreler var mı?
2. `JWT_SECRET` ve `STRIPE_SECRET_KEY` ayarlandı mı?
3. Database backupları ayarlandı mı?
4. SSL/HTTPS etkin mi?

### Deploy seçenekleri:
- Heroku
- AWS
- DigitalOcean
- Google Cloud
- Vercel (Frontend)

## 📚 Daha Fazla Bilgi

- [SETUP.md](./SETUP.md) - Ayrıntılı kurulum
- [README.md](./README.md) - Proje hakkında

---

**Başarıyla kuruldun! 🎉**

Sorunlar yaşıyorsan GitHub'da issue açabilirsin.
