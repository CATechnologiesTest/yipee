import { EventEmitter } from '@angular/core';

import { ParsedObject } from '../parse/ParsedObject';
import { NameChangeEvent } from '../Events';

/** Yipee flat file deployment-spec entry. */

export class DeploymentSpec extends ParsedObject {

  public static OBJECT_NAME = 'deployment-spec';

  count: number;
  /** replica or allnodes */
  mode: string;
  cgroup: string;
  /** Deployment, DaemonSet, StatefulSet, Job, or CronJob */
  controller_type: string;
  private _service_name: string;
  termination_grace_period: number;
  /** OnDelete or RollingUpdate */
  update_strategy: string;
  partition: number;
  maxSurge: string;
  maxUnavailable: string;
  revisionHistoryLimit: number;
  /** OrderedReady or Parallel */
  pod_management_policy: string;
  image_pull_secrets: string[];
  service_account_name: string;
  automount_service_account_token: string;

  private _original_update_strategy: string;

  public onServiceNameChange: EventEmitter<NameChangeEvent> = new EventEmitter<NameChangeEvent>();

  public static construct(type: string): ParsedObject {
    return new DeploymentSpec();
  }

  constructor() {
    super(DeploymentSpec.OBJECT_NAME);
    this._service_name = '';
    this.mode = 'replicated';
    this.image_pull_secrets = [];
  }
  remove() {
    super.remove();
  }
  get service_name(): string {
    return this._service_name;
  }

  set service_name(value: string) {
    this.onServiceNameChange.emit(new NameChangeEvent(this._service_name, value));
    this._service_name = value;
  }

  /** convert from a flat object */
  fromFlat(flat: any): void {
    super.fromFlat(flat);
    this.count = flat['count'];
    this.mode = flat['mode'];
    this.cgroup = flat['cgroup'];
    this.controller_type = flat['controller-type'];
    this._service_name = flat['service-name'];
    this.termination_grace_period = flat['termination-grace-period'];
    this.update_strategy = this.parseInUpdateStrategy(flat['update-strategy'], 'type');
    this.revisionHistoryLimit = flat['revisionHistoryLimit'];
    this.pod_management_policy = flat['pod-management-policy'];
    this.service_account_name = flat['service-account-name'];
    this.automount_service_account_token = flat['automount-service-account-token'];

    /**
     * convert imagePullSecrets from the new spec of an array of name value maps
     * to the original spec of an array of strings
     */
    if (flat['image-pull-secrets'] && (flat['image-pull-secrets'].length > 0) && (typeof flat['image-pull-secrets'][0]) === 'object') {
      flat['image-pull-secrets'].forEach((ips) => {
        this.image_pull_secrets.push(ips.name);
      });
    } else if (flat['image-pull-secrets'] && (flat['image-pull-secrets'].length > 0)) {
      this.image_pull_secrets = flat['image-pull-secrets'];
    } else {
      this.image_pull_secrets = [];
    }


  }

  /** convert to a flat object */
  toFlat(): any {
    const flat = super.toFlat();
    flat['count'] = this.count;
    flat['mode'] = this.mode;
    flat['cgroup'] = this.cgroup;
    flat['controller-type'] = this.controller_type;
    flat['service-name'] = this._service_name;
    flat['termination-grace-period'] = this.termination_grace_period;
    flat['update-strategy'] = this.getUpdateStrategy();
    flat['revisionHistoryLimit'] = this.revisionHistoryLimit;
    flat['pod-management-policy'] = this.pod_management_policy;
    flat['service-account-name'] = this.service_account_name;
    flat['automount-service-account-token'] = this.automount_service_account_token;

    /**
     * convert imagePullSecrets from the original spec of an array of strings
     * to the new spec of an array of name value maps
     */
    const imagePullSecretsMap = [];
    this.image_pull_secrets.forEach((ipsName) => {
      const ipsMapItem = { name: ipsName };
      imagePullSecretsMap.push(ipsMapItem);
    });

    flat['image-pull-secrets'] = imagePullSecretsMap;

    return flat;
  }

  private parseInUpdateStrategy(flat: any, param: string): string {
    if (flat) {
      if (flat['type']) {
        this._original_update_strategy = flat;

        if (flat['type'] === 'RollingUpdate' && (flat['rollingUpdate'])) {
          if (flat['rollingUpdate'].maxSurge) {
            this.maxSurge = flat['rollingUpdate'].maxSurge;
          }

          if (flat['rollingUpdate'].maxUnavailable) {
            this.maxUnavailable = flat['rollingUpdate'].maxUnavailable;
          }

          if (flat['rollingUpdate'].partition) {
            this.partition = flat['rollingUpdate'].partition;
          }

        }

        return flat[param];
      } else {
        return '';
      }
    }
    return '';
  }

  private getUpdateStrategy(): any {
    let us: any = { type: this.update_strategy };

    if (this.update_strategy) {

      // create update strategy object based on what controller type is
      if (this.controller_type === 'StatefulSet' && this.update_strategy === 'RollingUpdate') {
        us = { rollingUpdate: { partition: null }};
        us.type = this.update_strategy;
        us.rollingUpdate.partition = this.partition;
      } else if (this.controller_type === 'Deployment' && this.update_strategy === 'RollingUpdate') {
        us = { rollingUpdate: { maxSurge: null, maxUnavailable: null }};
        us.type = this.update_strategy;
        us.rollingUpdate.maxSurge = this.maxSurge;
        us.rollingUpdate.maxUnavailable = this.maxUnavailable;
      } else if (this._original_update_strategy && this._original_update_strategy['type'] === this.update_strategy) {
        us = this._original_update_strategy;
      }

      return us;
    }

    return '';
  }

}
