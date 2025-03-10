import IEntity from "../Entities/IEntity";
import Scope from "../Scope";

export default class Query {
	constructor(private predicate: (entity: IEntity) => boolean) {
	}

	matches(entity: IEntity): boolean {
		return this.predicate(entity);
	}

	execute(scope: Scope): IEntity[] {

	}
}
