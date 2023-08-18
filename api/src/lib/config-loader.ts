import { Logger } from './logger';
import { SecretsManager } from './secrets-manager';

const isInEnvironment = (configKey: string) => process.env[configKey] && process.env[configKey] !== '';

const isInSecrets = (configKey: string, secretConfig: any) => secretConfig[configKey]
  && secretConfig[configKey] !== '';

const mask = (val: string) => '*'.repeat(val.length * 2);

export class ConfigLoader<T> {
  private secretsManager: SecretsManager;

  constructor(private logger: Logger) {
    this.secretsManager = new SecretsManager();
  }

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

        if (isInSecrets(key, secretConfig)) {
          const value = secretConfig[key];

          this.logger.info(`Using secrets for ${key} ${mask(value)}`);
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

  async load(config: T, secretId: string, skipSecretsManager: boolean) {
    if (skipSecretsManager) {
      this.logger.info('Skipping secret loader');
      return { ...config };
    }

    const secrets = await this.secretsManager.getSecret(secretId);
    return this.mergeConfigs(config, secrets);
  }
}
