-- Create app_role enum for role-based access control
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for proper role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policy: Only admins can read the user_roles table
CREATE POLICY "Admins can read user roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Drop existing overly permissive policies on site_config
DROP POLICY IF EXISTS "Authenticated users can delete config" ON public.site_config;
DROP POLICY IF EXISTS "Authenticated users can insert config" ON public.site_config;
DROP POLICY IF EXISTS "Authenticated users can update config" ON public.site_config;

-- Create admin-only policies for site_config modifications
CREATE POLICY "Admins can insert config"
ON public.site_config FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update config"
ON public.site_config FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete config"
ON public.site_config FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create inquiries table for storing contact form submissions
CREATE TABLE public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id TEXT,
  property_title TEXT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  preferred_contact TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'new'
);

-- Enable RLS on inquiries
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Anyone can submit inquiries (public form)
CREATE POLICY "Anyone can submit inquiries"
ON public.inquiries FOR INSERT
WITH CHECK (true);

-- Only admins can read inquiries
CREATE POLICY "Admins can read inquiries"
ON public.inquiries FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can update inquiry status
CREATE POLICY "Admins can update inquiries"
ON public.inquiries FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete inquiries
CREATE POLICY "Admins can delete inquiries"
ON public.inquiries FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));