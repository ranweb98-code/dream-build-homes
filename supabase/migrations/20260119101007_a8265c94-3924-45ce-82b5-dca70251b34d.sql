-- Add missing RLS policies to user_roles table to prevent privilege escalation

-- Allow only admins to insert new role assignments
CREATE POLICY "Only admins can assign roles"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow only admins to update role assignments
CREATE POLICY "Only admins can modify roles"
ON public.user_roles FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow only admins to delete role assignments
CREATE POLICY "Only admins can remove roles"
ON public.user_roles FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));