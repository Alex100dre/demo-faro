export enum Env {
  LOCAL = "local",
  DEVELOPMENT = "development",
  RECETTE = "recette",
  QUALIFICATION = "qualification",
  PRODUCTION = "production",
}

interface APMConfig {
  enabled: boolean;
  url: string;
}

interface BrowserWindowConfig {
  environment?: Env;
  app_name?: string;
  app_version?: string;
  apm?: APMConfig;
  [key: string]: unknown;
}

type ExtendedWindow = Window & {config: BrowserWindowConfig};

export class Configuration {
  environment: Env = Env.LOCAL
  app_name: string = "Sans nom"
  app_version: string = "0.0.0"
  apm: APMConfig = {
    enabled: false,
    url: "",
  }

  public constructor() {
    const browserWindow = window as unknown as ExtendedWindow || {}
    const browserWindowConfig: BrowserWindowConfig = browserWindow.config || {}

    for (const key in browserWindowConfig) {
      if (Object.prototype.hasOwnProperty.call(browserWindowConfig, key)) {
        // @ts-expect-error fixme
        this[key as keyof Configuration] = browserWindowConfig[key] as Env
      }
    }
  }
}
