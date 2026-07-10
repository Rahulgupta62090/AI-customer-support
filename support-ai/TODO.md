# TODO

## Task: Fix Mongoose buffering timed out error

- [x] Update `inlineagent/app/lib/db.ts` to throw if `MONGODB_URL` missing and to not swallow connection errors.
- [x] Update `inlineagent/app/api/settings/route.ts` to use `upsert: true` for `findOneAndUpdate`.
- [x] Run Next.js typecheck/lint (if available) and ensure build succeeds (eslint still has pre-existing warnings/errors in other files).



