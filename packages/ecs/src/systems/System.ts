import type Scope from "../Scope";
import type IUpdatingSystem from "./IUpdatingSystem";

export default abstract class System {
	private _scope?: Scope;

	public get scope() {
		return this._scope as Scope;
	}

	/**
	 *	@internal
	 * Enables this system and adds it to a scope.
	 * It is internal because it should not be used outside of this package.
	 */
	public setScope(value: Scope | null) {
		this._scope = value as Scope;
	}

	/** @internal */
	public static hasUpdate(system: unknown): system is IUpdatingSystem {
		return system instanceof System && system.update !== undefined;
	}

	/**
	 * Called whenever this system is added to a scope.
	 */
	onEnable?(): Promise<void> | void;

	/**
	 * Called before this system is removed from a scope.
	 */
	onDisable?(): Promise<void> | void;

	/**
	 * Called every frame.
	 */
	update?(): void;
}
