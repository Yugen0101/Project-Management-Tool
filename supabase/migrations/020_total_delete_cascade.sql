-- Fix missing cascade delete for meetings hosted by users
ALTER TABLE public.meetings
DROP CONSTRAINT IF EXISTS meetings_created_by_fkey,
ADD CONSTRAINT meetings_created_by_fkey 
FOREIGN KEY (created_by) 
REFERENCES public.users(id) 
ON DELETE CASCADE;

-- Ensure audit logs are preserved even if user is deleted (already using SET NULL but reinforcing)
ALTER TABLE public.audit_logs
DROP CONSTRAINT IF EXISTS audit_logs_user_id_fkey,
ADD CONSTRAINT audit_logs_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES public.users(id) 
ON DELETE SET NULL;
