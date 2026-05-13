import { Container } from "inversify";
import { loadCoreContainerModule } from "@core/di/core.container-module";

export type ContainerModuleLoader = (container: Container) => void;

export function buildContainer(...modules: ContainerModuleLoader[]): Container {
  const container = new Container({ defaultScope: "Transient" });

  loadCoreContainerModule(container);

  for (const moduleLoader of modules) {
    moduleLoader(container);
  }

  return container;
}
