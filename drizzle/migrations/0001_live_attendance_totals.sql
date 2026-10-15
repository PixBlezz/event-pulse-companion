CREATE OR REPLACE FUNCTION public.prevent_duplicate_attendance()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
 NEW.student_id := lower(trim(NEW.student_id));
 NEW.event_title := trim(NEW.event_title);
 PERFORM pg_advisory_xact_lock(hashtextextended(NEW.event_title || ':' || NEW.student_id, 0));
 IF EXISTS (SELECT 1 FROM public.attendees WHERE event_title=NEW.event_title AND lower(trim(student_id))=NEW.student_id) THEN
 RAISE EXCEPTION 'You have already confirmed for this event.' USING ERRCODE='23505';
 END IF;
 RETURN NEW;
END $$;
CREATE OR REPLACE TRIGGER prevent_duplicate_attendance BEFORE INSERT ON public.attendees FOR EACH ROW EXECUTE FUNCTION public.prevent_duplicate_attendance();
CREATE OR REPLACE FUNCTION public.get_attendance_totals()
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
 SELECT jsonb_build_object(
 'students', (SELECT count(DISTINCT lower(trim(student_id))) FROM public.attendees),
 'confirmations', (SELECT count(*) FROM (SELECT DISTINCT event_title, lower(trim(student_id)) FROM public.attendees) d),
 'events', COALESCE((SELECT jsonb_object_agg(event_title, total) FROM (SELECT event_title, count(DISTINCT lower(trim(student_id))) AS total FROM public.attendees GROUP BY event_title) c), '{}'::jsonb)
 );
$$;
REVOKE ALL ON FUNCTION public.get_attendance_totals() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_attendance_totals() TO anon, authenticated, service_role;