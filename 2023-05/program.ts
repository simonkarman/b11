import * as fs from 'fs';
import inquirer from 'inquirer';

async function program() {
  const sources = fs.readdirSync('data/', {withFileTypes: true}).map(file => file.name).filter(file => file.endsWith("-recent.txt"));
  console.info("Available sources: (from 'data/*-recent.txt')")
  for (let sourceIndex = 0; sourceIndex < sources.length; sourceIndex++) {
    console.info(`${sourceIndex}: ${sources[sourceIndex]}`);
  }

  const answers = await inquirer.prompt([{
    name: 'source-file',
    message: 'Which source file would you like to analyze? (available options from \'data/*-recent.txt\')',
    default: sources[sources.length - 1],
    choices: sources,
    type: 'list',
  }]);
  const sourceFile = answers['source-file'];
  console.info(sourceFile)

  // process.exit();

  const recent = fs.readFileSync('data/recent.txt', 'utf-8');
  const recentRegex = /(^1?\d\/[1-3]?\d\/[0-3]?\d), (\d{2}:\d{2}) - (.*): (.*)$/g

  interface Message {
    date: string
    time: string
    name: string
    text: string
  }

  let lastMessage: Message = {date: 'none', time: 'none', name: 'none', text: ''}
  const messages = recent.split(/\r?\n/).map((line: string) => {
    const result = recentRegex.exec(line)
    if (result === null) {
      lastMessage.text += line
      return undefined
    } else {
      const message: Message = {
        date: result[1],
        time: result[2],
        name: result[3],
        text: result[4],
      }
      lastMessage = message;
      return message;
    }
  }).filter(message => message !== undefined) as Message[];

  const messagesAt = messages.filter(message => message?.time === '11:11' || message?.time === '11:10');
  const messagesAtWith = messagesAt.filter(message => message.text == "11:11");

  const members: Record<string, string[]> = {}
  for (let i = 0; i < messagesAtWith.length; i++) {
    const message = messagesAtWith[i];
    if (members[message.name] === undefined) {
      members[message.name] = [];
    }
    if (!members[message.name].includes(message.date)) {
      members[message.name].push(message.date);
    }
  }

  const membersCount: Record<string, number> = {};
  for (let member in members) {
    membersCount[member] = members[member].length
  }

  console.info(
    'Since:', messages[0].date,
    '\nTotal messages:', messages.length,
    '\nMessages at 11:11:', messagesAt.length,
    '\nMessages at 11:11 with 11:11 in text:', messagesAtWith.length,
    '\nBy:', membersCount,
  );
}
program();
