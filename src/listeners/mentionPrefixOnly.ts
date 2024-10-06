import type { Events } from '@sapphire/framework';
import { Listener } from '@sapphire/framework';
import type { GuildMessage } from '../lib/types/discord';

export class UserEvent extends Listener<typeof Events.MentionPrefixOnly> {
	public override async run(message: GuildMessage) {
		const prefix = this.container.client.options.defaultPrefix;
		return message.channel.send(prefix ? `My prefix in this guild is: \`${prefix}\`` : 'Cannot find any Prefix for Message Commands.');
	}
}
