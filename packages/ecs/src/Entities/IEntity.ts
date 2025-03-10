import { AllowedComponentTypes } from "../Components/ComponentTypes";
import { Append, Type } from "../Utils/Types";

export type EntityComponents<S> = (S extends (infer ComponentType)[] ? ComponentType : never);
export type ExtendEntity<S, T> = IEntity<Append<S, T>>;
export type EntityComponentType<S, T> = T extends EntityComponents<S> ? T : (T | null);

export interface ReadonlyEntity<S extends unknown[] | unknown = unknown> {
	readonly id: number;
	readonly isAlive: boolean;
	get<T extends AllowedComponentTypes>(component: Type<T>): EntityComponentType<S, T>;

	getAll(): AllowedComponentTypes[];

	has<T extends AllowedComponentTypes>(component: Type<T>): boolean;
}

export default interface IEntity<S extends unknown[] | unknown = unknown> extends ReadonlyEntity<S> {
	set<T extends AllowedComponentTypes>(component: T): ExtendEntity<S, T>;

	has<T extends AllowedComponentTypes>(component: Type<T>): boolean;

	remove(component: AllowedComponentTypes): this;
}
