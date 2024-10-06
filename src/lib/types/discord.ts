import type { Guild, GuildMember, Message, NewsChannel, StageChannel, TextChannel, VoiceChannel } from 'discord.js';

export type GuildChannel = TextChannel | NewsChannel | StageChannel | VoiceChannel;
export interface GuildMessage extends Message {
	channel: GuildChannel;
	readonly guildId: string;
	readonly guild: Guild;
	readonly member: GuildMember;
}
