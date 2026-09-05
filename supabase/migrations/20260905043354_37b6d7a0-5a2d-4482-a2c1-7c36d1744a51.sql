REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.promote_user_to_admin(text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.revoke_admin(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.promote_user_to_admin(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.revoke_admin(uuid) TO authenticated;