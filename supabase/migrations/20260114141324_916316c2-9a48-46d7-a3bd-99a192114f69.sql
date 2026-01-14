-- Drop the current public read policy
DROP POLICY IF EXISTS "Anyone can read site config" ON public.site_config;

-- Create new policy: only admins can read site_config
CREATE POLICY "Only admins can read site config" 
ON public.site_config 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'::app_role));