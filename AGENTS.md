# Architecture rules
- Use a shared event catalog and aggregate attendance RPC for public counters; public pages must not fetch personal attendance records.
- Refresh tracking periodically and immediately after a successful attendance submission so public totals and admin lists stay current.
- Preserve the existing secret-link admin access model; it is obscurity, not authentication.