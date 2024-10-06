import { SapphireClient, container } from '@sapphire/framework';
import { ClientConfig } from './constants';
import { PrismaClient } from '@prisma/client';

export class FrierenClient<Ready extends boolean = boolean> extends SapphireClient<Ready> {
	public constructor() {
		super(ClientConfig);
	}

	public override async login(token?: string): Promise<string> {
		container.db = new PrismaClient();
		return super.login(token);
	}
	public override destroy() {
		return super.destroy();
	}
}
