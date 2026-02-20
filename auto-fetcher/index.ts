import { existsSync } from 'fs';
import { writeFile } from 'fs/promises';
import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

// Configure the auto fetcher
const path = `../data/${new Date().toISOString().slice(0, 10)}-auto.en2.txt`;
const groupName = 'Vol overtuiging';
const idToNameMapping: Record<string, string> = {
  '49791673311328@lid': 'Pablo Schipper',
  '134033061232669@lid': 'Thomas Hes',
  '184052384571487@lid': 'Yorick van Zweeden',
  '12575731372246@lid': 'Robin Sikkens',
  '204921546747945@lid': 'Simon Karman',
  '234870404059155@lid': 'Rogier Simons',
}

// If the output file already exists, return immediately to avoid overwriting
if (existsSync(path)) {
  console.log(`Output file ${path} already exists, skipping fetch.`);
  process.exit(0);
}

// Bootstrap the WhatsApp client
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { args: ['--no-sandbox'] }
});
client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
  console.log('Scan the QR code above with WhatsApp');
});
client.on('authenticated', () => console.log('Authenticated!'));
client.on('auth_failure', msg => {
  console.error('Auth failed:', msg);
});

// Once the client is ready, fetch messages from the specified group and save to file
client.on('ready', async () => {
  console.log('Client ready, fetching messages...');
  await new Promise(resolve => setTimeout(resolve, 5000));

  const chats = await client.getChats();
  const group = chats.find(c => c.name === groupName);

  if (!group) {
    console.error(`Group "${groupName}" not found. Available group chats:`);
    chats.filter(c => c.isGroup).forEach(c => console.log(' -', c.name));
    await client.destroy();
    return;
  }

  const lines: string[] = [];
  const messages = await group.fetchMessages({ limit: 50 });
  for (const msg of messages) {
    if (!msg.body) continue;
    const d = new Date(msg.timestamp * 1000);
    const date = `${d.getMonth() + 1}/${d.getDate()}/${String(d.getFullYear()).slice(2)}`;
    const time = `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
    const name = (msg as any)._data?.notifyName || msg.author || 'Unknown';
    const newName = name in idToNameMapping ? idToNameMapping[name] : name;
    const line = `${date}, ${time} - ${newName}: ${msg.body}`;
    lines.push(line);
  }
  await client.destroy();

  // Write to file
  await writeFile(path, lines.join('\n'), 'utf-8');
  console.log(`Messages saved to ${path}`);
});

client.initialize();
