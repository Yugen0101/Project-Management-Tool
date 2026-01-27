-- Migration 022: Advanced Project Configuration
-- This migration adds columns for strict mode, business hours, task layout, tags, roll-up settings, and tab customization.

ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS is_strict BOOLEAN DEFAULT false;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS business_hours TEXT DEFAULT 'standard';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS task_layout TEXT DEFAULT 'standard';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS roll_up_enabled BOOLEAN DEFAULT false;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS tabs_config TEXT[] DEFAULT '{"dashboard", "tasks", "users", "reports", "documents", "phases", "time_logs", "bugs"}';

-- Create index for tags
CREATE INDEX IF NOT EXISTS idx_projects_tags ON public.projects USING GIN (tags);
