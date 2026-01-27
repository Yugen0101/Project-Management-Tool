-- ID CARD SYSTEM - FORCE FIX & VISIBILITY RESTORATION
-- Run this in your Supabase SQL Editor if cards are not displaying.

-- 1. Ensure the templates table is correctly structured
CREATE TABLE IF NOT EXISTS public.id_card_templates (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    role VARCHAR(20) NOT NULL UNIQUE,
    design_config JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Ensure the ID cards table is correctly structured with all constraints
CREATE TABLE IF NOT EXISTS public.id_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    card_number VARCHAR(20) UNIQUE NOT NULL,
    employee_id VARCHAR(20) NOT NULL,
    photo_url TEXT NOT NULL,
    department VARCHAR(100),
    phone VARCHAR(20),
    blood_group VARCHAR(5),
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'suspended')),
    qr_code_data TEXT NOT NULL,
    qr_verification_url TEXT NOT NULL,
    template_id VARCHAR(50) NOT NULL REFERENCES public.id_card_templates(id),
    custom_fields JSONB DEFAULT '{}',
    issued_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_active_card_per_user UNIQUE (user_id, status)
);

-- 3. Force add the template_id foreign key if it was missing from a previous run
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'id_cards_template_id_fkey'
    ) THEN
        ALTER TABLE public.id_cards 
        ADD CONSTRAINT id_cards_template_id_fkey 
        FOREIGN KEY (template_id) REFERENCES public.id_card_templates(id);
    END IF;
END $$;

-- 4. Re-insert default templates (Fixes missing template data)
INSERT INTO public.id_card_templates (id, name, role, design_config) VALUES
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

-- 5. Fix RLS - Use the is_admin() helper to avoid recursive policies
ALTER TABLE public.id_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.id_card_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage all ID cards" ON public.id_cards;
CREATE POLICY "Admins can manage all ID cards"
    ON public.id_cards FOR ALL
    USING (public.is_admin());

DROP POLICY IF EXISTS "Users can view own ID card" ON public.id_cards;
CREATE POLICY "Users can view own ID card"
    ON public.id_cards FOR SELECT
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Everyone can view templates" ON public.id_card_templates;
CREATE POLICY "Everyone can view templates"
    ON public.id_card_templates FOR SELECT
    USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage templates" ON public.id_card_templates;
CREATE POLICY "Admins can manage templates"
    ON public.id_card_templates FOR ALL
    USING (public.is_admin());
