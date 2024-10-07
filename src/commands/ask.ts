import { ApplyOptions } from '@sapphire/decorators';
import { EmbedBuilder } from 'discord.js';
import { CustomColors } from '../lib/constants';
import { FrierenCommand } from '../lib/FrierenCommand';
import { PermissionLevels } from '../lib/types/enums';
import { Duration, DurationFormatter } from '@sapphire/time-utilities';

@ApplyOptions<FrierenCommand.Options>({
	description: 'Ask a question',
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
				.addStringOption((option) =>
					option //
						.setName('question')
						.setDescription('The question to ask')
						.setRequired(true)
				)
				.addAttachmentOption((option) =>
					option //
						.setName('attachment')
						.setDescription('Any attachments to the question')
						.setRequired(false)
				)
				.addStringOption((option) =>
					option //
						.setName('answer')
						.setDescription('The model answer')
						.setRequired(false)
				)
				.addIntegerOption((option) =>
					option //
						.setName('bonus')
						.setDescription('The number of points to give for the first five answers (default: 2)')
						.setRequired(false)
						.setMinValue(1)
						.setMaxValue(10)
				)
				.addStringOption((option) =>
					option //
						.setName('duration')
						.setDescription('How long the answering period should last (default: forever)')
						.setRequired(false)
				)
		);
	}

	// Chat Input (slash) command
	public override async chatInputRun(interaction: FrierenCommand.ChatInputCommandInteraction) {
		await interaction.deferReply({ ephemeral: true });

		const bonus = interaction.options.getInteger('bonus', false) ?? 2;
		const answer = interaction.options.getString('answer', false);
		const durationInput = interaction.options.getString('duration', false);
		const attachment = interaction.options.getAttachment('attachment', false);
		const question = interaction.options.getString('question', true);

		let duration = -1;

		if (durationInput) {
			duration = new Duration(durationInput).offset;
		}

		const embed = new EmbedBuilder() //
			.setAuthor({ name: 'Question' })
			.setDescription(question)
			.setColor(CustomColors.Default);

		if (attachment) {
			embed.setImage(attachment.url);
		}

		if (!interaction.channel) {
			return this.error('Could not send message');
		}
		const questionMessage = await interaction.channel.send({
			content: `${bonus}, ${answer}, ${duration}`,
			embeds: [embed]
		});

		this.container.db.question.create({
			data: {
				question,
				messageId: questionMessage.id,
				channelId: questionMessage.channel.id,
				firstFiveBonus: bonus,
				modelAnswer: answer
			}
		});

		if (duration > 0) {
			const formattedDuration = new DurationFormatter().format(duration);
			interaction.editReply(`Question sent! Now waiting \`${formattedDuration}\` for the answer.`);

			setTimeout(async () => {
				let answers = await interaction.channel?.messages.fetch({ limit: 100, after: questionMessage.id });
				if (!answers || answers?.size === 0) {
					interaction.channel?.send('No answers found');
					return;
				}

				answers = answers.filter((message) => message.editedTimestamp === null);

				interaction.channel?.send(`Times up! lock channel i guess \n${answers.size} answers found`);
			}, duration);
			return;
		}

		interaction.editReply({ content: `Question sent!` });
	}
}
