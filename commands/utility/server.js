const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Server Listing @ ↳ЯR↰'),
    async execute(interaction) {
        try {
            // Defer the reply to give time for fetching the data
            await interaction.deferReply({ ephemeral: true });

            const response = await axios.get('https://www.rrgaming.net/api/slash_servers.php');
            const servers = response.data.data;

            if (!Array.isArray(servers) || servers.length === 0) {
                return await interaction.followUp('No server data found.');
            }

            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setDescription('Server Listing @ ↳ЯR↰')
                .setTitle('https://www.rrgaming.net')
                .setURL('https://rrgaming.net/')
                .setTimestamp();

            servers.forEach((server, index) => {
                embed.addFields(
                    { name: '*Game Type*', value: `${server.gametype || 'N/A'}`, inline: false },
                    { name: '*Name*', value: `${server.server_name || 'N/A'}`, inline: false },
                    { name: '*Players*', value: `${server.players || 'N/A'}`, inline: true },
                    { name: '*Map*', value: `${server.map || 'N/A'}`, inline: true }
                );
            });

            // Ensure only one followUp is sent
            return await interaction.followUp({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching server data:', error.message || error);

            // Check if the interaction has already been replied to or deferred
            if (interaction.deferred || interaction.replied) {
                return interaction.followUp('There was an error fetching the server data.');
            } else {
                // Fallback in case deferReply didn't work properly
                return interaction.reply('There was an error fetching the server data.');
            }
        }
    },
};

