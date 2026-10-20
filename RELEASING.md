# Releasing

Releases are published to npm by `.github/workflows/release.yml` with npm **trusted publishing**:
GitHub Actions authenticates to npm with OIDC, so there is no npm token to store, and every
release gets a signed provenance statement.

## One-time setup

1. Push this repository to GitHub.
2. Publish the first version once by hand (`npm publish --access public` from a clean `bun run build`),
   or create the package on npmjs.com, so that its settings page exists.
3. On npmjs.com → the `num2words-ts` package → **Settings** → **Trusted publisher** → **GitHub Actions**:
   - Organization or user: your GitHub owner
   - Repository: this repository's name
   - Workflow filename: `release.yml`
   - Environment: `npm` (the workflow runs in a GitHub environment called `npm`; GitHub creates it
     on first use, and you can add required reviewers to it to gate releases)
4. Optional, recommended: in the package settings, set **Publishing access** to "Require two-factor
   authentication and disallow tokens", since publishing no longer needs a token.

## Each release

1. Update `version` in `package.json` (own semver; see README "Versioning"), and `upstream.num2words`
   if the port moved to a new upstream release.
2. Commit, push, and wait for CI to pass.
3. Create a GitHub release with tag `v<version>` (e.g. `v1.0.0`). Publishing the release runs the
   workflow, which re-runs every check, builds, verifies the tag matches `package.json`, and runs
   `npm publish --provenance`.

To rehearse without publishing: Actions → Release → Run workflow (dry run is on by default).
