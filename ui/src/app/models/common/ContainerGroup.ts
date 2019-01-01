import { EventEmitter } from '@angular/core';

import { Annotation } from './Annotation';
import { Container } from './Container';
import { CronJobData } from '../k8s/CronJobData';
import { DeploymentSpec } from './DeploymentSpec';
import { ExtraHosts } from './ExtraHosts';
import { FinderUtilities } from './FinderUtilities';
import { Label } from './Label';
import { NameChangeEvent } from '../Events';
import { ValueChangeEvent } from '../Events';
import { ParsedObject } from '../parse/ParsedObject';
import { Replication } from './Replication';
import { Restart } from './Restart';
import { Service } from '../k8s/Service';
import { TopLabel } from '../k8s/TopLabel';

/** Yipee flat file container-group entry. */

export class ContainerGroup extends ParsedObject {

  public static OBJECT_NAME = 'container-group';
  public static TYPE_DEPLOYMENT = 'Deployment';

  _name: string;
  pod: string;
  /** auto or k8s */
  source: string;
  _controller_type: string;
  public onNameChange: EventEmitter<NameChangeEvent> = new EventEmitter<NameChangeEvent>();
  public onContainerCountChange: EventEmitter<ValueChangeEvent> = new EventEmitter<ValueChangeEvent>();
  public onContainerGroupDelete: EventEmitter<string> = new EventEmitter<string>();

  public static construct(type: string): ParsedObject {
    return new ContainerGroup();
  }

  constructor() {
    super(ContainerGroup.OBJECT_NAME);
    this._controller_type = ContainerGroup.TYPE_DEPLOYMENT;
  }

  /** is the object empty */
  isEmpty(): boolean {
    return false;
  }

  /** convert from a flat object */
  fromFlat(flat: any): void {
    super.fromFlat(flat);
    this.name = flat['name'];
    this.pod = flat['pod'];
    this.source = flat['source'];
    this._controller_type = flat['controller-type'];
  }

  /** convert to a flat object */
  toFlat(): any {
    const flat = super.toFlat();
    flat['name'] = this.name;
    flat['pod'] = this.pod;
    flat['source'] = this.source;
    if (this._controller_type) {
      flat['controller-type'] = this._controller_type;
    }
    flat['containers'] = this.containers.map((c) => c.id);
    flat['container-names'] = this.containers.map((c) => c.name);
    return flat;
  }

  /** remove the container group and all children and referenced children */
  remove(): void {
    super.remove();

    for (const container of this.containers) {
      container.remove();
    }
    this.getExtraHosts().remove();
    for (const label of this.label) {
      label.remove();
    }
    this.getReplication().remove();
    for (const label of this.top_label) {
      label.remove();
    }

    this.onContainerGroupDelete.emit(this.id);
    this.getDeploymentSpec().remove();
    FinderUtilities.removeObjectAnnotations(this.finder, this.id);
  }

  get controller_type(): string {
    return this.getDeploymentSpec().controller_type;
  }

  set controller_type(value: string) {
    this.getDeploymentSpec().controller_type = value;
  }

  get cronjob_data(): CronJobData {
    return this.getCronJobData();
  }

  get image_pull_secrets(): string[] {
    if (this.getDeploymentSpec().image_pull_secrets) {
      return this.getDeploymentSpec().image_pull_secrets;
    } else {
      return [];
    }
  }

  set image_pull_secrets(value: string[]) {
    this.getDeploymentSpec().image_pull_secrets = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this.onNameChange.emit(new NameChangeEvent(this._name, value));
    this._name = value;
  }

  get init_containers(): Container[] {
    return this.finder.objects
      .filter((p) => p.type === Container.OBJECT_NAME)
      .map((p: Container) => p as Container)
      .filter((p) => p.cgroup === this.id && p.position >= 0)
      .sort((a, b) => a.comparePosition(b));
  }

  get containers(): Container[] {
    return this.finder.objects
      .filter((p) => p.type === Container.OBJECT_NAME)
      .map((p: Container) => p as Container)
      .filter((p) => p.cgroup === this.id);
  }

  get container_count(): number {
    return this.containers.length - this.init_containers.length;
  }

  get ui(): any {
    return FinderUtilities.getUi(this.finder, this.id).value;
  }

  get deployment_spec(): DeploymentSpec {
    return this.getDeploymentSpec();
  }

  get extra_hosts(): string[] {
    return this.getExtraHosts().value;
  }

  set extra_hosts(value: string[]) {
    this.getExtraHosts().value = value;
  }

  get description(): string {
    return FinderUtilities.getDescription(this.finder, this.id).value;
  }

  set description(value: string) {
    FinderUtilities.getDescription(this.finder, this.id).value = value;
  }

  get label(): Label[] {
    return this.getLabel();
  }

  addLabel(label: Label): void {
    label.cgroup = this.id;
    this.finder.push(label);
  }

  removeLabel(id: string): void {
    this.finder.remove(id);
  }

  get top_label(): TopLabel[] {
    return this.getTopLabel();
  }

  addTopLabel(label: TopLabel): void {
    label.cgroup = this.id;
    this.finder.push(label);
  }

  removeTopLabel(id: string): void {
    this.finder.remove(id);
  }

  get replication(): number {
    return this.getReplication().count;
  }

  set replication(value: number) {
    this.getReplication().count = value;
  }

  get restart(): string {
    return this.getRestart().value;
  }

  set restart(value: string) {
    this.getRestart().value = value;
  }

  public addContainer(container: Container): void {
    if (container.isInitContainer()) {
      container.position = this.init_containers.length;
    }
    const old = this.container_count;
    container.cgroup = this.id;
    this.orderInitContainers();
    this.onContainerCountChange.emit(new ValueChangeEvent(old, this.container_count));
  }

  public removeContainer(container: Container): void {
    const old = this.container_count;
    container.cgroup = undefined;
    if (container.isInitContainer()) {
      container.position = 0;
    }
    this.orderInitContainers();
    this.onContainerCountChange.emit(new ValueChangeEvent(old, this.container_count));
  }

  public orderInitContainers(): void {
    let p = 0;
    for (const container of this.init_containers) {
      container.position = p++;
    }
  }

  private getDeploymentSpec(): DeploymentSpec {
    let spec = this.finder.objects
      .filter((p) => p.type === DeploymentSpec.OBJECT_NAME)
      .map((p: DeploymentSpec) => p as DeploymentSpec)
      .find((p) => p.cgroup === this.id);
    if (spec === undefined) {
      spec = new DeploymentSpec();
      spec.cgroup = this.id;
      this.finder.push(spec);
    }
    return spec;
  }

  private getExtraHosts(): ExtraHosts {
    let extra = this.finder.objects
      .filter((p) => p.type === ExtraHosts.OBJECT_NAME)
      .map((p: ExtraHosts) => p as ExtraHosts)
      .find((p) => p.cgroup === this.id);
    if (extra === undefined) {
      extra = new ExtraHosts();
      extra.cgroup = this.id;
      this.finder.push(extra);
    }
    return extra;
  }

  private getReplication(): Replication {
    let rep = this.finder.objects
      .filter((p) => p.type === Replication.OBJECT_NAME)
      .map((p: Replication) => p as Replication)
      .find((p) => p.cgroup === this.id);
    if (rep === undefined) {
      rep = new Replication();
      rep.cgroup = this.id;
      this.finder.push(rep);
    }
    return rep;
  }

  private getRestart(): Restart {
    let restart = this.finder.objects
      .filter((p) => p.type === Restart.OBJECT_NAME)
      .map((p: Restart) => p as Restart)
      .find((p) => p.cgroup === this.id);
    if (restart === undefined) {
      restart = new Restart();
      restart.cgroup = this.id;
      this.finder.push(restart);
    }
    return restart;
  }

  private getCronJobData(): CronJobData {
    let data = this.finder.objects
      .filter((p) => p.type === CronJobData.OBJECT_NAME)
      .map((p: CronJobData) => p as CronJobData)
      .find((p) => p.cgroup === this.id);
    if (data === undefined) {
      data = new CronJobData();
      data.cgroup = this.id;
      this.finder.push(data);
    }
    return data;
  }

  private getLabel(): Label[] {
    const mapping = this.finder.objects
      .filter((p) => p.type === Label.OBJECT_NAME)
      .map((p: Label) => p as Label)
      .filter((p) => p.cgroup === this.id);
    return mapping;
  }

  private getTopLabel(): TopLabel[] {
    const mapping = this.finder.objects
      .filter((p) => p.type === TopLabel.OBJECT_NAME)
      .map((p: TopLabel) => p as TopLabel)
      .filter((p) => p.cgroup === this.id);
    return mapping;
  }

}
