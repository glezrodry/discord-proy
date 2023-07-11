const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Porvides information about the user'),
	async execute(interaction) {
		await interaction.reply(`This command was run by ${interaction.user}, who joined on ${interaction.member}`);
	},
};