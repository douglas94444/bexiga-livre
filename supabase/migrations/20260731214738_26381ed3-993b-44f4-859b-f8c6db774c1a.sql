DROP POLICY IF EXISTS "Anyone can create an order" ON public.orders;

REVOKE ALL ON public.orders FROM anon;
REVOKE ALL ON public.orders FROM authenticated;
GRANT ALL ON public.orders TO service_role;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders FORCE ROW LEVEL SECURITY;
ALTER TABLE public.orders NO FORCE ROW LEVEL SECURITY;

CREATE POLICY "No public read of orders"
  ON public.orders FOR SELECT TO anon, authenticated USING (false);

CREATE POLICY "No public insert of orders"
  ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (false);

CREATE POLICY "No public update of orders"
  ON public.orders FOR UPDATE TO anon, authenticated USING (false) WITH CHECK (false);

CREATE POLICY "No public delete of orders"
  ON public.orders FOR DELETE TO anon, authenticated USING (false);