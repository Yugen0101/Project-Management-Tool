-- Migration 021: Project Templates and Categories
-- This migration adds support for project templates and grouped view categorization.

-- 1. Update projects table
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS is_template BOOLEAN DEFAULT false;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS template_thumbnail TEXT;

-- 2. Create indexes for faster filtering
CREATE INDEX IF NOT EXISTS idx_projects_is_template ON public.projects(is_template);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_is_public ON public.projects(is_public);

-- 3. Seed some initial templates if they don't exist
-- We use a DO block to ensure we don't duplicate templates if run multiple times
DO $$
DECLARE
    admin_id UUID;
BEGIN
    SELECT id INTO admin_id FROM public.users WHERE role = 'admin' LIMIT 1;
    
    IF admin_id IS NOT NULL THEN
        -- Software Development Template
        IF NOT EXISTS (SELECT 1 FROM public.projects WHERE name = 'Software Engineering Node' AND is_template = true) THEN
            INSERT INTO public.projects (name, description, start_date, end_date, priority, status, created_by, is_template, category)
            VALUES (
                'Software Engineering Node', 
                'Standard SDLC workflow with Sprint cycles, backlog grooming, and integrated CI/CD tracking.',
                CURRENT_DATE,
                CURRENT_DATE + INTERVAL '90 days',
                'medium',
                'active',
                admin_id,
                true,
                'Software/IT'
            );
        END IF;

        -- Construction/Infrastructure Template
        IF NOT EXISTS (SELECT 1 FROM public.projects WHERE name = 'Infrastructure Deployment' AND is_template = true) THEN
            INSERT INTO public.projects (name, description, start_date, end_date, priority, status, created_by, is_template, category)
            VALUES (
                'Infrastructure Deployment', 
                'Architectural roadmap for large-scale physical infrastructure projects. Focuses on phase transitions and milestone tracking.',
                CURRENT_DATE,
                CURRENT_DATE + INTERVAL '180 days',
                'high',
                'active',
                admin_id,
                true,
                'Construction'
            );
        END IF;

        -- Pharmaceutical/Pharma Template
        IF NOT EXISTS (SELECT 1 FROM public.projects WHERE name = 'Clinical Matrix' AND is_template = true) THEN
            INSERT INTO public.projects (name, description, start_date, end_date, priority, status, created_by, is_template, category)
            VALUES (
                'Clinical Matrix', 
                'Strictly governed workflow for clinical trials and pharmaceutical research. Integrated compliance checkpoints.',
                CURRENT_DATE,
                CURRENT_DATE + INTERVAL '365 days',
                'critical',
                'active',
                admin_id,
                true,
                'Pharma'
            );
        END IF;

        -- Marketing/Sales Template
        IF NOT EXISTS (SELECT 1 FROM public.projects WHERE name = 'Marketing Launch Matrix' AND is_template = true) THEN
            INSERT INTO public.projects (name, description, start_date, end_date, priority, status, created_by, is_template, category)
            VALUES (
                'Marketing Launch Matrix', 
                'Comprehensive campaign workflow with asset management, social scheduling, and lead tracking milestones.',
                CURRENT_DATE,
                CURRENT_DATE + INTERVAL '45 days',
                'high',
                'active',
                admin_id,
                true,
                'Marketing/Sales'
            );
        END IF;

        -- HR Onboarding Template
        IF NOT EXISTS (SELECT 1 FROM public.projects WHERE name = 'Personnel Initialization' AND is_template = true) THEN
            INSERT INTO public.projects (name, description, start_date, end_date, priority, status, created_by, is_template, category)
            VALUES (
                'Personnel Initialization', 
                'Standardized onboarding flow for new operative units. Document verification and training sequence.',
                CURRENT_DATE,
                CURRENT_DATE + INTERVAL '14 days',
                'medium',
                'active',
                admin_id,
                true,
                'HR/Operations'
            );
        END IF;

        -- Research/R&D Template
        IF NOT EXISTS (SELECT 1 FROM public.projects WHERE name = 'Quantum Research Node' AND is_template = true) THEN
            INSERT INTO public.projects (name, description, start_date, end_date, priority, status, created_by, is_template, category)
            VALUES (
                'Quantum Research Node', 
                'Iterative research workflow with hypothesis testing, peer review cycles, and documentation archiving.',
                CURRENT_DATE,
                CURRENT_DATE + INTERVAL '120 days',
                'medium',
                'active',
                admin_id,
                true,
                'Research/R&D'
            );
        END IF;
    END IF;
END $$;
