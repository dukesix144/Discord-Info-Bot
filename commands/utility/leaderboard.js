const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('squadleaderboard')
        .setDescription('Top 10 Squad Leaderboard @ ↳ЯR↰'),
    async execute(interaction) {
        try {
            const response = await axios.get('https://www.rrgaming.net/api/leaderboard_slash.php');
            const leaderboard = response.data.data;

            if (!Array.isArray(leaderboard) || leaderboard.length === 0) {
                await interaction.reply({ content: 'No leaderboard data found.', ephemeral: true });
                return;
            }

            // Create an embed
            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Top 10 Squad Leaderboard @ ↳ЯR↰')
                .setURL('https://rrgaming.net/')
                .setDescription('Here are the top 10 players!')
                .setTimestamp();

            // Add fields for ELO and Player names
            embed.addFields(
                {
                    name: 'ELO',
                    value: leaderboard.slice(0, 10).map(entry => `${entry.elo}`).join('\n') || 'N/A',
                    inline: true
                },
                {
                    name: 'Player',
                    value: leaderboard.slice(0, 10).map(entry => `${entry.Name}`).join('\n') || 'N/A',
                    inline: true
                }
            );

            // Send the embed as an ephemeral reply (visible only to the user who issued the command)
            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error('Error fetching leaderboard data:', error);
            await interaction.reply({ content: 'There was an error fetching the leaderboard data.', ephemeral: true });
        }
    },
};

