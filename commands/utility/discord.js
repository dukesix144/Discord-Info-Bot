const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { incrementCommandCount } = require('D:/info/helpers/mysql_helper');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('discord')
        .setDescription('Discord Info @ ↳ЯR↰'),
    async execute(interaction) {
        await incrementCommandCount('discord'); // Increment command count

        // Create an embed for the Discord server info
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Discord Server Info @ ↳ЯR↰')
            .setDescription(`Details about the server: **${interaction.guild.name}**`)
            .addFields(
                { name: 'Server Name', value: `${interaction.guild.name}`, inline: true },
                { name: 'Total Members', value: `${interaction.guild.memberCount}`, inline: true }
            )
            .setTimestamp();

        // Send the embed as an ephemeral reply (visible only to the user who issued the command)
        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};

