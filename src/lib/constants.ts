import { join } from 'path';
import { BucketScope, LogLevel } from '@sapphire/framework';
import { GatewayIntentBits, Partials, type ClientOptions } from 'discord.js';
import { seconds } from './utils/time';

export const rootDir = join(__dirname, '..', '..');
export const srcDir = join(rootDir, 'src');

export const QuizMasters = ['600707283097485322', 'IDs'];
export const Hosts = [...QuizMasters, 'IDs'];

export const enum CustomColors {
	Success = 0x46b485,
	Fail = 0xf05050,
	Warn = 0xfee65c,
	Info = 0x297bd1,
	Loading = 0x23272a,
	Default = 0x2b2d31
}

export const ClientConfig: ClientOptions = {
	defaultPrefix: 'f!',
	caseInsensitiveCommands: true,
	logger: {
		level: LogLevel.Debug
	},
	defaultCooldown: {
		filteredUsers: Hosts,
		delay: seconds(5),
		scope: BucketScope.User
	},
	allowedMentions: {
		parse: ['users'],
		repliedUser: false
	},
	intents: [
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.MessageContent
	],
	partials: [Partials.GuildMember, Partials.Message, Partials.User, Partials.Channel],
	loadMessageCommandListeners: true
};
