import { Precondition } from '@sapphire/framework';
import type { ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { Hosts } from '../lib/constants';
import type { GuildContextMenuInteraction, GuildMessage } from '../lib/types/discord';

export class UserPrecondition extends Precondition {
	public override messageRun(message: GuildMessage) {
		return this.isHost(message.member) ? this.ok() : this.error({ context: { silent: true } });
	}

	public override chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
		return this.isHost(interaction.member) ? this.ok() : this.error({ context: { silent: true } });
	}

	public override contextMenuRun(interaction: GuildContextMenuInteraction) {
		return this.isHost(interaction.member) ? this.ok() : this.error({ context: { silent: true } });
	}

	private isHost(member: GuildMember) {
		return Hosts.includes(member.id) ? this.ok() : this.error({ message: 'Only a host can use this command!' });
	}
}
