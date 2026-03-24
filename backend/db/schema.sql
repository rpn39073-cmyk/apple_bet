-- postgresql database schema for Apple Bet Phase 2

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    vip_level INT DEFAULT 0,
    vip_xp BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Wallets Table (Supports Multi-currency: Fiat + Crypto)
CREATE TABLE IF NOT EXISTS wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    currency VARCHAR(10) NOT NULL, -- e.g., 'USD', 'USDT', 'BTC', 'ETH'
    balance NUMERIC(18, 8) DEFAULT 0.00000000,
    locked_balance NUMERIC(18, 8) DEFAULT 0.00000000, -- Funds locked in active bets
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, currency)
);

-- Bets Table (General for both Sports and Casino)
CREATE TABLE IF NOT EXISTS bets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    bet_type VARCHAR(20) NOT NULL, -- 'SPORTS', 'CASINO', 'ORIGINALS'
    status VARCHAR(20) DEFAULT 'PENDING', -- 'PENDING', 'WON', 'LOST', 'REFUNDED'
    wager_amount NUMERIC(18, 8) NOT NULL,
    wager_currency VARCHAR(10) NOT NULL,
    potential_payout NUMERIC(18, 8) NOT NULL,
    actual_payout NUMERIC(18, 8) DEFAULT 0.00000000,
    multiplier NUMERIC(8, 2) NOT NULL, -- e.g., Odds for sports, bust point for crash
    details JSONB, -- Flexible payload for specific bet info (e.g. sports selections or crash game round info)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    settled_at TIMESTAMP WITH TIME ZONE
);

-- Transactions Ledger Table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    wallet_id UUID REFERENCES wallets(id),
    tx_type VARCHAR(20) NOT NULL, -- 'DEPOSIT', 'WITHDRAWAL', 'BET_PLACE', 'BET_WIN', 'RAKEBACK'
    amount NUMERIC(18, 8) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    tx_hash VARCHAR(255), -- For crypto transactions on-chain
    status VARCHAR(20) DEFAULT 'COMPLETED', -- 'PENDING', 'COMPLETED', 'FAILED'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_bets_user_id_status ON bets(user_id, status);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
