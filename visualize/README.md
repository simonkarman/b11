# Visualize
This is a [Next.js](https://nextjs.org/) that visualizes the data using [recharts](https://recharts.org). This app can be found running on [b11-11.netlify.app](https://b11-11.netlify.app/).

The app reads `output/latest.txt` from the repository. `src/data/days.ts` parses the daily records, `src/analysis/` contains pure functions for filtering, totals, streaks, and collaborations, and the chart components display the results. The selected date range and people are applied in the app, so no generated analytics JSON is needed.

[![Netlify Status](https://api.netlify.com/api/v1/badges/7ebdcebf-ebd5-4540-8138-ddcde2c649b0/deploy-status)](https://app.netlify.com/sites/b11-11/deploys)

## Getting Started
If you would like to run the visualization locally. You can run the commands.
```bash
npm install
npm run visualize
```

You can now view the visualization on [localhost:3000](http://localhost:3000).

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Deploy on Netlify
This project is deployed on Netlify. The deployment is triggered by pushing to the `main` branch. The deployed website can be found at [b11-11.netlify.app](https://b11-11.netlify.app/).
