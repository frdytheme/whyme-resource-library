import { resources } from "@/data/resources";

export const visibleResources = resources.filter((resource) => !resource.isHidden);
