# B11
Analyze and view [B11](https://svsticky.nl/nl/besturen/11) posts on 11:11

## Getting started
If you would like to analyze the B11 posts on 11:11, you'll have to follow three steps. First add the data, secondly run the analysis, and lastly visualize the results.

> Note: You can skip step 1 and 2 if you want to use the latest data. The latest data is already included in this repository.

### 1. Add data
Create a `data/` directory in the root of this repository and add the CSV file and txt file exports from WhatsApp to this directory.

- Expected .csv header: `sender_jid_row_id;timestamp;received_timestamp;receipt_server_timestamp;text_data`
- Expected .nl.txt format: `18-09-2020 09:55 - Simon Karman: Hoe gaat het?`

### 2. Analyze
You can run this program using npm with the following commands.
```bash
npm install
npm run analyze
```

This will create a `output/` directory. The `latest.json` and `latest.txt` will contain the output of the latest analysis.

### 3. Visualize
The `visualize/` directory contains a React app that visualizes the data using [recharts](https://recharts.org). This app can be found running on [b11-11.netlify.app](https://b11-11.netlify.app/).

If you would like to run the visualization locally. You can run the commands.
```bash
npm --prefix visualize install
npm --prefix visualize dev
```

You can now view the visualization on [localhost:3000](http://localhost:3000).

More information can be found in the [README.md](visualize/README.md) in the `visualize/` directory.
