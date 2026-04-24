-- =========================================================
-- SALES ORDERS
-- =========================================================
CREATE TABLE public.sales_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE,
  customer_name text NOT NULL,
  customer_email text,
  customer_phone text,
  shipping_address text,
  status text NOT NULL DEFAULT 'new', -- new | confirmed | shipped | delivered | cancelled
  payment_status text NOT NULL DEFAULT 'unpaid', -- unpaid | partial | paid | refunded
  payment_method text,
  subtotal_inr numeric NOT NULL DEFAULT 0,
  shipping_inr numeric NOT NULL DEFAULT 0,
  tax_inr numeric NOT NULL DEFAULT 0,
  total_inr numeric NOT NULL DEFAULT 0,
  notes text,
  source text DEFAULT 'manual', -- manual | whatsapp | call | website
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.sales_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage sales_orders"
  ON public.sales_orders FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TRIGGER sales_orders_touch
  BEFORE UPDATE ON public.sales_orders
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE INDEX idx_sales_orders_created_at ON public.sales_orders(created_at DESC);
CREATE INDEX idx_sales_orders_status ON public.sales_orders(status);

-- =========================================================
-- ORDER ITEMS
-- =========================================================
CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.sales_orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  sku text,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price_inr numeric NOT NULL DEFAULT 0,
  line_total_inr numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage order_items"
  ON public.order_items FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);

-- =========================================================
-- REVIEWS (public)
-- =========================================================
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_name text NOT NULL,
  reviewer_email text,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title text,
  comment text NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  category text DEFAULT 'service', -- service | product | website | overall
  approved boolean NOT NULL DEFAULT false,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- public can submit (with sanity limits)
CREATE POLICY "Anyone submit review"
  ON public.reviews FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(reviewer_name) BETWEEN 1 AND 80
    AND (reviewer_email IS NULL OR (char_length(reviewer_email) BETWEEN 3 AND 254 AND reviewer_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'))
    AND rating BETWEEN 1 AND 5
    AND char_length(comment) BETWEEN 4 AND 2000
    AND (title IS NULL OR char_length(title) <= 160)
    AND (category IN ('service','product','website','overall'))
    AND approved = false
    AND featured = false
  );

-- public sees only approved reviews; admins see all
CREATE POLICY "View approved or admin"
  ON public.reviews FOR SELECT
  TO anon, authenticated
  USING (approved = true OR public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins update reviews"
  ON public.reviews FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins delete reviews"
  ON public.reviews FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TRIGGER reviews_touch
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE INDEX idx_reviews_created_at ON public.reviews(created_at DESC);
CREATE INDEX idx_reviews_approved ON public.reviews(approved);

-- =========================================================
-- INQUIRY REPLIES (log of admin email replies)
-- =========================================================
CREATE TABLE public.inquiry_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_id uuid NOT NULL REFERENCES public.inquiries(id) ON DELETE CASCADE,
  sent_by uuid, -- admin user id
  to_email text NOT NULL,
  subject text NOT NULL,
  body text NOT NULL,
  status text NOT NULL DEFAULT 'sent', -- sent | drafted | failed
  channel text NOT NULL DEFAULT 'mailto', -- mailto | system
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.inquiry_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage inquiry_replies"
  ON public.inquiry_replies FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE INDEX idx_inquiry_replies_inquiry_id ON public.inquiry_replies(inquiry_id);
