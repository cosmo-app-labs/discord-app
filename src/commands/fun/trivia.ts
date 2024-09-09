import { ActionRowBuilder, bold, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, inlineCode, italic, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/command";
import axios from "axios";
import he from "he";
import ms from "ms";

const command: Command = {
    data: new SlashCommandBuilder()
        .setName("trivia")
        .setDescription("💭 Challenge your brain with a fun trivia game and put your knowledge to the test!"),
    category: "Fun",
    async execute(interaction) {
        // Defer the reply to fetch the message
        await interaction.deferReply();

        // Fetch the trivia questions
        const response = await axios.get("https://opentdb.com/api.php?amount=1")

        // Get the trivia question from the response
        const triviaQuestion = response.data.results[0];

        // Get the question, category, difficulty, correct answer, and incorrect answers
        const { question, category, difficulty, correct_answer, incorrect_answers } = triviaQuestion;

        // Set the response time based on the difficulty level
        let answerTimeLimit = 0;

        if (difficulty === "easy") answerTimeLimit = 15000;
        else if (difficulty === "medium") answerTimeLimit = 12000;
        else if (difficulty === "hard") answerTimeLimit = 10000;

        // Get the answers and decode the HTML entities
        const answers = [...incorrect_answers, correct_answer]
            .map((answer: string) => {
                return he.decode(answer);
            }).sort(() => Math.random() - 0.5);

        // Capitalize the first letter of the string
        const capitalizeFirstLetter = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

        // Create an embed with the trivia question
        const embed = new EmbedBuilder()
            .setTitle(`${interaction.user.username}'s Trivia Question!`)
            .setDescription(`${he.decode(bold(question))}\n${italic(`You have ${ms(answerTimeLimit, { long: true })} to answer this question!`)}`)
            .addFields(
                {
                    name: "Difficulty",
                    value: `${capitalizeFirstLetter(difficulty)}`,
                    inline: true,
                },
                {
                    name: "Category",
                    value: `${he.decode(category)}`,
                    inline: true,
                },
            );

        // Create the buttons for the trivia game
        const triviaButtons = await createTriviaButtons(answers, "", "");

        // Create an action row with the buttons
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(triviaButtons);

        // Edit the reply with the embed and buttons
        const message = await interaction.editReply({ embeds: [embed], components: [row] });

        // Filter for the message component collector
        const filter = (i: any) => i.customId.startsWith('trivia-option');

        // Create a message component collector
        const answerCollector = message.createMessageComponentCollector({ filter, time: answerTimeLimit, componentType: ComponentType.Button });

        // Listen for the collect event
        answerCollector.on('collect', async (i) => {
            // Check if the user is allowed to interact with the button
            if (i.user.id !== interaction.user.id) {
                return await i.reply({
                    content: "Only the trivia player can interact with this button.",
                    ephemeral: true
                });
            }

            // Get the selected answer
            const selectedAnswer = answers[parseInt(i.customId.split("-")[2]) - 1];
            const updatedButtons = await createTriviaButtons(answers, selectedAnswer, correct_answer);
            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(updatedButtons);

            // Check if the selected answer is correct
            if (correct_answer === selectedAnswer) {
                return await i.update({ content: "🎉 Correct! Well done!", components: [row] });
            } else {
                return await i.update({ content: `❌ Incorrect! The correct answer is ${inlineCode(he.decode(correct_answer))}`, components: [row] });
            }
        });

        // Listen for the end event
        answerCollector.on("end", async (collected) => {
            const disabledButtons = await createTriviaButtons(answers, " ", "");
            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(disabledButtons);

            // Check if the user has not responded in time
            if (collected.size === 0) {
                return await interaction.editReply({
                    content: "⏰ Time's up! Better luck next time.",
                    embeds: [embed],
                    components: [row],
                });
            }
        });
    },
};

// Create buttons for the trivia game
export const createTriviaButtons = async (answers: string[], selectedAnswer: string, correctAnswer: string) => {
    return answers.map((answer, index) =>
        new ButtonBuilder()
            .setCustomId(`trivia-option-${index + 1}`)
            .setLabel(`${answer}`)
            .setDisabled(!!selectedAnswer)
            .setStyle(
                selectedAnswer // Check if the answer is selected
                    ? answer === correctAnswer // Check if the answer is correct
                        ? ButtonStyle.Success // Highlight correct answer as green
                        : answer === selectedAnswer // Check if the answer is selected and incorrect
                            ? ButtonStyle.Danger // Highlight selected wrong answer as red
                            : ButtonStyle.Secondary // Keep unselected and incorrect options neutral
                    : ButtonStyle.Primary // Keep unselected options primary
            )
    );
}

export default command;