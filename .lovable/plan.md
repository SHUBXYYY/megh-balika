# Finish the admin panel work

All admin sections (dashboard, reports, orders, leads, bookings, inquiries, reviews, chats, collections, products, site content, team, blog) are built and wired into the menu. What is left is a full end-to-end check of the panel plus fixing whatever that check turns up, and closing the last open item on the roadmap (final SEO and build verification).

## What I'll do

1. Sign in as an admin in the live preview and walk through every section of the panel one by one:
   - open each tab, confirm it loads without errors and shows real numbers/rows
   - create, edit, publish and delete a test blog post (including a photo upload)
   - add and edit a test product and collection with a photo
   - change an order status, reply to an inquiry, approve a review, save a site-content field
   - check the dashboard counters and Reports filters/CSV download match
   - remove all test entries afterwards

2. Repeat the same walkthrough at phone width so every screen, table and form is usable on mobile.

3. Fix anything broken or awkward that shows up: errors in the browser, blank sections, saves that fail, tables that overflow on small screens, missing empty-state messages.

4. Close the last roadmap item: confirm the public blog feed and single-post pages show correct titles/descriptions in the page source, and that the production build finishes clean.

## Notes

No new features are added here unless the walkthrough shows something genuinely missing. If I find a gap that needs a decision from you (for example, a new field or a new section), I'll ask before building it.

## Technical details

- Playwright walkthrough against `localhost:8080` with a minted auth session for an admin user; console and network logs captured per route.
- Verify Supabase RLS/grants for `blog_posts`, `products`, `collections`, `sales_orders`, `reviews`, `inquiries`, `site_content`, `user_roles` allow the admin CRUD paths the UI uses; run the security linter.
- Run the prerender/build pipeline and inspect emitted `<head>` for `/blog` and one `/blog/:slug` route.
- Update `roadmap.md` when the verification item is done.
