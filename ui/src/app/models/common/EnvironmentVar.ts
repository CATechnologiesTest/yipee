import { ParsedObject } from '../parse/ParsedObject';

/** Yipee flat file environment-var entry. */

export class EnvironmentVar extends ParsedObject {

  public static OBJECT_NAME = 'environment-var';

  container: string;
  key: string;
  value: string;
  config_key: string;
  config_name: string;

  secret_key: string;
  secret_name: string;

  apiVersion: string;
  fieldPath: string;

  containerName: string;
  divisor: string;
  resource: string;


  public static construct(type: string): ParsedObject {
    return new EnvironmentVar();
  }

  constructor() {
    super(EnvironmentVar.OBJECT_NAME);
  }

  /** is the object empty */
  isEmpty(): boolean {
    return (this.key === undefined || this.key === '');
  }

  /** convert from a flat object */
  fromFlat(flat: any): void {
    super.fromFlat(flat);
    this.container = flat['container'];
    this.key = flat['key'];
    if (flat['value'] !== undefined) {
      this.value = flat['value'];
    } else if (flat['valueFrom'] !== undefined) {
      const from = flat['valueFrom'];
      if (from['configMapKeyRef'] !== undefined) {
        this.config_name = from.configMapKeyRef.name;
        this.config_key = from.configMapKeyRef.key;
      } else if (from['secretKeyRef'] !== undefined) {
        this.secret_name = from.secretKeyRef.name;
        this.secret_key = from.secretKeyRef.key;
      } else if (from['fieldRef'] !== undefined) {
        this.apiVersion = from.fieldRef.apiVersion;
        this.fieldPath = from.fieldRef.fieldPath;
      } else if (from['resourceFieldRef'] !== undefined) {
        if (from.resourceFieldRef.containerName !== undefined) {
          this.containerName = from.resourceFieldRef.containerName;
        } else {
          this.containerName = '';
        }
        this.divisor = from.resourceFieldRef.divisor;
        this.resource = from.resourceFieldRef.resource;
      }
    }
  }

  /** convert to a flat object */
  toFlat(): any {
    const flat = super.toFlat();
    flat['container'] = this.container;
    flat['key'] = this.key;
    if (this.value !== undefined) {
      flat['value'] = this.value;
    } else if (this.config_name !== undefined) {
      flat['valueFrom'] = {
        'configMapKeyRef': {
          'key': this.config_key,
          'name': this.config_name,
        }
      };
    } else if (this.secret_name !== undefined) {
      flat['valueFrom'] = {
        'secretKeyRef': {
          'key': this.secret_key,
          'name': this.secret_name,
        }
      };
    } else if (this.fieldPath !== undefined) {
      flat['valueFrom'] = {
        'fieldRef': {
          'apiVersion': this.apiVersion,
          'fieldPath': this.fieldPath
        }
      };
    } else if (this.resource !== undefined) {
      if (this.containerName !== '') {
        flat['valueFrom'] = {
          'resourceFieldRef': {
            'containerName': this.containerName,
            'divisor': this.divisor,
            'resource': this.resource
          }
        };
      } else {
        flat['valueFrom'] = {
          'resourceFieldRef': {
            'divisor': this.divisor,
            'resource': this.resource
          }
        };
      }
    }
    return flat;
  }

  public isConfigRef(): boolean {
    return this.config_name !== undefined;
  }

  public isSecretRef(): boolean {
    return this.secret_name !== undefined;
  }

  public isFieldRef(): boolean {
    return this.fieldPath !== undefined;
  }

  public isResourceFieldRef(): boolean {
    return this.resource !== undefined;
  }

}
