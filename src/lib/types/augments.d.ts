import type { PrismaClient } from '@prisma/client';

declare module '@sapphire/pieces' {
	interface Container {
		db: PrismaClient;
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		Everyone: never;
		Host: never;
		QuizMaster: never;
	}
}
