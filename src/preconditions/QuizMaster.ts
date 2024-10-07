import { Precondition } from '@sapphire/framework';
import type { ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { QuizMasters } from '../lib/constants';
import type { GuildContextMenuInteraction, GuildMessage } from '../lib/types/discord';

export class UserPrecondition extends Precondition {
	public override messageRun(message: GuildMessage) {
		return this.isQM(message.member);
	}

	public override chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
		return this.isQM(interaction.member);
	}

	public override contextMenuRun(interaction: GuildContextMenuInteraction) {
		return this.isQM(interaction.member);
	}

	private isQM(member: GuildMember) {
		return QuizMasters.includes(member.id) ? this.ok() : this.error({ message: 'Only a quiz master can use this command!' });
	}
}
