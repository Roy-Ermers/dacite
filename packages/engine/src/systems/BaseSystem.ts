import Engine from "@dacite/engine";
import { Entity, EntitySnapshot, Query, QueryBuilder, QueryPredicate, ReactionSystem } from "tick-knock";

export default abstract class BaseSystem extends ReactionSystem {
    private _disabled = false;

    public get disabled() {
        return this._disabled;
    }

    public set disabled(value: boolean) {
        this._disabled = value;

        const hasSystem = Engine.instance.ecs.getSystem(this.constructor as any) === this;

        if (value && hasSystem) {
            Engine.instance.ecs.removeSystem(this);
        }
        else if (!hasSystem) {
            Engine.instance.ecs.addSystem(this);
        }
    }

    constructor(query: Query | QueryBuilder | QueryPredicate) {
        super(query);
    }

    override update(dt: number): void {
        if (this.onUpdate === undefined) {
            return;
        }

        let requestRemoval = false;
        for (const entity of this.query.entities) {
            if (this.onUpdate(entity, dt)) {
                requestRemoval = true;
            }
        }

        if (requestRemoval) {
            this.requestRemoval();
        }
    }

    protected onUpdate?(entity: Entity, dt: number): void | boolean;
    protected override entityAdded = ({ current }: EntitySnapshot) => this.onEntityAdded(current);
    protected override entityRemoved = ({ current }: EntitySnapshot) => this.onEntityRemoved(current);

    // @ts-expect-error
    protected onEntityRemoved(entity: Entity): void { }
    // @ts-expect-error
    protected onEntityAdded(entity: Entity): void { }
}
