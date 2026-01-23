-- Enable Supabase Realtime for notifications
ALTER TABLE public.notifications REPLICA IDENTITY FULL;

-- Add notifications to the realtime publication
DO $$ 
BEGIN 
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  ELSE
    -- Handle case where publication doesn't exist yet (standard in new projects)
    CREATE PUBLICATION supabase_realtime FOR TABLE public.notifications;
  END IF;
END $$;

-- Add Slack Webhook support to projects
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS slack_webhook TEXT;
