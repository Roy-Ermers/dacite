import type { Entity } from "@dacite/ecs";
import type { Container } from "pixi.js";
import { Renderable, Transform } from "../components";
import MathExtensions from "./MathExtensions";
import Vector2 from "./Vector2";

export default class SpatialMap {
	private buckets: Map<number, Set<number>> = new Map();
	private entities: Map<number, number> = new Map();

	constructor(private resolution = 128) {}

	generateHash(x: number, y: number): number;
	generateHash(point: Vector2): number;
	generateHash(point: Vector2 | number, _y?: number): number {
		const x = point instanceof Vector2 ? point.x : point;
		const y = point instanceof Vector2 ? point.y : (_y as number);

		const bucketX = Math.trunc(x / this.resolution);
		const bucketY = Math.trunc(y / this.resolution);
		const bucketZ = Math.trunc(x / this.resolution);

		let xHash = MathExtensions.fraction(bucketX * 0.1031);
		let yHash = MathExtensions.fraction(bucketY * 0.1031);
		let zHash = MathExtensions.fraction(bucketZ * 0.1031);

		const dot =
			xHash * yHash + 33.33 + (yHash * zHash + 33.33) + (zHash * xHash + 33.33);

		xHash += dot;
		yHash += dot;
		zHash += dot;
		return MathExtensions.fraction((xHash + yHash) * zHash);
	}

	set(entity: Entity) {
		const transform = entity.get(Transform);
		const renderable = entity.get<Renderable<Container>>(Renderable);

		if (!transform) return;

		const entitySize = renderable
			? new Vector2(renderable.container.width, renderable.container.height)
			: new Vector2(0, 0);
		const minPoint = transform.position;
		const maxPoint = new Vector2(
			minPoint.x + entitySize.x,
			minPoint.y + entitySize.y
		);

		const minHash = this.generateHash(minPoint);

		for (let x = minPoint.x; x <= maxPoint.x; x += this.resolution) {
			for (let y = minPoint.y; y <= maxPoint.y; y += this.resolution) {
				const hash = this.generateHash(x, y);
				const bucket = this.buckets.get(hash) ?? new Set();

				if (!bucket.has(entity.id)) {
					bucket.add(entity.id);
					this.buckets.set(hash, bucket);
				}
			}
		}

		const oldBucketHash = this.entities.get(entity.id);

		if (oldBucketHash && oldBucketHash !== minHash) {
			const oldBucket = this.buckets.get(oldBucketHash);

			oldBucket?.delete(entity.id);

			if (oldBucket?.size === 0) this.buckets.delete(oldBucketHash);
		}

		this.entities.set(entity.id, minHash);
		return minHash;
	}

	getEntityHash(entity: Entity): number[] {
		const transform = entity.get(Transform);
		const renderable = entity.get<Renderable<Container>>(Renderable);

		if (!transform) return [];

		const entitySize = renderable
			? new Vector2(renderable.container.width, renderable.container.height)
			: new Vector2(0, 0);

		const minPoint = transform.position;
		const maxPoint = new Vector2(
			minPoint.x + entitySize.x,
			minPoint.y + entitySize.y
		);

		// return all hashes that the entity is in
		const hashes = [];

		for (let x = minPoint.x; x <= maxPoint.x; x += this.resolution) {
			for (let y = minPoint.y; y <= maxPoint.y; y += this.resolution) {
				const hash = this.generateHash(x, y);
				hashes.push(hash);
			}
		}

		return hashes;
	}

	getEntities(point: Vector2, radius = this.resolution) {
		let entities = new Set<number>();

		const min = new Vector2(point.x - radius, point.y - radius);
		const max = new Vector2(point.x + radius, point.y + radius);

		for (let x = min.x; x <= max.x; x += this.resolution) {
			for (let y = min.y; y <= max.y; y += this.resolution) {
				const hash = this.generateHash(x, y);
				const bucket = this.buckets.get(hash);

				if (bucket) entities = entities.union(bucket);
			}
		}

		return [...entities];
	}

	get(min: Vector2, max?: Vector2) {
		const minHash = this.generateHash(min);
		const entities = [...(this.buckets.get(minHash) ?? [])];

		if (!max) return entities;

		const maxHash = this.generateHash(max);
		entities.push(...(this.buckets.get(maxHash) ?? []));

		if (Math.abs(min.x - max.x) > 128 || Math.abs(min.x - max.x) > 128) {
			const j = min.clone();

			const [stepsX, stepsY] = [
				Math.ceil(Math.abs(min.x - max.x) / this.resolution),
				Math.ceil(Math.abs(min.y - max.y) / this.resolution)
			];

			for (let i = 0; i < stepsX * stepsY; i++) {
				j.x = Math.floor(i % stepsX) * this.resolution;
				j.y = Math.floor(i / stepsY) * this.resolution;

				const hash = this.generateHash(j);

				entities.push(...(this.buckets.get(hash) ?? []));
			}
		}

		return [...new Set(entities)];
	}
}
