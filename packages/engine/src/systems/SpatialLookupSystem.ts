import Transform from "@dacite/engine/components/Transform.ts";
import SpatialMap from "@dacite/engine/utils/SpatialMap.ts";
import type { Entity } from "tick-knock";
import BaseSystem from "./BaseSystem";

export default class SpatialLookupSystem extends BaseSystem {
    spatialMap: SpatialMap;

    constructor() {
        super((entity) => entity.hasComponent(Transform));
        this.spatialMap = new SpatialMap(1024);

        (globalThis as any).__SPATIAL_MAP__ = this.spatialMap;
    }

    protected override onUpdate(entity: Entity): void | boolean {
        this.spatialMap.set(entity);
    }
}
