ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS mp_payment_id TEXT,
  ADD COLUMN IF NOT EXISTS status_detail TEXT,
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP WITH TIME ZONE;

CREATE INDEX IF NOT EXISTS orders_mp_payment_id_idx ON public.orders (mp_payment_id);

GRANT ALL ON public.orders TO service_role;