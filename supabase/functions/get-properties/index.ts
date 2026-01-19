import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SheetRow {
  id: string;
  title: string;
  price: string;
  city: string;
  area: string;
  rooms: string;
  baths: string;
  size: string;
  description: string;
  status: string;
  images: string;
  featured: string;
}

interface Property {
  id: string;
  title: string;
  price: number;
  city: string;
  area: string;
  rooms: number;
  baths: number;
  size: number;
  description: string;
  status: 'for_sale' | 'sold';
  images: string[];
  featured: boolean;
}

function parseSheetData(data: SheetRow[]): Property[] {
  return data.map((row) => ({
    id: String(row.id || '').trim(),
    title: String(row.title || '').trim(),
    price: parseInt(String(row.price || '0').replace(/[^0-9]/g, ''), 10) || 0,
    city: String(row.city || '').trim(),
    area: String(row.area || '').trim(),
    rooms: parseInt(String(row.rooms || '0'), 10) || 0,
    baths: parseInt(String(row.baths || '0'), 10) || 0,
    size: parseInt(String(row.size || '0').replace(/[^0-9]/g, ''), 10) || 0,
    description: String(row.description || '').trim(),
    status: (String(row.status || 'for_sale').toLowerCase().trim() === 'sold' ? 'sold' : 'for_sale') as 'for_sale' | 'sold',
    images: String(row.images || '')
      .split(',')
      .map((url) => url.trim())
      .filter((url) => url.length > 0),
    featured: String(row.featured || '').toLowerCase().trim() === 'true',
  })).filter((property) => property.id && property.title);
}

function convertSheetUrlToJsonUrl(url: string): string | null {
  // Validate URL security
  let parsed: URL;
  try {
    parsed = new URL(url);
    
    // Only allow HTTPS
    if (parsed.protocol !== 'https:') {
      console.error('Only HTTPS URLs are allowed');
      return null;
    }
    
    // Strict whitelist for Google Sheets domain only
    if (parsed.hostname !== 'docs.google.com') {
      console.error('Only Google Sheets URLs are allowed');
      return null;
    }
    
    // Validate path starts with /spreadsheets/d/ to prevent other Google services
    if (!parsed.pathname.startsWith('/spreadsheets/d/')) {
      console.error('URL must be a Google Sheets spreadsheet URL');
      return null;
    }
  } catch {
    console.error('Invalid URL format');
    return null;
  }

  // Extract sheet ID with strict pattern matching - use pathname, not full URL
  const sheetIdPattern = /^\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
  const match = parsed.pathname.match(sheetIdPattern);
  
  if (match && match[1]) {
    const sheetId = match[1];
    // Validate sheet ID format (alphanumeric, hyphens, underscores only)
    if (!/^[a-zA-Z0-9-_]+$/.test(sheetId)) {
      console.error('Invalid sheet ID format');
      return null;
    }
    return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;
  }
  
  console.error('Could not extract sheet ID from URL');
  return null;
}

function parseGoogleSheetsResponse(text: string): SheetRow[] {
  const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?$/);
  if (!jsonMatch) {
    throw new Error('Invalid Google Sheets response format');
  }

  const data = JSON.parse(jsonMatch[1]);
  const cols = data.table.cols.map((col: { label: string }) => 
    col.label.toLowerCase().trim()
  );
  const rows = data.table.rows;

  return rows.map((row: { c: Array<{ v: unknown } | null> }) => {
    const obj: Partial<SheetRow> = {};
    row.c.forEach((cell, index) => {
      const key = cols[index] as keyof SheetRow;
      if (key) {
        obj[key] = cell?.v != null ? String(cell.v) : '';
      }
    });
    return {
      id: obj.id || '',
      title: obj.title || '',
      price: obj.price || '',
      city: obj.city || '',
      area: obj.area || '',
      rooms: obj.rooms || '',
      baths: obj.baths || '',
      size: obj.size || '',
      description: obj.description || '',
      status: obj.status || '',
      images: obj.images || '',
      featured: obj.featured || '',
    };
  });
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role to read config
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the Google Sheet URL from site_config (using service role bypasses RLS)
    const { data: configData, error: configError } = await supabase
      .from('site_config')
      .select('value')
      .eq('key', 'google_sheet_url')
      .maybeSingle();

    if (configError) {
      console.error('Config error:', configError);
      return new Response(
        JSON.stringify({ properties: [], error: 'Failed to load configuration' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const sheetUrl = configData?.value || '';

    if (!sheetUrl.trim()) {
      return new Response(
        JSON.stringify({ properties: [], message: 'No Google Sheet configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const jsonUrl = convertSheetUrlToJsonUrl(sheetUrl);
    if (!jsonUrl) {
      return new Response(
        JSON.stringify({ properties: [], error: 'Invalid Google Sheets URL configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(jsonUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error('Failed to fetch sheet data');
    }

    const text = await response.text();
    const sheetData = parseGoogleSheetsResponse(text);
    const properties = parseSheetData(sheetData);

    return new Response(
      JSON.stringify({ properties }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error fetching properties:', error);
    return new Response(
      JSON.stringify({ properties: [], error: error instanceof Error ? error.message : 'Failed to fetch properties' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
