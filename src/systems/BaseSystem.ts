import Game from "@/Game";
import { Entity, EntitySnapshot, Query, QueryBuilder, QueryPredicate, ReactionSystem } from "tick-knock";

export default abstract class BaseSystem extends ReactionSystem {
    private _disabled = false;

    public get disabled() {
        return this._disabled;
    }

    public set disabled(value: boolean) {
        this._disabled = value;

        const hasSystem = Game.instance.ecs.getSystem(this.constructor as any) === this;

        if (value && hasSystem) {
            Game.instance.ecs.removeSystem(this);
        }
        else if (!hasSystem) {
            Game.instance.ecs.addSystem(this);
        }
    }

    constructor(query: Query | QueryBuilder | QueryPredicate) {
        super(query);

        Game.instance.ecs.addSystem(this);
    }

    update(dt: number): void {
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

    protected abstract onUpdate(entity: Entity, dt: number): void | boolean;

    protected entityAdded = ({ current }: EntitySnapshot) => this.onEntityAdded(current);
    protected entityRemoved = ({ current }: EntitySnapshot) => this.onEntityRemoved(current);

    protected onEntityRemoved(entity: Entity): void { }
    protected onEntityAdded(entity: Entity): void { }
}