// const fs = require('node:fs');
// const path = require('node:path');
const { Client, Events, Collection, IntentsBitField } = require('discord.js');
const boosterMsg = require('./replies/booster_msg');
require('dotenv').config();
const token = process.env.DISCORD_TOKEN;
const client = new Client({ intents: [IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.Guilds, IntentsBitField.Flags.MessageContent] });
client.commands = new Collection();

// const commandsPath = path.join(__dirname, 'commands');
// const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));


// for (const file of commandFiles) {
// 	const filePath = path.join(commandsPath, file);
// 	const command = require(filePath);
// 	client.commands.set(command.data.name, command);
// }
client.once(Events.ClientReady, () => {
	console.log('Ready!');
});
client.on(Events.MessageCreate, async (message) => {
	boosterMsg.createReply(message);
});
// client.on(Events.InteractionCreate, async interaction => {
// 	if (!interaction.isChatInputCommand()) return;

// 	const command = interaction.client.commands.get(interaction.commandName);
// 	if (!command) {
// 		console.error(`No command matching ${interaction.commandName} was found`);
// 		return;
// 	}

// 	try {
// 		await command.execute(interaction);
// 	}
// 	catch (err) {
// 		console.error(err);
// 		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
// 	}
// 	console.log(interaction);
// });


client.login(token);