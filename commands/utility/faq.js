const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');
const htmlEntities = require('html-entities');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('faq')
        .setDescription('FAQ @ ↳ЯR↰'),
    async execute(interaction) {
        try {
            // Defer the reply to give the bot more time to process and ensure it is ephemeral
            await interaction.deferReply({ ephemeral: true });

            const response = await axios.get('https://www.rrgaming.net/api/slash_faq.php');
            const servers = response.data.data;

            if (!Array.isArray(servers) || servers.length === 0) {
                await interaction.followUp({ content: 'No server data found.', ephemeral: true });
                return;
            }

            const truncateText = (text, maxLength) => {
                if (text.length > maxLength) {
                    return text.slice(0, maxLength - 3) + '...';
                }
                return text;
            };

            for (const server of servers) {
                const cleanQuestion = htmlEntities.decode(server.question).replace(/<\/?[^>]+(>|$)/g, "");
                const cleanAnswer = htmlEntities.decode(server.answer).replace(/<\/?[^>]+(>|$)/g, "");

                const truncatedQuestion = truncateText(cleanQuestion, 1024);
                const truncatedAnswer = truncateText(cleanAnswer, 1024);

                // Create an embed for each FAQ entry
                const embed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle('FAQ @ ↳ЯR↰')
                    .setURL('https://rrgaming.net/')
                    .addFields(
                        { name: `*QUESTION #${server.id}*\n`, value: truncatedQuestion || 'N/A', inline: false },
                        { name: '*ANSWER*\n', value: truncatedAnswer || 'N/A', inline: false }
                    )
                    .setTimestamp();

                // Send the embed as an ephemeral reply
                await interaction.followUp({ embeds: [embed], ephemeral: true });
            }

            // Final follow-up reply after sending the embeds
            await interaction.followUp({ content: 'FAQs loaded.', ephemeral: true });
        } catch (error) {
            console.error('Error fetching server data:', error);
            // Handle error after deferReply
            await interaction.followUp({ content: 'There was an error fetching the server data.', ephemeral: true });
        }
    },
};

