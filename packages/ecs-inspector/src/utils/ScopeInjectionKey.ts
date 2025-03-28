import type { Scope } from "@dacite/ecs";
import type { InjectionKey } from "vue";

export const ScopeInjectionKey = Symbol("scope") as InjectionKey<Scope>;
