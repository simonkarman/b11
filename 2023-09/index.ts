import fs from 'fs';
import { DateTime } from 'luxon';
import { parse } from 'csv-parse/sync';

const BASE_DATA_PATH = process.env.BASE_DATA_PATH || '../data/';

type Author = 'raoul' | 'thomas' | 'yorick' | 'robin' | 'simon' | 'rogier' | 'unknown';
type Message = {
  author: Author;
  timestamp: string;
  text: string;
}

type Parser = (filename: string) => Message[];
const parsers: { [extension: string]: Parser | undefined } = {
  csv: (filename) => {
    const authorIds = new Map<string, Author>([
      ['443', 'raoul'],
      ['38', 'thomas'],
      ['0',  'yorick'],
      ['413', 'robin'],
      ['190', 'simon'],
      ['292', 'rogier'],
    ]);
    return parse(
      fs.readFileSync(BASE_DATA_PATH + filename).toString(),
      { columns: true, delimiter: ';', skip_empty_lines: true }
    ).map((record: { [key: string]: string | undefined }): Message => ({
      author: authorIds.get(record.sender_jid_row_id || '') || 'unknown',
      timestamp: DateTime.fromMillis(Number.parseInt(record.timestamp || '0', 10)).toISO() || 'none',
      text: record.text_data || '',
    }));
  },
  txt: (filename) => {
    const regex = /^(\d\d-\d\d-\d\d\d\d \d\d:\d\d) - ([^:]+): ?((?:(?!^\d\d-\d\d-\d\d\d\d \d\d:\d\d - (.+):)(?:.|\n))*)$/gm;
    const matches = fs.readFileSync(BASE_DATA_PATH + filename).toString().matchAll(regex);
    const messages: Message[] = [];
    for (const match of matches) {
      messages.push({
        author: match[2].split(' ')[0].toLowerCase().replace('pablo', 'raoul') as Author,
        timestamp: DateTime.fromFormat(match[1], 'dd-MM-yyyy HH:mm').toISO() || 'none',
        text: match[3],
      })
    }
    return messages;
  }
};

const program = (filenames: string[]): void => {
  // Parsing data
  console.info('Parsing data:');
  const allMessages: Message[] = [];
  filenames.forEach(filename => {
    const extension = filename.substring(filename.lastIndexOf('.') + 1);
    const parser = parsers[extension];
    if (parser === undefined) {
      console.info(`Skipped ${filename} as no parsers exists for .${extension}`)
      return;
    }
    const messages = parser(filename);
    if (messages.length > 0) {
      console.info(' -', filename, 'found:', messages.length, 'messages (from', messages[0].timestamp, 'until', messages[messages.length - 1].timestamp, ')');
    } else {
      console.info(' -', filename, 'found:', 0, 'messages');
    }
    allMessages.push(...messages);
  });

  // Running analytics
  console.info('\nRunning analytics:');
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
  const dates: { date: string, authors: Map<Author, boolean> }[] = [];
  for (const date in analytics) {
    dates.push({ date, authors: analytics[date] });
  }
  console.info('- Found', dates.length, 'dates on which 11:11 was posted by at least 1 person.');
  dates.sort((a, b) => a.date.localeCompare(b.date));
  fs.mkdirSync('output', { recursive: true });
  const now = DateTime.now().startOf('minute');
  const outputFilename = `output/${now.toISODate()}-${now.toISOTime({ suppressSeconds: true, includeOffset: false })!.replace(':', '-')}.txt`;
  fs.writeFileSync(
    outputFilename,
    dates.map(date => `${date.date} ${Array.from(date.authors.entries()).map(([author, exact]) => `${exact ? '' : '~'}${author}`).join(', ')}`).join('\n'),
  );
  console.info(`- Analytics data was written to ${outputFilename}`);
}

program(fs.readdirSync(BASE_DATA_PATH));
