-- Spam protection support: rate limiting for public inquiry submissions

-- 1) Store per-IP counters in fixed windows
CREATE TABLE IF NOT EXISTS public.inquiry_rate_limits (
  ip TEXT NOT NULL,
  window_seconds INTEGER NOT NULL,
  bucket TIMESTAMPTZ NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (ip, window_seconds, bucket)
);

ALTER TABLE public.inquiry_rate_limits ENABLE ROW LEVEL SECURITY;

-- No policies needed: with RLS enabled, access is denied by default.

-- Keep updated_at current
DROP TRIGGER IF EXISTS update_inquiry_rate_limits_updated_at ON public.inquiry_rate_limits;
CREATE TRIGGER update_inquiry_rate_limits_updated_at
BEFORE UPDATE ON public.inquiry_rate_limits
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 2) Atomic rate-limit check + increment
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  _ip TEXT,
  _window_seconds INTEGER,
  _max_requests INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_ip TEXT;
  v_bucket TIMESTAMPTZ;
  v_count INTEGER;
BEGIN
  v_ip := NULLIF(TRIM(_ip), '');
  IF v_ip IS NULL THEN
    v_ip := 'unknown';
  END IF;

  IF _window_seconds IS NULL OR _window_seconds <= 0 THEN
    RAISE EXCEPTION 'window_seconds must be positive';
  END IF;

  IF _max_requests IS NULL OR _max_requests <= 0 THEN
    RAISE EXCEPTION 'max_requests must be positive';
  END IF;

  -- Bucket start (UTC-ish) for the current window
  v_bucket := to_timestamp(
    floor(extract(epoch FROM now()) / _window_seconds) * _window_seconds
  );

  -- Best-effort cleanup (prevents unbounded growth)
  DELETE FROM public.inquiry_rate_limits
  WHERE bucket < (now() - interval '1 day');

  INSERT INTO public.inquiry_rate_limits (ip, window_seconds, bucket, request_count)
  VALUES (v_ip, _window_seconds, v_bucket, 1)
  ON CONFLICT (ip, window_seconds, bucket)
  DO UPDATE SET
    request_count = public.inquiry_rate_limits.request_count + 1,
    updated_at = now()
  RETURNING request_count INTO v_count;

  RETURN v_count <= _max_requests;
END;
$$;

-- Restrict who can call the function (edge functions use service role)
REVOKE ALL ON FUNCTION public.check_rate_limit(TEXT, INTEGER, INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_rate_limit(TEXT, INTEGER, INTEGER) TO service_role;
