import { type Entity, EntitySystem, Query } from "@dacite/ecs";
import Transform from "../components/Transform.js";
import SpatialMap from "../utils/SpatialMap.js";

export default class SpatialLookupSystem extends EntitySystem {
	override get priority() {
		return 9999;
	}
	get query() {
		return new Query().has(Transform);
	}
	spatialMap: SpatialMap;

	constructor() {
		super();
		this.spatialMap = new SpatialMap(1024);

		(globalThis as any).__SPATIAL_MAP__ = this.spatialMap;
	}

	protected override onEntityUpdated(entity: Entity) {
		this.spatialMap.set(entity);
	}
}
