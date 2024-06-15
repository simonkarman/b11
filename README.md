# B11
Analyze and view [B11](https://svsticky.nl/nl/besturen/11) posts on 11:11

## Getting started
If you would like to analyze the B11 posts on 11:11, you'll have to follow three steps. First add the data, secondly run the analysis, and lastly visualize the results.

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
Not yet implemented. Coming soon!
