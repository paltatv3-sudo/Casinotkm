# API Dokümantasyonu

## Base URL
```
http://localhost:5000/api
```

## Authentication
Tüm korunan endpoints JWT token gerektirir:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Routes

### Kayıt
```
POST /auth/register
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "username": "username"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "username"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Giriş
```
POST /auth/login
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "balance": 100.00
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 🎮 Games Routes

### Tüm Oyunları Listele
```
GET /games
```

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Golden Slots",
    "type": "slots",
    "min_bet": 0.1,
    "max_bet": 1000,
    "rtp": 96.5
  }
]
```

### Oyun Detayı
```
GET /games/:gameId
```

**Response (200):**
```json
{
  "id": 1,
  "name": "Golden Slots",
  "type": "slots",
  "min_bet": 0.1,
  "max_bet": 1000,
  "rtp": 96.5,
  "description": "..."
}
```

### Oyun Oyna
```
POST /games/:gameId/play
```

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "bet_amount": 10
}
```

**Response (200):**
```json
{
  "betId": 123,
  "result": "win",
  "multiplier": 2.5,
  "winAmount": 25,
  "newBalance": 115
}
```

### Oyun Geçmişi
```
GET /games/:gameId/history
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "game_id": 1,
    "bet_amount": 10,
    "win_amount": 25,
    "multiplier": 2.5,
    "result": "win",
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

---

## 💳 Wallet Routes

### Bakiye Kontrolü
```
GET /wallet/balance
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "balance": 115.50,
  "bonus_balance": 0
}
```

### İşlem Geçmişi
```
GET /wallet/transactions
```

**Query Parameters:**
```
limit=50&offset=0
```

**Response (200):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "type": "deposit",
    "amount": 100,
    "status": "completed",
    "created_at": "2024-01-15T10:00:00Z"
  }
]
```

### Para Yatır
```
POST /wallet/add-funds
```

**Body:**
```json
{
  "amount": 50
}
```

**Response (200):**
```json
{
  "message": "Funds added successfully",
  "transaction": {...}
}
```

### Para Çek
```
POST /wallet/withdraw
```

**Body:**
```json
{
  "amount": 50
}
```

**Response (200):**
```json
{
  "message": "Withdrawal requested",
  "transaction": {...}
}
```

---

## 👤 Users Routes

### Profil
```
GET /users/profile
```

**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "balance": 115.50,
  "bonus_balance": 0,
  "vip_level": 0,
  "total_wagered": 500,
  "total_won": 600
}
```

### Profil Güncelle
```
PUT /users/profile
```

**Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890",
  "country": "Turkey"
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully"
}
```

### İstatistikler
```
GET /users/stats
```

**Response (200):**
```json
{
  "total_wagered": 500,
  "total_won": 600,
  "balance": 115.50,
  "vip_level": 0
}
```

---

## 💰 Payments Routes

### Stripe ile Yatır
```
POST /payments/stripe-deposit
```

**Body:**
```json
{
  "amount": 100,
  "token": "tok_visa"
}
```

**Response (200):**
```json
{
  "message": "Deposit successful",
  "chargeId": "ch_1234567890"
}
```

### Kripto Adresi Al
```
GET /payments/crypto-address
```

**Response (200):**
```json
{
  "address": "casino_1_1705316400000",
  "currency": "BTC",
  "message": "Send Bitcoin to this address to deposit"
}
```

---

## 📊 Admin Routes

### İstatistikler
```
GET /admin/stats
```

**Response (200):**
```json
{
  "stats": {
    "total_users": 42,
    "total_bets": 1250,
    "total_wagered": 50000,
    "total_payouts": 45000
  },
  "revenue": {
    "total_revenue": 5000
  }
}
```

### Kullanıcı Listesi
```
GET /admin/users
```

**Response (200):**
```json
[
  {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "balance": 115.50,
    "total_wagered": 500,
    "total_won": 600,
    "created_at": "2024-01-15T10:00:00Z"
  }
]
```

### İşlem Geçmişi
```
GET /admin/transactions
```

**Response (200):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "type": "deposit",
    "amount": 100,
    "status": "completed",
    "created_at": "2024-01-15T10:00:00Z"
  }
]
```

### Kullanıcıyı Sustur
```
POST /admin/user/:userId/suspend
```

**Response (200):**
```json
{
  "message": "User suspended"
}
```

---

## 📈 Bets Routes

### Bahis Geçmişi
```
GET /bets
```

**Response (200):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "game_id": 1,
    "bet_amount": 10,
    "win_amount": 25,
    "multiplier": 2.5,
    "result": "win",
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

### Bahis İstatistikleri
```
GET /bets/stats
```

**Response (200):**
```json
{
  "total_bets": 100,
  "total_wagered": 1000,
  "total_won": 1200
}
```

---

## ❌ Hata Kodları

| Kod | Anlamı | Çözüm |
|-----|--------|-------|
| 400 | Geçersiz İstek | Body'ni kontrol et |
| 401 | Yetki Yok | Token'ı kontrol et |
| 403 | Erişim Reddedildi | Admin yetkisi gerekli |
| 404 | Bulunamadı | ID'yi kontrol et |
| 500 | Sunucu Hatası | Logları kontrol et |

---

## 🔄 Status Kodları

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error
