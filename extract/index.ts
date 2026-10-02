import fs from 'fs';
import path from 'path';
import { DateTime } from 'luxon';
import { parse } from 'csv-parse/sync';

const ROOT_PATH = path.resolve(__dirname, '..');
const BASE_DATA_PATH = path.resolve(process.env.BASE_DATA_PATH || path.join(ROOT_PATH, 'data'));
const OUTPUT_PATH = path.resolve(process.env.OUTPUT_PATH || path.join(ROOT_PATH, 'output'));

type Author = 'raoul' | 'thomas' | 'yorick' | 'robin' | 'simon' | 'rogier' | 'unknown';
type Message = {
  author: Author;
  timestamp: string;
  text: string;
}

type Parser = (filename: string) => Message[];
const txtParser = (filename: string, regex: RegExp, dateFormat: string): Message[] => {
  const matches = fs.readFileSync(path.join(BASE_DATA_PATH, filename)).toString().matchAll(regex);
  const messages: Message[] = [];
  for (const match of matches) {
    messages.push({
      author: match[2].split(' ')[0].toLowerCase().replace('pablo', 'raoul') as Author,
      timestamp: DateTime.fromFormat(match[1], dateFormat).toISO() || 'none',
      text: match[3],
    });
  }
  return messages;
}
const parsers: { [extension: string]: Parser | undefined } = {
  '.csv': (filename) => {
    const authorIds = new Map<string, Author>([
      ['443', 'raoul'],
      ['38', 'thomas'],
      ['0',  'yorick'],
      ['413', 'robin'],
      ['190', 'simon'],
      ['292', 'rogier'],
    ]);
    return parse(
      fs.readFileSync(path.join(BASE_DATA_PATH, filename)).toString(),
      { columns: true, delimiter: ';', skip_empty_lines: true }
    ).map((record: { [key: string]: string | undefined }): Message => ({
      author: authorIds.get(record.sender_jid_row_id || '') || 'unknown',
      timestamp: DateTime.fromMillis(Number.parseInt(record.timestamp || '0', 10)).toISO() || 'none',
      text: record.text_data || '',
    }));
  },
  '.nl.txt': (filename) => {
    const regex = /^(\d\d-\d\d-\d\d\d\d \d\d:\d\d) - ([^:]+): ?((?:(?!^\d\d-\d\d-\d\d\d\d \d\d:\d\d - (.+):)(?:.|\n))*)$/gm;
    return txtParser(filename, regex, 'dd-MM-yyyy HH:mm');
  },
  '.en.txt': (filename) => {
    const regex = /^(\d\d\/\d\d\/\d\d\d\d, \d\d:\d\d) - ([^:]+): ?((?:(?!\d\d\/\d\d\/\d\d\d\d, \d\d:\d\d - (.+):)(?:.|\n))*)$/gm;
    return txtParser(filename, regex, 'dd/MM/yyyy, HH:mm');
  },
  '.en2.txt': (filename) => {
    const regex = /^(\d{1,2}\/\d{1,2}\/\d\d, \d\d:\d\d) - ([^:]+): (.*)$/gm;
    return txtParser(filename, regex, 'M/d/yy, HH:mm');
  },
};

const program = (filenames: string[]): void => {
  // Parse input
  console.info('Parse input:');
  const allMessages: Message[] = [];
  filenames.forEach(filename => {
    const matchedParsers = Object.entries(parsers).filter(([key]) => filename.endsWith(key));
    if (matchedParsers.length !== 1 || matchedParsers[0][1] === undefined) {
      console.info(`Skipped ${filename} as ${matchedParsers.length} parsers exists for: ${filename} [${matchedParsers.map(([key]) => key).join(', ')}]`);
      return;
    }
    const parser = matchedParsers[0][1];
    console.info(' -', filename);
    const messages = parser(filename);
    if (messages.length > 0) {
      console.info('   found:', messages.length, 'messages (from', messages[0].timestamp, 'until', messages[messages.length - 1].timestamp, ')');
    } else {
      console.info(' -', filename, 'found:', 0, 'messages');
    }
    allMessages.push(...messages);
  });

  // Extract information
  console.info('\nExtract information:');
  const analytics: { [date: string]: Map<Author, boolean> } = {};
  allMessages.forEach(message => {
    const timestamp = DateTime.fromISO(message.timestamp);
    if (
      timestamp.hour === 11
      && (timestamp.minute >= 10 && timestamp.minute <= 12)
      && (message.text.trim() === '11:11' || message.text.trim() === '11:11:11')
    ) {
      const date = timestamp.toISODate() || 'none';
      if (analytics[date] === undefined) {
        analytics[date] = new Map();
      }
      analytics[date].set(message.author, timestamp.minute === 11);
    }
  });
  type Day = { date: string, authors: Map<Author, boolean> };
  const days: Day[] = [];
  for (const date in analytics) {
    days.push({ date, authors: analytics[date] });
  }
  console.info('- Found', days.length, 'dates on which 11:11 was posted (by at least 1 person).');
  days.sort((a, b) => a.date.localeCompare(b.date));
  fs.mkdirSync(OUTPUT_PATH, { recursive: true });
  const now = DateTime.now().startOf('minute');
  const outputFilename = path.join(OUTPUT_PATH, `${now.toISODate()}-${now.toISOTime({ suppressSeconds: true, includeOffset: false })!.replace(':', '-')}`);
  fs.writeFileSync(
    `${outputFilename}.txt`,
    days.map(date => `${date.date} ${Array.from(date.authors.entries()).map(([author, exact]) => `${exact ? '' : '~'}${author}`).join(', ')}`).join('\n') + '\n',
  );
  console.info(`- Relevant information has been written to ${outputFilename}.txt`);

  // The daily export is the single source for the web app's analysis.
  fs.copyFileSync(`${outputFilename}.txt`, path.join(OUTPUT_PATH, 'latest.txt'));
}

program(fs.readdirSync(BASE_DATA_PATH));
