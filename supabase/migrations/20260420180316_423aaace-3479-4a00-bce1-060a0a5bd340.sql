
-- Tighten leads INSERT
DROP POLICY "Anyone can submit lead" ON public.leads;
CREATE POLICY "Anyone can submit lead" ON public.leads
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(full_name) BETWEEN 1 AND 120
    AND char_length(email) BETWEEN 3 AND 254
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND (company IS NULL OR char_length(company) <= 200)
    AND (country IS NULL OR char_length(country) <= 100)
    AND (phone IS NULL OR char_length(phone) <= 40)
    AND (order_volume IS NULL OR char_length(order_volume) <= 100)
    AND (message IS NULL OR char_length(message) <= 4000)
    AND char_length(source) <= 40
  );

-- Tighten chat_sessions INSERT
DROP POLICY "Anyone create session" ON public.chat_sessions;
CREATE POLICY "Anyone create session" ON public.chat_sessions
  FOR INSERT TO anon, authenticated
  WITH CHECK (visitor_label IS NULL OR char_length(visitor_label) <= 120);

-- Tighten chat_messages INSERT
DROP POLICY "Anyone insert messages" ON public.chat_messages;
CREATE POLICY "Anyone insert messages" ON public.chat_messages
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    role IN ('user','assistant','system')
    AND char_length(content) BETWEEN 1 AND 8000
  );

-- Tighten appointments INSERT
DROP POLICY "Anyone book appointment" ON public.appointments;
CREATE POLICY "Anyone book appointment" ON public.appointments
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(full_name) BETWEEN 1 AND 120
    AND char_length(email) BETWEEN 3 AND 254
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND (company IS NULL OR char_length(company) <= 200)
    AND (country IS NULL OR char_length(country) <= 100)
    AND (notes IS NULL OR char_length(notes) <= 2000)
    AND scheduled_at > now()
    AND scheduled_at < now() + interval '1 year'
    AND status = 'pending'
  );
