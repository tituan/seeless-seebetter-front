This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Install dependencies and start the development server:

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Pull Request Preview Deployments

This project ships with a GitHub Actions workflow that automatically builds and deploys a preview of every pull request via [Vercel](https://vercel.com/).

To activate the workflow you must add the following repository secrets in GitHub:

| Secret | Description |
| --- | --- |
| `VERCEL_TOKEN` | A Vercel token generated from your account settings. |
| `VERCEL_ORG_ID` | The Vercel organisation ID for the project. |
| `VERCEL_PROJECT_ID` | The Vercel project ID for this repository. |

Once these secrets are configured, opening or updating a pull request will trigger a preview deployment. The workflow posts a sticky comment on the pull request with links to the preview URL and the Vercel inspector for easy QA.
