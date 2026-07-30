CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  cpf text,
  phone text,
  plan text NOT NULL,
  bumps text[] NOT NULL DEFAULT '{}',
  total_cents integer NOT NULL,
  pay_method text NOT NULL,
  status text NOT NULL DEFAULT 'iniciado'
);

GRANT INSERT ON public.orders TO anon, authenticated;
GRANT ALL ON public.orders TO service_role;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create an order" ON public.orders
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);