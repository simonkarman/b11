# Extract

From the repository root, run `npm install` and then `npm run extract`. The extractor reads WhatsApp exports from the ignored root `data/` directory and writes `output/latest.txt` plus an ignored timestamped snapshot. Near misses remain marked with `~` for manual inspection.

For isolated runs, `BASE_DATA_PATH` and `OUTPUT_PATH` can point to other directories. Both default to directories at the repository root, independently of the current working directory.
