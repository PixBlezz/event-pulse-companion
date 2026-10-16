CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  event_date text NOT NULL,
  venue text NOT NULL,
  tag text NOT NULL,
  image text NOT NULL,
  description text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO anon;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read events" ON public.events FOR SELECT TO anon USING (true);
CREATE POLICY "Anyone can create events" ON public.events FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anyone can delete events" ON public.events FOR DELETE TO anon USING (true);