# AGENTS.md

## Dev environment tips
- Use `yarn install` from the repo root to set up dependencies if you have not already.
- Run `yarn dev` to launch the Next.js development server (Turbopack is enabled by default).
- When you add new dependencies prefer `yarn add <package>` (or `yarn add -D <package>` for dev-only packages).
- Restart the dev server after modifying the TypeScript configuration or adding environment variables.

## Testing instructions
- Lint the project with `yarn lint` from the repository root.
- The project currently relies on linting as the primary automated check; add tests alongside new features when possible.
- Before committing, ensure `yarn lint` completes without warnings or errors.

## PR instructions
- Title format: `[frontend] <Title>`
- Always run `yarn lint` before committing.
