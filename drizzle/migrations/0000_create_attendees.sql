CREATE TABLE public.attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_title TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  student_id TEXT NOT NULL,
  level TEXT NOT NULL,
  phone TEXT NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.attendees TO anon;
GRANT ALL ON public.attendees TO service_role;

ALTER TABLE public.attendees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can confirm attendance"
ON public.attendees FOR INSERT TO anon
WITH CHECK (true);

CREATE POLICY "Anyone can read attendance"
ON public.attendees FOR SELECT TO anon
USING (true);