-- Create a table for site configuration (Google Sheet URL)
CREATE TABLE public.site_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (everyone can read the sheet URL)
CREATE POLICY "Anyone can read site config" 
ON public.site_config 
FOR SELECT 
USING (true);

-- Create policy for authenticated users to manage config (admin only)
CREATE POLICY "Authenticated users can insert config" 
ON public.site_config 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update config" 
ON public.site_config 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete config" 
ON public.site_config 
FOR DELETE 
TO authenticated
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_site_config_updated_at
BEFORE UPDATE ON public.site_config
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default empty config
INSERT INTO public.site_config (key, value) VALUES ('google_sheet_url', '');