# Project Rules

- This is a Next.js 14 App Router project using TypeScript, Tailwind CSS, and Supabase.
- All monetary/benchmark calculations must live in pure functions in `/lib/calc/` with no React or DOM dependencies, so they can be unit tested.
- All benchmark numbers (CPM, CPC, cost-per-lead, conversion rates) must live in a single config file `/lib/calc/benchmarks.ts` — never scatter magic numbers through the code.
- Never put Supabase service_role keys in client components. Client uses the anon key only.
- Build one feature per request. After each feature, tell me exactly what to run to verify it and stop.
- Use clear TypeScript types for all inputs and outputs of the calculator.

## Supabase

This project uses a **separate** Supabase project (melissa862's Project, ID: `gbvmjcmjwntwdvqlrwqu`) isolated from citrine-dev. This ensures zero risk to the production Creator OS database.
