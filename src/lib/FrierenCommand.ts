import {
	ApplicationCommandRegistry,
	Command,
	CommandOptionsRunTypeEnum,
	PreconditionContainerArray,
	Args as SapphireArgs,
	UserError,
	type MessageCommandContext
} from '@sapphire/framework';
import {
	AutocompleteInteraction,
	ContextMenuCommandInteraction as CTXMenuCommandInteraction,
	ChatInputCommandInteraction as ChatInputInteraction,
	Message,
	MessageContextMenuCommandInteraction as MessageCTXCommandInteraction,
	PermissionFlagsBits,
	PermissionsBitField,
	UserContextMenuCommandInteraction as UserCTXMenuCommandInteraction
} from 'discord.js';
import { seconds } from './utils/time';
import { PermissionLevels } from './types/enums';
import type { GuildMessage } from './types/discord';

export abstract class FrierenCommand extends Command {
	/**
	 * Whether the command can be disabled.
	 */
	public readonly guarded: boolean;
	/**
	 * Whether the command is hidden from everyone.
	 */
	public readonly hidden: boolean;
	/**
	 * The permission level required to run the command.
	 */
	public readonly permissionLevel: PermissionLevels;

	/**
	 * Whether the command is only for quiz masters.
	 */
	public readonly quizMasterOnly?: boolean;

	public constructor(context: Command.LoaderContext, options: FrierenCommand.Options) {
		const perms = new PermissionsBitField(options.requiredClientPermissions).add(
			PermissionFlagsBits.SendMessages,
			PermissionFlagsBits.EmbedLinks,
			PermissionFlagsBits.ViewChannel
		);
		super(context, {
			generateDashLessAliases: true,
			requiredClientPermissions: perms,
			runIn: [CommandOptionsRunTypeEnum.GuildAny],
			cooldownDelay: seconds(5),
			...options
		});

		this.guarded = options.guarded ?? false;
		this.hidden = options.hidden ?? false;
		this.permissionLevel = options.permissionLevel ?? PermissionLevels.Everyone;
		this.quizMasterOnly = options.quizMasterOnly ?? false;
	}

	public async prefix(message: Message) {
		return await this.container.client.fetchPrefix(message);
	}

	protected error(message: string | UserError.Options, context?: unknown): never {
		throw typeof message === 'string' ? new UserError({ identifier: 'Error', message, context }) : new UserError(message);
	}

	protected override parseConstructorPreConditions(options: FrierenCommand.Options): void {
		super.parseConstructorPreConditions(options);
		this.parseConstructorPreConditionsPermissionLevel(options);
	}

	protected parseConstructorPreConditionsPermissionLevel(options: FrierenCommand.Options): void {
		if (options.permissionLevel === PermissionLevels.QuizMaster) {
			this.preconditions.append('QuizMaster');
			return;
		}

		const container = new PreconditionContainerArray(['QuizMaster'], this.preconditions);
		switch (options.permissionLevel ?? PermissionLevels.Everyone) {
			case PermissionLevels.Everyone:
				container.append('Everyone');
				break;
			case PermissionLevels.Host:
				container.append('Host');
				break;
			default:
				throw new Error(
					`FrierenCommand[${this.name}]: "permissionLevel" was specified as an invalid permission level (${options.permissionLevel}).`
				);
		}

		this.preconditions.append(container);
	}
}
export namespace FrierenCommand {
	/**
	 * The FrierenCommand Options
	 */
	export type Options = Command.Options & {
		/**
		 * Whether the command can be disabled.
		 */
		guarded?: boolean;
		/**
		 * Whether the command is hidden from everyone.
		 */
		hidden?: boolean;
		/**
		 * The permission level required to run the command.
		 */
		permissionLevel?: number;
		/**
		 * Whether the command is only for quiz masters.
		 */
		quizMasterOnly?: boolean;
	};
	export type MessageContext = MessageCommandContext;
	export type ChatInputCommandInteraction = ChatInputInteraction<'cached'>;
	export type ContextMenuCommandInteraction = CTXMenuCommandInteraction<'cached'>;
	export type UserContextMenuCommandInteraction = UserCTXMenuCommandInteraction<'cached'>;
	export type MessageContextMenuCommandInteraction = MessageCTXCommandInteraction<'cached'>;
	export type AutoComplete = AutocompleteInteraction;
	export type Context = Command.LoaderContext;

	export type Args = SapphireArgs;
	export type Message = GuildMessage;
	export type Registry = ApplicationCommandRegistry;
}
