const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('banlist')
        .setDescription('Last 10 Banned @ ↳ЯR↰'),
    async execute(interaction) {
        try {
            // Defer the reply to allow time for fetching the data
            await interaction.deferReply({ ephemeral: true });

            const response = await axios.get('https://www.rrgaming.net/api/banlist_ajax.php');
            const bans = response.data.data;

            if (!Array.isArray(bans) || bans.length === 0) {
                await interaction.followUp('No ban data found.');
                return;
            }

            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Last 10 Banned Players')
                .setURL('https://rrgaming.net/')
                .setDescription('Here are the last 10 banned players:')
                .setTimestamp();

            bans.forEach((ban, index) => {
                embed.addFields(
                    { name: `Ban #${index + 1}`, value: `**ID:** ${ban.banid}\n**Player:** ${ban.player}\n**Reason:** ${ban.reason}`, inline: false }
                );
            });

            // Use followUp after deferReply
            await interaction.followUp({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching ban data:', error.message || error);
            await interaction.followUp('There was an error fetching the ban data.');
        }
    },
};

