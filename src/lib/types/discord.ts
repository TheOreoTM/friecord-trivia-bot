import type {
	CommandInteraction,
	CommandInteractionOptionResolver,
	ContextMenuCommandInteraction,
	Guild,
	GuildBasedChannel,
	GuildMember,
	Message,
	NewsChannel,
	Role,
	StageChannel,
	TextChannel,
	VoiceChannel
} from 'discord.js';
import type { FrierenClient } from '../FrierenClient';

export type GuildChannel = TextChannel | NewsChannel | StageChannel | VoiceChannel;
export interface GuildMessage extends Message {
	channel: GuildChannel;
	readonly guildId: string;
	readonly guild: Guild;
	readonly member: GuildMember;
}

export interface GuildInteraction extends CommandInteraction {
	readonly guild: Guild;
	readonly guildId: string;
	readonly member: GuildMember;
	readonly channel: TextChannel;
	options: GuildCommandInteractionOptionResolver;
	client: FrierenClient<true>;
}

export interface GuildCommandInteractionOptionResolver extends CommandInteractionOptionResolver {
	getMember(name: string): GuildMember;
	getChannel(name: string, required?: boolean): GuildBasedChannel;
	getRole(name: string, required?: boolean): Role;
}

export interface GuildContextMenuInteraction extends ContextMenuCommandInteraction {
	readonly guild: Guild;
	readonly guildId: string;
	readonly member: GuildMember;
	options: GuildCommandInteractionOptionResolver;
}
