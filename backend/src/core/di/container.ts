import { Container } from "inversify";
import { loadCoreContainerModule } from "@core/di/core.container-module";
import { registerHandlers } from "@core/di/register-handlers";

export type ContainerModuleLoader = (container: Container) => void;

export function buildContainer(...modules: ContainerModuleLoader[]): Container {
  const container = new Container({ defaultScope: "Transient" });

  loadCoreContainerModule(container);

  for (const moduleLoader of modules) {
    moduleLoader(container);
  }

  registerHandlers(container);

  return container;
}
