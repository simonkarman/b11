import fs from 'fs';
import { DateTime } from 'luxon';
import { parse } from 'csv-parse/sync';

const BASE_DATA_PATH = process.env.BASE_DATA_PATH || './data/';

const authors = ['raoul', 'thomas', 'yorick', 'robin', 'simon', 'rogier'] as const;
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
  // Parse input
  console.info('Parse input:');
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
  fs.mkdirSync('output', { recursive: true });
  const now = DateTime.now().startOf('minute');
  const outputFilename = `output/${now.toISODate()}-${now.toISOTime({ suppressSeconds: true, includeOffset: false })!.replace(':', '-')}`;
  fs.writeFileSync(
    `${outputFilename}.txt`,
    days.map(date => `${date.date} ${Array.from(date.authors.entries()).map(([author, exact]) => `${exact ? '' : '~'}${author}`).join(', ')}`).join('\n'),
  );
  console.info(`- Relevant information has been written to ${outputFilename}.txt`);

  // Run analytics
  console.info('\nRun analytics:');
  // A report is generated for each author. Additionally, a report is generated for the whole group of authors.
  type Amount = { exact: number, close: number };
  type Streaks = { [streakLength: string]: number };
  type Report = {
    /** The lifetime amount of 11:11s posted. */
    lifetime: Amount;
    /** The yearly amount of 11:11s posted. */
    yearlies: { [year: string]: Amount };
    /** The year-monthly amount of 11:11s posted. */
    yearMonthlies: { [yearMonth: string]: Amount };
    /** The 'exact' amount 11:11s posted per the total amount of people posted that day. */
    collaborations: { [numberOnDay: string]: number };
    /** The 'exact' amount of times a daily streak of a certain length was reached of posting a 11:11s posted. */
    positiveStreaks: Streaks;
    /** The 'exact' amount of times a daily streak of a certain length was reached of not posting any 11:11 post */
    negativeStreaks: Streaks;
  };
  const generateReportFor = (author: Author): Report => {
    console.info('- Generating report for', author);
    const authorDays = days.filter(date => date.authors.get(author) !== undefined);
    const getAmount = (days: Day[]): Amount => ({
      exact: days.filter(date => date.authors.get(author)).length,
      close: days.filter(date => !date.authors.get(author)).length
    });
    const groupBy = <T, U>(items: T[], toGroupName: (item: T) => string, mapper: (item: T[]) => U): { [groupName: string]: U } => {
      const result: { [groupName: string]: T[] } = {};
      items.forEach(item => {
        const groupName = toGroupName(item);
        if (result[groupName] === undefined) {
          result[groupName] = [];
        }
        result[groupName].push(item);
      });
      return Object.fromEntries(Object.entries(result).map(([key, value]) => [key, mapper(value)]));
    };

    const positiveStreaks: Streaks = {};
    const negativeStreaks: Streaks = {};
    let currentPositiveStreak = 0;
    let currentNegativeStreak = 0;
    let currentDate = DateTime.fromFormat(days[0].date, 'yyyy-MM-dd');
    const lastDate = DateTime.fromFormat(days[days.length - 1].date, 'yyyy-MM-dd');
    while (currentDate <= lastDate) {
      currentDate = currentDate.plus({ day: 1 });
      const hasPosted = analytics[currentDate.toISODate()!]?.get(author) === true;
      if (hasPosted) {
        currentPositiveStreak++;
        if (currentNegativeStreak > 0) {
          if (negativeStreaks[currentNegativeStreak] === undefined) {
            negativeStreaks[currentNegativeStreak] = 0;
          }
          negativeStreaks[currentNegativeStreak] += 1;
          currentNegativeStreak = 0;
        }
      } else {
        currentNegativeStreak++;
        if (currentPositiveStreak > 0) {
          if (positiveStreaks[currentPositiveStreak] === undefined) {
            positiveStreaks[currentPositiveStreak] = 0;
          }
          positiveStreaks[currentPositiveStreak] += 1;
          currentPositiveStreak = 0;
        }
      }
    }
    return {
      lifetime: getAmount(authorDays),
      yearlies: groupBy(authorDays, (item) => item.date.substring(0, 4), getAmount),
      yearMonthlies: groupBy(authorDays, (item) => item.date.substring(0, 7), getAmount),
      collaborations: groupBy(authorDays, (item) => item.authors.size.toString(10), (item) => item.length),
      positiveStreaks,
      negativeStreaks,
    }
  };
  const reports: { [subsetName: string]: Report } = {};
  // TODO: also generate report for all authors
  authors.forEach(author => reports[author] = generateReportFor(author));
  fs.writeFileSync(
    `${outputFilename}.json`,
    JSON.stringify(reports, undefined, 2),
  );

  // Copy files to a latest file
  fs.copyFileSync(`${outputFilename}.txt`, 'output/latest.txt');
  fs.copyFileSync(`${outputFilename}.json`, 'output/latest.json');
}

program(fs.readdirSync(BASE_DATA_PATH));
