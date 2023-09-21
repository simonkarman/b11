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
      timestamp: DateTime.fromMillis(Number.parseInt(record.received_timestamp || '0', 10)).toISO() || 'none',
      text: record.text_data || '',
    }));
  },
  txt: (filename) => {
    // const lines = fs.readFileSync(BASE_DATA_PATH + filename).toString().split('\n');
    // const txtRegex = /(^1?\d\/[1-3]?\d\/[0-3]?\d), (\d{2}:\d{2}) - (.*): (.*)$/g;
    // const authorNames = new Map<string, Author>([
    //   ['Pablo Schipper',  'raoul'],
    //   ['Thomas Hes', 'thomas'],
    //   ['Yorick van Zweeden', 'yorick'],
    //   ['Robin Sikkens', 'robin'],
    //   ['Simon Karman', 'simon'],
    //   ['Rogier Simons', 'rogier'],
    // ]);
    // let lastMessage: Message = {  timestamp: 'none', author: 'unknown', text: '' };
    // return lines.map((line: string) => {
    //   const result = txtRegex.exec(line)
    //   if (result === null) {
    //     lastMessage.text += line;
    //     return undefined;
    //   } else {
    //     const message: Message = {
    //       author: result[3],
    //       timestamp: result[1] + 'T' + result[2],
    //       text: result[4],
    //     }
    //     lastMessage = message;
    //     return message;
    //   }
    // }).filter(message => message !== undefined) as Message[];
    return [];
  }
};

const program = (filenames: string[]): void => {
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
      console.info(filename, messages.length, 'messages (', messages[0].timestamp, '-', messages[messages.length - 1].timestamp, ')');
    } else {
      console.info(filename, 'no messages found');
    }
    allMessages.push(...messages);
  });
  console.info(allMessages.length, allMessages[allMessages.length - 3]);
}

program(fs.readdirSync(BASE_DATA_PATH));
