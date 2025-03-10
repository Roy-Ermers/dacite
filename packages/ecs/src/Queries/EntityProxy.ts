import { AllowedComponentTypes } from "../Components/ComponentTypes";
import EntityData from "../Entities/EntityData";
import { EntityComponentType, ReadonlyEntity } from "../Entities/IEntity";
import ComponentParser from "../Utils/ComponentParser";
import { Type } from "../Utils/Types";

export default class EntityProxy implements ReadonlyEntity {
		public static idSymbol = Symbol('entity proxy id');
		public static allComponentsSymbol = Symbol('entity proxy all components');
		private _usedDependencies: Set<AllowedComponentTypes> = new Set();

    /**
    @internal
    */
    public get dependencies() {
			return [...this._usedDependencies.values()];
    }

		get id() {
			this._usedDependencies.add(EntityProxy.idSymbol);
			return 0;
		}

		get isAlive() {
			this._usedDependencies.add(EntityData);
			return true;
		}

    get<T extends AllowedComponentTypes>(component: Type<T>): EntityComponentType<unknown, T> {
			const type = ComponentParser.getBaseComponentType(component);
			this._usedDependencies.add(type);

			return new component() as EntityComponentType<unknown, T>;
    }

    getAll() {
			this._usedDependencies.add(EntityProxy.allComponentsSymbol);
			return [];
    }

    has<T extends AllowedComponentTypes>(component: Type<T>): boolean {
			const type = ComponentParser.getBaseComponentType(component);
			this._usedDependencies.add(type);

			return true;
    }

}
