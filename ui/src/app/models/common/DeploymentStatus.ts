import { ParsedObject } from '../parse/ParsedObject';

/** Yipee flat file deployment-status entry. */

export class DeploymentStatus extends ParsedObject {

  public static OBJECT_NAME = 'deployment-status';

  private _status: string;
  private _requested_replicas: number;
  private _active_replicas: number;
  private _restart_count: number;
  public cgroup: string;

  public static construct(type: string): ParsedObject {
    return new DeploymentStatus();
  }

  constructor() {
    super(DeploymentStatus.OBJECT_NAME);
    this.status = 'green';
    this.requested_replicas = 0;
    this.active_replicas = 0;
    this.restart_count = 0;
  }

  /** this object is always empty, we never send it back to the server */
  isEmpty(): boolean {
    return true;
  }

  /** convert from a flat object */
  fromFlat(flat: any): void {
    console.log(flat);
    super.fromFlat(flat);
    this.status = flat['status'];
    this.cgroup = flat['cgroup'];
    this.requested_replicas = flat['requested-replicas'];
    this.active_replicas = flat['active-replicas'];
    this.restart_count = flat['restart-count'];
  }

  get status(): string {
    return this._status;
  }

  set status(value: string) {
    this._status = value;
    this.initiateAttributeChange('status');
  }

  get active_replicas(): number {
    return this._active_replicas;
  }

  set active_replicas(value: number) {
    this._active_replicas = value;
    this.initiateAttributeChange('active_replicas');
  }

  get restart_count(): number {
    return this._restart_count;
  }

  set restart_count(value: number) {
    this._restart_count = value;
    this.initiateAttributeChange('restart_count');
  }

  get requested_replicas(): number {
    return this._requested_replicas;
  }

  set requested_replicas(value: number) {
    this._requested_replicas = value;
    this.initiateAttributeChange('requested_replicas');
  }

}
