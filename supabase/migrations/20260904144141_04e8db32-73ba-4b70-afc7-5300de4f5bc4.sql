GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION public.promote_user_to_admin(text) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.revoke_admin(uuid) TO authenticated, service_role;