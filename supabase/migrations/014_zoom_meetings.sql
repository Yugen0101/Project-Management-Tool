-- Phase: Zoom Integration
-- This migration introduces the meetings table and security policies.

-- 1. MEETINGS TABLE
CREATE TABLE IF NOT EXISTS public.meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES public.users(id),
  title TEXT NOT NULL,
  description TEXT,
  zoom_meeting_id TEXT NOT NULL,
  join_url TEXT NOT NULL,
  start_url TEXT NOT NULL, -- Only accessible to Admins and Creators via specific queries (not standard select)
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER NOT NULL, -- In minutes
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'completed', 'cancelled')) DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. SECURITY (RLS)
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

-- Admins: Full access
CREATE POLICY "Admins can manage all meetings" ON public.meetings
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
    );

-- Associates: Manage meetings for assigned projects
CREATE POLICY "Associates can manage project meetings" ON public.meetings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_projects 
            WHERE user_id = auth.uid() 
            AND project_id = meetings.project_id 
            AND role = 'associate'
        )
    );

-- Members (and others): View meetings for assigned projects
-- Note: We will use a View or filter the columns in the app to prevent leaking start_url
CREATE POLICY "Members can view project meetings" ON public.meetings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_projects 
            WHERE user_id = auth.uid() 
            AND project_id = meetings.project_id
        )
    );

-- 3. NOTIFICATION INTEGRATION
-- Notifications will be handled via server actions to allow for participant selection.

-- 4. PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_meetings_project_id ON public.meetings(project_id);
CREATE INDEX IF NOT EXISTS idx_meetings_scheduled_at ON public.meetings(scheduled_at);

-- 5. TRIGGER FOR UPDATED_AT
DROP TRIGGER IF EXISTS update_meetings_updated_at ON public.meetings;
CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON public.meetings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
