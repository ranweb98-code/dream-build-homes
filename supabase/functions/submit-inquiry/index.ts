import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limit configuration
const RATE_LIMIT_WINDOW_SECONDS = 3600; // 1 hour
const RATE_LIMIT_MAX_REQUESTS = 10; // max 10 inquiries per IP per hour

// Input validation
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

function validateString(str: string, minLength: number, maxLength: number): boolean {
  return typeof str === 'string' && str.trim().length >= minLength && str.length <= maxLength;
}

interface InquiryPayload {
  fullName: string;
  email: string;
  message: string;
  propertyId?: string;
  propertyTitle?: string;
}

function getClientIP(req: Request): string {
  // Check common headers for client IP (from proxies/load balancers)
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, the first one is the client
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIP = req.headers.get('x-real-ip');
  if (realIP) {
    return realIP.trim();
  }
  
  const cfConnectingIP = req.headers.get('cf-connecting-ip');
  if (cfConnectingIP) {
    return cfConnectingIP.trim();
  }
  
  return 'unknown';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get client IP for rate limiting
    const clientIP = getClientIP(req);
    console.log(`Inquiry submission from IP: ${clientIP.substring(0, 10)}***`);
    
    // Check rate limit
    const { data: rateLimitOk, error: rateLimitError } = await supabase.rpc('check_rate_limit', {
      _ip: clientIP,
      _window_seconds: RATE_LIMIT_WINDOW_SECONDS,
      _max_requests: RATE_LIMIT_MAX_REQUESTS,
    });
    
    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError);
      // On error, allow the request but log it
    } else if (rateLimitOk === false) {
      console.warn(`Rate limit exceeded for IP: ${clientIP.substring(0, 10)}***`);
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Parse and validate input
    let payload: InquiryPayload;
    try {
      payload = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON payload' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { fullName, email, message, propertyId, propertyTitle } = payload;
    
    // Validate required fields
    const errors: string[] = [];
    
    if (!validateString(fullName, 2, 100)) {
      errors.push('Name must be between 2 and 100 characters');
    }
    
    if (!validateEmail(email)) {
      errors.push('Invalid email address');
    }
    
    if (!validateString(message, 10, 1000)) {
      errors.push('Message must be between 10 and 1000 characters');
    }
    
    // Validate optional fields if provided
    if (propertyId !== undefined && propertyId !== null) {
      if (typeof propertyId !== 'string' || propertyId.length > 100) {
        errors.push('Invalid property ID');
      }
    }
    
    if (propertyTitle !== undefined && propertyTitle !== null) {
      if (typeof propertyTitle !== 'string' || propertyTitle.length > 200) {
        errors.push('Invalid property title');
      }
    }
    
    if (errors.length > 0) {
      return new Response(
        JSON.stringify({ error: 'Validation failed', details: errors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Insert inquiry (phone and preferred_contact now optional/defaulted)
    const { data, error: insertError } = await supabase
      .from('inquiries')
      .insert({
        property_id: propertyId || null,
        property_title: propertyTitle || null,
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: '', // No longer collecting phone
        message: message.trim(),
        preferred_contact: 'email', // Always email now
      })
      .select('id')
      .single();
    
    if (insertError) {
      console.error('Insert error:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to submit inquiry' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Inquiry submitted successfully: ${data.id}`);
    
    return new Response(
      JSON.stringify({ success: true, id: data.id }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
