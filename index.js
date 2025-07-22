const { MessengerBot } = require("messenger-bot-framework");
const fs = require("fs");

const config = require("./config.json");
const bot = new MessengerBot({
  token: config.token,
  prefix: config.prefix,
  ownerID: config.ownerID
});

// Load commands
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  bot.command(command.name, command.execute);
}

bot.on("message", async (msg) => {
  if (!msg.text.startsWith(config.prefix)) return;
  const args = msg.text.slice(config.prefix.length).trim().split(/ +/);
  const cmdName = args.shift().toLowerCase();

  if (bot.commands.has(cmdName)) {
    try {
      await bot.commands.get(cmdName).execute(msg, args);
    } catch (error) {
      console.error(error);
    }
  }
});

bot.start().then(() => {
  console.log(`${config.botName} is running.`);
});