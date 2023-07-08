import { Logger } from './logger';

const isInEnvironment = (configKey: string) => process.env[configKey] && process.env[configKey] !== '';

const mask = (val: string) => '*'.repeat(val.length * 2);

export class ConfigLoader<T> {
  constructor(private logger: Logger) {}

  private mergeConfigs(config: any, secretConfig: any) {
    return Object.keys(config).reduce((acc, key) => {
      const dataType = typeof config[key];

      if (dataType === 'object') {
        acc[key] = this.mergeConfigs(config[key], secretConfig);
        return acc;
      }

      if (dataType === 'string') {
        if (isInEnvironment(key)) {
          const value = process.env[key];

          this.logger.info(`Using environment for ${key} ${mask(value)}`)
          acc[key] = value;
          return acc;
        }

        const value = config[key];
        this.logger.info(`Using default config for ${key} ${mask(value)}`);
        acc[key] = value;

        return acc;
      }

      return acc;
    }, {}) as T;
  }

  async load(config: T) {
    return this.mergeConfigs(config, {});
  }
}
