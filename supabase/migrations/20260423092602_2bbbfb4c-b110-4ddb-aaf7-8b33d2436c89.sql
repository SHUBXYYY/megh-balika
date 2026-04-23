
-- Allow admins to insert/delete user_roles (but never their own admin row directly via UI for safety we still allow it; UI will prevent)
CREATE POLICY "Admins insert user_roles"
ON public.user_roles FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins delete user_roles"
ON public.user_roles FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Promote a user to admin by their email (admin-only)
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(_email text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'Only admins can promote users';
  END IF;

  SELECT id INTO _uid FROM auth.users WHERE lower(email) = lower(_email) LIMIT 1;
  IF _uid IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'No registered user with that email. Ask them to sign up first.');
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (_uid, 'admin'::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN jsonb_build_object('ok', true, 'user_id', _uid);
END;
$$;

-- Revoke another admin (cannot revoke the last admin)
CREATE OR REPLACE FUNCTION public.revoke_admin(_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _admin_count int;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'Only admins can revoke admins';
  END IF;

  SELECT count(*) INTO _admin_count FROM public.user_roles WHERE role = 'admin'::public.app_role;
  IF _admin_count <= 1 THEN
    RETURN jsonb_build_object('ok', false, 'error', 'Cannot revoke the last remaining admin.');
  END IF;

  DELETE FROM public.user_roles WHERE user_id = _user_id AND role = 'admin'::public.app_role;
  RETURN jsonb_build_object('ok', true);
END;
$$;

-- Unique constraint to support ON CONFLICT above
ALTER TABLE public.user_roles
  DROP CONSTRAINT IF EXISTS user_roles_user_role_unique;
ALTER TABLE public.user_roles
  ADD CONSTRAINT user_roles_user_role_unique UNIQUE (user_id, role);
