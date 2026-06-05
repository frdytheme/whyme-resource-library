import { additionalResources } from "@/data/additionalResources";
import { resources } from "@/data/resources";

export const visibleResources = [...resources, ...additionalResources].filter(
  (resource) => !resource.isHidden,
);
