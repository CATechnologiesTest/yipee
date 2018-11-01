import { ParsedObject } from '../parse/ParsedObject';

/** Yipee flat file healthcheck entry. */

export class Healthcheck extends ParsedObject {

  public static OBJECT_NAME = 'healthcheck';
  public static LIVENESS_TYPE = 'liveness';
  public static READINESS_TYPE = 'readiness';

  container: string;
  healthcmd: string[];
  interval: number;
  retries: number;
  timeout: number;
  protocol: string;
  check_type: string;
  httpGet: {
    host: string;
    port: string;
    scheme: string;
    path: string;
    httpHeaders: any[];
  };

  public static construct(type: string): ParsedObject {
    return new Healthcheck();
  }

  constructor() {
    super(Healthcheck.OBJECT_NAME);
    this.healthcmd = [];
    this.interval = 0;
    this.retries = 0;
    this.timeout = 0;
    this.protocol = '';
    this.httpGet = {
      host: '',
      port: '',
      scheme: 'HTTP',
      path: '',
      httpHeaders: []
    };
  }

  /** is the object empty */
  isEmpty(): boolean {
    return (this.healthcmd.length === 0
      && this.interval === 0
      && this.retries === 0
      && this.timeout === 0
      && this.httpGet.host === ''
      && this.httpGet.port === ''
      && this.httpGet.path === ''
      || this.protocol === ''
    );
  }

  /** convert from a flat object */
  fromFlat(flat: any): void {
    super.fromFlat(flat);
    this.container = flat['container'];
    this.interval = flat['interval'];
    this.protocol = flat['protocol'];
    this.retries = flat['retries'];
    this.timeout = flat['timeout'];
    this.check_type = flat['check-type'];
    if (this.protocol === 'http') {
      this.httpGet = flat['httpGet'];
    }
    if (this.protocol === 'exec') {
      this.healthcmd = flat['healthcmd'];
    }

  }

  /** convert to a flat object */
  toFlat(): any {
    const flat = super.toFlat();
    flat['container'] = this.container;
    flat['interval'] = this.interval;
    flat['protocol'] = this.protocol;
    flat['retries'] = this.retries;
    flat['timeout'] = this.timeout;
    flat['check-type'] = this.check_type;
    if (this.protocol === 'http') {
      flat['httpGet'] = this.httpGet;
    }
    if (this.protocol === 'exec') {
      flat['healthcmd'] = this.healthcmd;
    }

    return flat;
  }

}
