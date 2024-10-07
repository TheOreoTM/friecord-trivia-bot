import { ApplyOptions } from '@sapphire/decorators';
import { PermissionsPrecondition } from '../lib/PermissionPrecondition';

@ApplyOptions<PermissionsPrecondition.Options>({ guildOnly: false })
export class UserPermissionsPrecondition extends PermissionsPrecondition {
	public handle(): PermissionsPrecondition.Result {
		return this.ok();
	}
}
