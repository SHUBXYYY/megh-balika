REVOKE EXECUTE ON FUNCTION public.handle_new_user_profile() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_role() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.promote_user_to_admin(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.revoke_admin(uuid) FROM PUBLIC, anon, authenticated;