import fs from 'fs';
import { DateTime } from 'luxon';

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
    console.info('csv parser:', filename);
    const lines = fs.readFileSync(BASE_DATA_PATH + filename).toString().split('\n');
    if (lines[0] !== 'sender_jid_row_id;timestamp;received_timestamp;receipt_server_timestamp;text_data') {
      throw new Error(`cannot parse csv with header: ${lines[0]}`);
    }
    const authorIds = new Map<number, Author>([
      [443, 'raoul'],
      [38, 'thomas'],
      [0,  'yorick'],
      [413, 'robin'],
      [190, 'simon'],
      [292, 'rogier'],
    ]);
    return lines.slice(1).map(line => {
      const columns = line.split(';');
      const author = authorIds.get(Number.parseInt(columns[0])) || 'unknown';
      return {
        author,
        timestamp: DateTime.fromMillis(Number.parseInt(columns[2], 10)).toISO() || 'none',
        text: columns[4],
      }
    });
  },
  txt: (filename) => {
    console.info('txt parser:', filename);
    const lines = fs.readFileSync(BASE_DATA_PATH + filename).toString().split('\n');
    const txtRegex = /(^1?\d\/[1-3]?\d\/[0-3]?\d), (\d{2}:\d{2}) - (.*): (.*)$/g;
    const authorNames = new Map<string, Author>([
      ['Pablo Schipper',  'raoul'],
      ['Thomas Hes', 'thomas'],
      ['', 'yorick'],
      ['Robin Sikkens', 'robin'],
      ['Simon Karman', 'simon'],
      ['Rogier Simons', 'rogier'],
    ]);
    let lastMessage: Message = {  timestamp: 'none', author: 'unknown', text: '' };
    return lines.map((line: string) => {
      const result = txtRegex.exec(line)
      if (result === null) {
        lastMessage.text += line;
        return undefined;
      } else {
        const message: Message = {
          author: result[3],
          timestamp: result[1] + 'T' + result[2],
          text: result[4],
        }
        lastMessage = message;
        return message;
      }
    }).filter(message => message !== undefined) as Message[];
  }
};

const program = (filenames: string[]): void => {
  const messages: Message[] = [];
  filenames.forEach(filename => {
    const extension = filename.substring(filename.lastIndexOf('.') + 1);
    const parser = parsers[extension];
    if (parser === undefined) {
      console.info(`Skipped ${filename} as no parsers exists for .${extension}`)
      return;
    }
    messages.push(...parser(filename));
  });
  console.info(messages.length, messages[11]);
}

program(fs.readdirSync(BASE_DATA_PATH));
