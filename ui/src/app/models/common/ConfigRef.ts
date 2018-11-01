import { Config } from './Config';
import { Container } from './Container';
import { ParsedObject } from '../parse/ParsedObject';

/** common config-ref entry */

export class ConfigRef extends ParsedObject {

  public static OBJECT_NAME = 'config-ref';

  container: string;
  container_name: string;
  name: string;
  path: string;
  config: string;
  mode: string;
  readonly: boolean;

  public static construct(type: string): ParsedObject {
    return new ConfigRef();
  }

  constructor() {
    super(ConfigRef.OBJECT_NAME);
  }

  /** convert from a flat object */
  fromFlat(flat: any): void {
    super.fromFlat(flat);
    this.container = flat['container'];
    this.container_name = flat['container-name'];
    this.name = flat['name'];
    this.path = flat['path'];
    this.config = flat['config'];
    this.mode = flat['mode'];
    this.readonly = flat['readonly'];
  }

  /** convert to a flat object */
  toFlat(): any {
    const flat = super.toFlat();
    flat['container'] = this.container;
    const container = this.getContainer();
    flat['container-name'] = (container ? container.name : undefined);
    flat['config'] = this.config;
    const config = this.getConfig();
    flat['name'] = (config ? config.name : undefined);
    flat['path'] = this.path;
    flat['readonly'] = this.readonly;
    flat['mode'] = this.mode;
    return flat;
  }

  private getConfig(): Config {
    if (this.finder !== undefined) {
      return this.finder.objects
        .filter((p) => p.type === Config.OBJECT_NAME)
        .map((p: Config) => p as Config)
        .find((p) => p.id === this.config);
    }
    return undefined;
  }

  private getContainer(): Container {
    if (this.finder !== undefined) {
      return this.finder.objects
        .filter((p) => p.type === Container.OBJECT_NAME)
        .map((p: Container) => p as Container)
        .find((p) => p.id === this.container);
    }
    return undefined;
  }

}
