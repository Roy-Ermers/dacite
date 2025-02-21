import Transform from "@/components/Transform";
import SpatialMap from "@/utils/SpatialMap";
import type { Entity } from "tick-knock";
import BaseSystem from "./BaseSystem";

export default class SpatialLookupSystem extends BaseSystem {
    spatialMap: SpatialMap;

    constructor() {
        super((entity) => entity.hasComponent(Transform));
        this.spatialMap = new SpatialMap(1024);

        (globalThis as any).__SPATIAL_MAP__ = this.spatialMap;
    }

    protected onUpdate(entity: Entity, dt: number): void | boolean {
        this.spatialMap.set(entity);
    }
}