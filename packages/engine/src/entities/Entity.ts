import { LinkedComponent, Entity as TickKnockEntity } from "tick-knock";

const ENTITY_NAMES = new WeakMap<TickKnockEntity, string>();

export default class Entity {
    /** @internal */
    ecsEntity: TickKnockEntity;

    public get id() {
        return this.ecsEntity.id;
    }

    public get name() {
        return ENTITY_NAMES.get(this.ecsEntity) ?? "Entity";
    }
    public set name(value: string) {
        ENTITY_NAMES.set(this.ecsEntity, value);
    }

    constructor();
    constructor(name: string);
    constructor(name?: string) {
        this.ecsEntity = new TickKnockEntity();

        if (name) {
            this.name = name;
        }
    }

    addComponent<T extends K, K extends unknown>(component: NonNullable<T>) {
        if (component instanceof LinkedComponent) {
            console.log("Adding linked component", component);

            this.ecsEntity.append(component);
            return this;
        }

        const baseType = Object.getPrototypeOf(component.constructor);
        if (baseType.name !== '') {
            console.log("Adding component with base type", baseType, baseType.name);

            this.ecsEntity.addComponent(component, baseType);
        }

        this.ecsEntity.addComponent(component);

        return this;
    }

    toString() {
        return this.name + '(' + this.ecsEntity.getComponents().map(c => (c as Function).constructor.name).join(", ") + ')';
    }
}