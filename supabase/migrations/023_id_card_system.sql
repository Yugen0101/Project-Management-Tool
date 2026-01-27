-- ID Card Management System
-- Creates tables for digital ID cards with role-specific templates

-- 1. Card templates for role-specific designs (Created first so id_cards can reference it)
CREATE TABLE IF NOT EXISTS id_card_templates (
    id VARCHAR(50) PRIMARY KEY, -- 'admin', 'associate', 'member'
    name VARCHAR(100) NOT NULL,
    description TEXT,
    role VARCHAR(20) NOT NULL UNIQUE, -- 'admin', 'associate', 'member'
    design_config JSONB NOT NULL, -- Colors, layout, logo position, etc.
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ID Cards table
CREATE TABLE IF NOT EXISTS id_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    card_number VARCHAR(20) UNIQUE NOT NULL,
    employee_id VARCHAR(20) NOT NULL,
    photo_url TEXT NOT NULL,
    department VARCHAR(100),
    phone VARCHAR(20),
    blood_group VARCHAR(5),
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'suspended')),
    qr_code_data TEXT NOT NULL, -- Data URL for QR code image
    qr_verification_url TEXT NOT NULL, -- URL for online verification
    template_id VARCHAR(50) NOT NULL REFERENCES id_card_templates(id), -- 'admin', 'associate', or 'member'
    custom_fields JSONB DEFAULT '{}',
    issued_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_active_card_per_user UNIQUE (user_id, status)
);

-- 3. Card access logs (for tracking card usage/scans)
CREATE TABLE IF NOT EXISTS id_card_access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id UUID REFERENCES id_cards(id) ON DELETE CASCADE,
    scanned_at TIMESTAMPTZ DEFAULT NOW(),
    scanned_by UUID REFERENCES users(id),
    location VARCHAR(255),
    access_granted BOOLEAN,
    verification_method VARCHAR(20), -- 'online' or 'offline'
    notes TEXT
);

-- Insert default templates for each role
INSERT INTO id_card_templates (id, name, role, design_config) VALUES
('admin', 'Administrator Card', 'admin', '{
    "primaryColor": "#d97757",
    "secondaryColor": "#1c1917",
    "accentColor": "#e89c82",
    "headerText": "SYSTEM ADMINISTRATOR",
    "showDepartment": true,
    "showEmployeeId": true,
    "showPhone": true,
    "showBloodGroup": true,
    "logoPosition": "top-center"
}'::jsonb),
('associate', 'Associate Card', 'associate', '{
    "primaryColor": "#7c9473",
    "secondaryColor": "#1c1917",
    "accentColor": "#a8c5a0",
    "headerText": "PROJECT ASSOCIATE",
    "showDepartment": true,
    "showEmployeeId": true,
    "showPhone": true,
    "showBloodGroup": true,
    "logoPosition": "top-center"
}'::jsonb),
('member', 'Member Card', 'member', '{
    "primaryColor": "#6b7280",
    "secondaryColor": "#1c1917",
    "accentColor": "#9ca3af",
    "headerText": "TEAM MEMBER",
    "showDepartment": true,
    "showEmployeeId": true,
    "showPhone": true,
    "showBloodGroup": true,
    "logoPosition": "top-center"
}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    design_config = EXCLUDED.design_config;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_id_cards_user_id ON id_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_id_cards_status ON id_cards(status);
CREATE INDEX IF NOT EXISTS idx_id_cards_card_number ON id_cards(card_number);
CREATE INDEX IF NOT EXISTS idx_id_cards_template_id ON id_cards(template_id);
CREATE INDEX IF NOT EXISTS idx_access_logs_card_id ON id_card_access_logs(card_id);
CREATE INDEX IF NOT EXISTS idx_access_logs_scanned_at ON id_card_access_logs(scanned_at);

-- Enable Row Level Security
ALTER TABLE id_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE id_card_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE id_card_access_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for id_cards
DROP POLICY IF EXISTS "Admins can manage all ID cards" ON id_cards;
CREATE POLICY "Admins can manage all ID cards"
    ON id_cards FOR ALL
    USING (EXISTS (
        SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
    ));

DROP POLICY IF EXISTS "Users can view own ID card" ON id_cards;
CREATE POLICY "Users can view own ID card"
    ON id_cards FOR SELECT
    USING (user_id = auth.uid());

-- RLS Policies for templates
DROP POLICY IF EXISTS "Everyone can view templates" ON id_card_templates;
CREATE POLICY "Everyone can view templates"
    ON id_card_templates FOR SELECT
    USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage templates" ON id_card_templates;
CREATE POLICY "Admins can manage templates"
    ON id_card_templates FOR ALL
    USING (EXISTS (
        SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
    ));

-- RLS Policies for access logs
DROP POLICY IF EXISTS "Admins can view all access logs" ON id_card_access_logs;
CREATE POLICY "Admins can view all access logs"
    ON id_card_access_logs FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
    ));

DROP POLICY IF EXISTS "Users can view their own card access logs" ON id_card_access_logs;
CREATE POLICY "Users can view their own card access logs"
    ON id_card_access_logs FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM id_cards 
        WHERE id_cards.id = id_card_access_logs.card_id 
        AND id_cards.user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "System can insert access logs" ON id_card_access_logs;
CREATE POLICY "System can insert access logs"
    ON id_card_access_logs FOR INSERT
    WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_id_card_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS update_id_cards_updated_at ON id_cards;
CREATE TRIGGER update_id_cards_updated_at
    BEFORE UPDATE ON id_cards
    FOR EACH ROW
    EXECUTE FUNCTION update_id_card_updated_at();

DROP TRIGGER IF EXISTS update_id_card_templates_updated_at ON id_card_templates;
CREATE TRIGGER update_id_card_templates_updated_at
    BEFORE UPDATE ON id_card_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_id_card_updated_at();
