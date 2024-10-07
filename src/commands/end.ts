import { ApplyOptions } from '@sapphire/decorators';
import { type Snowflake } from 'discord.js';
import { FrierenCommand } from '../lib/FrierenCommand';
import { PermissionLevels, QuestionStatus } from '../lib/types/enums';

@ApplyOptions<FrierenCommand.Options>({
	description: 'End a question',
	permissionLevel: PermissionLevels.QuizMaster
})
export class UserCommand extends FrierenCommand {
	// Register Chat Input and Context Menu command
	public override registerApplicationCommands(registry: FrierenCommand.Registry) {
		// Register Chat Input command
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
		);
	}

	// Chat Input (slash) command
	public override async chatInputRun(interaction: FrierenCommand.ChatInputCommandInteraction) {
		await interaction.deferReply({ ephemeral: true });
		if (!interaction.channel) {
			return this.error('Something went wrong');
		}

		const activeQuestion = await this.container.db.question.findFirst({
			where: {
				channelId: interaction.channel.id,
				status: QuestionStatus.InProgress
			},
			orderBy: {
				createdAt: 'desc'
			}
		});

		if (!activeQuestion) {
			await interaction.editReply('No active questions found');
			return;
		}

		let answers = await interaction.channel?.messages.fetch({ limit: 100, after: activeQuestion.messageId });
		if (!answers || answers?.size === 0) {
			interaction.channel?.send('No answers found');
			return;
		}

		answers = answers.filter((message) => message.editedTimestamp === null);
		answers = answers.sort((a, b) => a.createdTimestamp - b.createdTimestamp);
		const answerMap = new Map<Snowflake, string>();

		answers.forEach((answer) => {
			answerMap.set(answer.author.id, answer.content);
		});

		answerMap.forEach(async (id, answer) => {
			await this.container.db.answer.create({
				data: {
					answer,
					userId: id,
					questionId: activeQuestion.id
				}
			});
		});

		interaction.channel?.send(`Ended! lock channel i guess \n${answers.size} answers (${answerMap.size} unique answers) found`);

		interaction.editReply('Ended the active question');

		await this.container.db.question.update({
			where: {
				id: activeQuestion.id
			},
			data: {
				status: QuestionStatus.Over
			}
		});
	}
}
