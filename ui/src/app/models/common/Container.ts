import { EventEmitter } from '@angular/core';

import { Annotation } from './Annotation';
import { Command } from './Command';
import { Config } from './Config';
import { ConfigRef } from './ConfigRef';
import { ContainerLifecycle } from './ContainerLifecycle';
import { ContainerGroup } from './ContainerGroup';
import { DevelopmentConfig } from './DevelopmentConfig';
import { EmptyDirVolume } from './EmptyDirVolume';
import { HostPathVolume } from './HostPathVolume';
import { Entrypoint } from './Entrypoint';
import { EnvironmentVar } from './EnvironmentVar';
import { ExternalConfig } from './ExternalConfig';
import { FinderUtilities } from './FinderUtilities';
import { Healthcheck } from './Healthcheck';
import { Image } from './Image';
import { ImagePullPolicy } from '../k8s/ImagePullPolicy';
import { NameStringValue } from './Generic';
import { OverrideChangeEvent, NameChangeEvent } from '../Events';
import { ParsedObject } from '../parse/ParsedObject';
import { PortMapping } from './PortMapping';
import { Restart } from './Restart';
import { Secret } from './Secret';
import { SecretRef } from './SecretRef';
import { SecretVolume } from './SecretVolume';
import { Volume } from './Volume';
import { VolumeRef } from './VolumeRef';
import { Service } from '../k8s/Service';
import { K8sSecretRef } from '../k8s/K8sSecretRef';
import { K8sSecretVolume } from '../k8s/K8sSecretVolume';

/** Yipee flat file container entry. */

export class Container extends ParsedObject {

  public static OBJECT_NAME = 'container';

  private _name: string;
  private _cgroup: string;
  private _secret_volume_map: NameStringValue[];
  private _config_map: NameStringValue[];
  public position: number;
  public onNameChange: EventEmitter<NameChangeEvent> = new EventEmitter<NameChangeEvent>();
  public onOverrideChange: EventEmitter<OverrideChangeEvent> = new EventEmitter<OverrideChangeEvent>();

  public static construct(type: string): ParsedObject {
    return new Container();
  }

  constructor() {
    super(Container.OBJECT_NAME);
  }

  isInitContainer(): boolean {
    return this.position >= 0;
  }

  /** is the object empty */
  isEmpty(): boolean {
    return false;
  }

  /** convert from a flat object */
  fromFlat(flat: any): void {
    super.fromFlat(flat);
    this.name = flat['name'];
    this._cgroup = flat['cgroup'];
    if (flat['position'] !== undefined) {
      this.position = flat['position'];
    } else {
      this.position = -1;
    }
  }

  /** convert to a flat object */
  toFlat(): any {
    const flat = super.toFlat();
    flat['name'] = this.name;
    if (this._cgroup) {
      flat['cgroup'] = this._cgroup;
    }
    flat['position'] = this.position;
    return flat;
  }

  /** object added lifecycle event */
  objectAdded(object: ParsedObject): void {
    switch (object.type) {
      case Secret.OBJECT_NAME:
        this._secret_volume_map = this.getSecretVolumeMap();
        break;
      case Config.OBJECT_NAME:
        this._config_map = this.getConfigMap();
        break;
      case K8sSecretVolume.OBJECT_NAME:
        this._secret_volume_map = this.getSecretVolumeMap();
        break;
    }
  }

  /** object removed lifecycle event */
  objectRemoved(object: ParsedObject): void {
    switch (object.type) {
      case Secret.OBJECT_NAME:
        this._secret_volume_map = this.getSecretVolumeMap();
        break;
      case Config.OBJECT_NAME:
        this._config_map = this.getConfigMap();
        break;
      case K8sSecretVolume.OBJECT_NAME:
        this._secret_volume_map = this.getSecretVolumeMap();
        break;
    }
  }

  /** attribute changed lifecycle event */
  attributeChanged(object: ParsedObject, attribute: string): void {
    switch (object.type) {
      case Secret.OBJECT_NAME:
        this._secret_volume_map = this.getSecretVolumeMap();
        break;
      case Config.OBJECT_NAME:
        this._config_map = this.getConfigMap();
        break;
      case K8sSecretVolume.OBJECT_NAME:
        this._secret_volume_map = this.getSecretVolumeMap();
        break;
    }
  }

  /** remove the container and all references to this container */
  remove(): void {
    super.remove();
    this.getCommand().remove();
    FinderUtilities.getDescription(this.finder, this.id).remove();
    this.getDevelopmentConfig().remove();
    this.getEntrypoint().remove();
    for (const ev of this.environment_var) {
      ev.remove();
    }
    this.getExternalConfig().remove();
    this.getImage().remove();
    this.getImagePullPolicy().remove();
    this.getLivenessProbe().remove();
    this.getOverride().remove();
    for (const pm of this.port_mapping) {
      pm.remove();
    }
    this.getReadinessProbe().remove();
    FinderUtilities.getUi(this.finder, this.id).remove();
    for (const ref of this.volume_ref) {
      ref.remove();
    }
    for (const ref of this.empty_dir_ref) {
      ref.remove();
    }
    for (const ref of this.host_path_ref) {
      ref.remove();
    }
  }

  get cgroup(): string {
    return this._cgroup;
  }

  set cgroup(value: string) {
    if (this._cgroup !== value) {
      // need to clear out the port_mapping defining service on reparent
      for (const port_mapping of this.port_mapping) {
        port_mapping.defining_service = '';
      }
    }
    this._cgroup = value;
    this.refreshObjectsByType(Service.OBJECT_NAME);
  }

  get ui(): any {
    return FinderUtilities.getUi(this.finder, this.id).value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this.onNameChange.emit(new NameChangeEvent(this._name, value));
    this._name = value;
  }

  get image(): string {
    return this.getImage().value;
  }

  set image(value: string) {
    this.getImage().value = value;
  }

  get image_pull_policy(): string {
    return this.getImagePullPolicy().value;
  }

  set image_pull_policy(value: string) {
    this.getImagePullPolicy().value = value;
  }

  get description(): string {
    return FinderUtilities.getDescription(this.finder, this.id).value;
  }

  set description(value: string) {
    FinderUtilities.getDescription(this.finder, this.id).value = value;
  }

  get override(): string {
    return this.getOverride().value;
  }

  set override(value: string) {
    this.onOverrideChange.emit(new OverrideChangeEvent(this.getOverride().value, value));
    this.getOverride().value = value;
  }

  get post_start_command(): string {
    return this.a2c(this.getContainerLifecycle().post_start);
  }

  set post_start_command(value: string) {
    this.getContainerLifecycle().post_start = this.c2a(value);
  }

  get pre_stop_command(): string {
    return this.a2c(this.getContainerLifecycle().pre_stop);
  }

  set pre_stop_command(value: string) {
    this.getContainerLifecycle().pre_stop = this.c2a(value);
  }

  get container_lifecycle(): ContainerLifecycle {
    return this.getContainerLifecycle();
  }

  get command(): string[] {
    return this.getCommand().value;
  }

  set command(value: string[]) {
    this.getCommand().value = value;
  }

  get entrypoint(): string[] {
    return this.getEntrypoint().value;
  }

  set entrypoint(value: string[]) {
    this.getEntrypoint().value = value;
  }

  get development_config(): DevelopmentConfig {
    return this.getDevelopmentConfig();
  }

  get external_config(): ExternalConfig {
    return this.getExternalConfig();
  }

  get livenessProbe(): Healthcheck {
    return this.getLivenessProbe();
  }

  get readinessProbe(): Healthcheck {
    return this.getReadinessProbe();
  }

  get port_mapping(): PortMapping[] {
    return this.getPortMapping();
  }

  addPortMapping(mapping: PortMapping): void {
    mapping.container = this.id;
    this.finder.push(mapping);
    this.refreshObjectsByType(Service.OBJECT_NAME);
  }

  removePortMapping(id: string): void {
    this.finder.remove(id);
    this.refreshObjectsByType(Service.OBJECT_NAME);
  }

  get environment_var(): EnvironmentVar[] {
    return this.getEnvironmentVar();
  }

  get environment_var_config_ref(): EnvironmentVar[] {
    return this.getEnvironmentVarConfigRef();
  }

  get environment_var_secret_ref(): EnvironmentVar[] {
    return this.getEnvironmentVarSecretRef();
  }

  get environment_var_field_ref(): EnvironmentVar[] {
    return this.getEnvironmentVarFieldRef();
  }

  get environment_var_resource_field_ref(): EnvironmentVar[] {
    return this.getEnvironmentVarResourceFieldRef();
  }

  get volume_ref(): VolumeRef[] {
    return FinderUtilities.getVolumeRef(this.finder, this.id);
  }

  addVolumeReference(volume: Volume): VolumeRef {
    const volume_ref = new VolumeRef();
    volume_ref.volume = volume.id;
    volume_ref.container = this.id;
    this.finder.push(volume_ref);
    return volume_ref;
  }

  removeVolumeReference(volume: Volume): VolumeRef {
    const ref = this.volume_ref.find((p) => p.volume === volume.id);
    if (ref !== undefined) {
      ref.remove();
    }
    return ref;
  }

  canConnectVolume(volume: Volume): boolean {
    const cgroup = this.getContainerGroup();
    // cannot connect to orphaned containers not in a cgroup
    if (cgroup === undefined) {
      return false;
    }
    // cannot connect pvct to anything but a stateful set
    if (cgroup.controller_type !== 'StatefulSet' && volume.is_template) {
      return false;
    }
    // cannot connect pvct to more than one cgroup
    if (volume.is_template) {
      const ref = volume.volume_ref.find((v) => v.container !== undefined);
      if (ref) {
        const container = this.getContainer(ref.container);
        if (container.cgroup !== this.cgroup) {
          return false;
        }
      }
    }
    return (this.volume_ref.find((p) => p.volume === volume.id) === undefined);
  }

  get empty_dir_ref(): VolumeRef[] {
    return FinderUtilities.getEmptyDirRef(this.finder, this.id);
  }

  get host_path_ref(): VolumeRef[] {
    return FinderUtilities.getHostPathRef(this.finder, this.id);
  }

  addEmptyDirReference(empty_dir: EmptyDirVolume): VolumeRef {
    const volume_ref = new VolumeRef();
    volume_ref.volume = empty_dir.id;
    volume_ref.container = this.id;
    empty_dir.cgroup = this.cgroup;
    this.finder.push(volume_ref);
    return volume_ref;
  }

  removeEmptyDirReference(empty_dir: EmptyDirVolume): VolumeRef {
    const ref = this.empty_dir_ref.find((p) => p.volume === empty_dir.id);
    if (ref !== undefined) {
      ref.remove();
    }
    if (empty_dir.volume_ref.length === 0) {
      empty_dir.cgroup = undefined;
    }
    return ref;
  }

  canConnectEmptyDir(empty_dir: EmptyDirVolume): boolean {
    const cgroup = this.getContainerGroup();
    // cannot connect to orphaned containers not in a cgroup
    if (cgroup === undefined) {
      return false;
    }
    // cannot connect to more than one cgroup
    if (empty_dir.cgroup && empty_dir.cgroup !== cgroup.id) {
      return false;
    }
    return (this.empty_dir_ref.find((p) => p.volume === empty_dir.id) === undefined);
  }

  addHostPathReference(host_path: HostPathVolume): VolumeRef {
    const volume_ref = new VolumeRef();
    volume_ref.volume = host_path.id;
    volume_ref.container = this.id;
    host_path.cgroup = this.cgroup;
    this.finder.push(volume_ref);
    return volume_ref;
  }

  removeHostPathReference(host_path: HostPathVolume): VolumeRef {
    const ref = this.host_path_ref.find((p) => p.volume === host_path.id);
    if (ref !== undefined) {
      ref.remove();
    }
    if (host_path.volume_ref.length === 0) {
      host_path.cgroup = undefined;
    }
    return ref;
  }

  canConnectHostPath(host_path: HostPathVolume): boolean {
    const cgroup = this.getContainerGroup();
    // cannot connect to orphaned containers not in a cgroup
    if (cgroup === undefined) {
      return false;
    }
    // cannot connect to more than one cgroup
    if (host_path.cgroup && host_path.cgroup !== cgroup.id) {
      return false;
    }
    return (this.host_path_ref.find((p) => p.volume === host_path.id) === undefined);
  }

  get secret_ref(): SecretRef[] {
    return this.getSecretRef();
  }

  get k8s_secret_ref(): K8sSecretRef[] {
    return this.getK8sSecretRef();
  }

  get secret_volume_map(): NameStringValue[] {
    if (this._secret_volume_map === undefined) {
      this._secret_volume_map = this.getSecretVolumeMap();
    }
    return this._secret_volume_map;
  }

  addSecretReference(secret_ref: SecretRef): SecretRef {
    secret_ref.container = this.id;
    this.finder.push(secret_ref);
    return secret_ref;
  }

  addK8sSecretReference(k8s_secret_ref: K8sSecretRef): K8sSecretRef {
    k8s_secret_ref.container = this.id;
    this.finder.push(k8s_secret_ref);
    return k8s_secret_ref;
  }

  removeSecretReference(id: string): SecretRef {
    const secret_ref = this.secret_ref.find((c) => c.id === id);
    if (secret_ref) {
      secret_ref.remove();
    }
    return secret_ref;
  }

  removeK8sSecretReference(id: string): K8sSecretRef {
    const secret_ref = this.k8s_secret_ref.find((c) => c.id === id);
    if (secret_ref) {
      secret_ref.remove();
    }
    return secret_ref;
  }

  get config_ref(): ConfigRef[] {
    return this.getConfigRef();
  }

  get config_map(): NameStringValue[] {
    if (this._config_map === undefined) {
      this._config_map = this.getConfigMap();
    }
    return this._config_map;
  }

  addConfigRef(config_ref: ConfigRef): ConfigRef {
    config_ref.container = this.id;
    this.finder.push(config_ref);
    return config_ref;
  }

  removeConfigRef(id: string): ConfigRef {
    const config_ref = this.config_ref.find((c) => c.id === id);
    if (config_ref) {
      config_ref.remove();
    }
    return config_ref;
  }

  addEnvironmentVar(environmentVar: EnvironmentVar): void {
    environmentVar.container = this.id;
    this.finder.push(environmentVar);
  }

  removeEnvironmentVar(id: string): void {
    const env_var = this.finder.objects.find((p) => p.id === id);
    if (env_var) {
      env_var.remove();
    }
  }

  addFieldReference(fieldRef: EnvironmentVar): void {
    fieldRef.container = this.id;
    this.finder.push(fieldRef);
  }

  removeFieldReference(id: string): void {
    const field_ref = this.finder.objects.find((p) => p.id === id);
    if (field_ref) {
      field_ref.remove();
    }
  }

  addResourceFieldReference(resourceFieldRef: EnvironmentVar): void {
    resourceFieldRef.container = this.id;
    this.finder.push(resourceFieldRef);
  }

  removeResourceFieldReference(id: string): void {
    const resource_field_ref = this.finder.objects.find((p) => p.id === id);
    if (resource_field_ref) {
      resource_field_ref.remove();
    }
  }

  comparePosition(other: Container): number {
    return (this.position < other.position ? -1 : this.position > other.position ? 1 : 0);
  }

  private getOverride(): Annotation {
    let override = this.finder.objects
      .filter((p) => p.type === Annotation.OBJECT_NAME)
      .map((p: Annotation) => p as Annotation)
      .find((p) => p.annotated === this.id && p.key === 'override');
    if (override === undefined) {
      override = new Annotation();
      override.annotated = this.id;
      override.key = 'override';
      override.value = 'none';
      this.finder.push(override);
    }
    return override;
  }

  private getSecretRef(): SecretRef[] {
    const refs = this.finder.objects
      .filter((p) => p.type === SecretRef.OBJECT_NAME)
      .map((p: SecretRef) => p as SecretRef)
      .filter((p) => p.container === this.id);
    return refs;
  }

  private getK8sSecretRef(): K8sSecretRef[] {
    const refs = this.finder.objects
      .filter((p) => p.type === K8sSecretRef.OBJECT_NAME)
      .map((p: K8sSecretRef) => p as K8sSecretRef)
      .filter((p) => p.container === this.id);
    return refs;
  }

  private getSecretVolumeMap(): NameStringValue[] {
    const refs = this.finder.objects
      .filter((p) => p.type === K8sSecretVolume.OBJECT_NAME)
      .map((p: K8sSecretVolume) => p as K8sSecretVolume)
      .map((p: K8sSecretVolume) => new NameStringValue(p.name, p.id));
    return refs;
  }

  private getConfigRef(): ConfigRef[] {
    const refs = this.finder.objects
      .filter((p) => p.type === ConfigRef.OBJECT_NAME)
      .map((p: ConfigRef) => p as ConfigRef)
      .filter((p) => p.container === this.id);
    return refs;
  }

  private getConfigMap(): NameStringValue[] {
    const refs = this.finder.objects
      .filter((p) => p.type === Config.OBJECT_NAME)
      .map((p: Config) => p as Config)
      .map((p: Config) => new NameStringValue(p.name, p.id));
    return refs;
  }

  private getPortMapping(): PortMapping[] {
    const mapping = this.finder.objects
      .filter((p) => p.type === PortMapping.OBJECT_NAME)
      .map((p: PortMapping) => p as PortMapping)
      .filter((p) => p.container === this.id && p.container_references === true);
    return mapping;
  }

  private getEnvironmentVar(): EnvironmentVar[] {
    const mapping = this.finder.objects
      .filter((p) => p.type === EnvironmentVar.OBJECT_NAME)
      .map((p: EnvironmentVar) => p as EnvironmentVar)
      .filter((p) => p.container === this.id && !p.isConfigRef() && !p.isSecretRef() && !p.isFieldRef() && !p.isResourceFieldRef());
    return mapping;
  }

  private getEnvironmentVarConfigRef(): EnvironmentVar[] {
    const mapping = this.finder.objects
      .filter((p) => p.type === EnvironmentVar.OBJECT_NAME)
      .map((p: EnvironmentVar) => p as EnvironmentVar)
      .filter((p) => p.container === this.id && p.isConfigRef());
    return mapping;
  }

  private getEnvironmentVarSecretRef(): EnvironmentVar[] {
    const mapping = this.finder.objects
      .filter((p) => p.type === EnvironmentVar.OBJECT_NAME)
      .map((p: EnvironmentVar) => p as EnvironmentVar)
      .filter((p) => p.container === this.id && p.isSecretRef());
    return mapping;
  }

  private getEnvironmentVarFieldRef(): EnvironmentVar[] {
    const mapping = this.finder.objects
      .filter((p) => p.type === EnvironmentVar.OBJECT_NAME)
      .map((p: EnvironmentVar) => p as EnvironmentVar)
      .filter((p) => p.container === this.id && p.isFieldRef());
    return mapping;
  }

  private getEnvironmentVarResourceFieldRef(): EnvironmentVar[] {
    const mapping = this.finder.objects
      .filter((p) => p.type === EnvironmentVar.OBJECT_NAME)
      .map((p: EnvironmentVar) => p as EnvironmentVar)
      .filter((p) => p.container === this.id && p.isResourceFieldRef());
    return mapping;
  }

  private getImagePullPolicy(): ImagePullPolicy {
    let policy = this.finder.objects
      .filter((p) => p.type === ImagePullPolicy.OBJECT_NAME)
      .map((p: ImagePullPolicy) => p as ImagePullPolicy)
      .find((p) => p.container === this.id);
    if (policy === undefined) {
      policy = new ImagePullPolicy();
      policy.container = this.id;
      this.finder.push(policy);
    }
    return policy;
  }

  private getCommand(): Command {
    let command = this.finder.objects
      .filter((p) => p.type === Command.OBJECT_NAME)
      .map((p: Command) => p as Command)
      .find((p) => p.container === this.id);
    if (command === undefined) {
      command = new Command();
      command.container = this.id;
      this.finder.push(command);
    }
    return command;
  }

  private getContainerLifecycle(): ContainerLifecycle {
    let lifecycle = this.finder.objects
      .filter((p) => p.type === ContainerLifecycle.OBJECT_NAME)
      .map((p: ContainerLifecycle) => p as ContainerLifecycle)
      .find((p) => p.container === this.id);
    if (lifecycle === undefined) {
      lifecycle = new ContainerLifecycle();
      lifecycle.container = this.id;
      this.finder.push(lifecycle);
    }
    return lifecycle;
  }

  private getEntrypoint(): Entrypoint {
    let entrypoint = this.finder.objects
      .filter((p) => p.type === Entrypoint.OBJECT_NAME)
      .map((p: Entrypoint) => p as Entrypoint)
      .find((p) => p.container === this.id);
    if (entrypoint === undefined) {
      entrypoint = new Entrypoint();
      entrypoint.container = this.id;
      this.finder.push(entrypoint);
    }
    return entrypoint;
  }

  private getDevelopmentConfig(): DevelopmentConfig {
    let config = this.finder.objects
      .filter((p) => p.type === DevelopmentConfig.OBJECT_NAME)
      .map((p: DevelopmentConfig) => p as DevelopmentConfig)
      .find((p) => p.configured === this.id);
    if (config === undefined) {
      config = new DevelopmentConfig();
      config.configured = this.id;
      this.finder.push(config);
    }
    return config;
  }

  private getExternalConfig(): ExternalConfig {
    let config = this.finder.objects
      .filter((p) => p.type === ExternalConfig.OBJECT_NAME)
      .map((p: ExternalConfig) => p as ExternalConfig)
      .find((p) => p.configured === this.id);
    if (config === undefined) {
      config = new ExternalConfig();
      config.configured = this.id;
      this.finder.push(config);
    }
    return config;
  }

  private getImage(): Image {
    let image = this.finder.objects
      .filter((p) => p.type === Image.OBJECT_NAME)
      .map((p: Image) => p as Image)
      .find((p) => p.container === this.id);
    if (image === undefined) {
      image = new Image();
      image.container = this.id;
      this.finder.push(image);
    }
    return image;
  }

  private getLivenessProbe(): Healthcheck {
    let healthcheck = this.finder.objects
      .filter((p) => p.type === Healthcheck.OBJECT_NAME)
      .map((p: Healthcheck) => p as Healthcheck)
      .find((p) => p.container === this.id && p.check_type === Healthcheck.LIVENESS_TYPE);
    if (healthcheck === undefined) {
      healthcheck = new Healthcheck();
      healthcheck.container = this.id;
      healthcheck.check_type = Healthcheck.LIVENESS_TYPE;
      this.finder.push(healthcheck);
    }
    return healthcheck;
  }

  private getReadinessProbe(): Healthcheck {
    let healthcheck = this.finder.objects
      .filter((p) => p.type === Healthcheck.OBJECT_NAME)
      .map((p: Healthcheck) => p as Healthcheck)
      .find((p) => p.container === this.id && p.check_type === Healthcheck.READINESS_TYPE);
    if (healthcheck === undefined) {
      healthcheck = new Healthcheck();
      healthcheck.container = this.id;
      healthcheck.check_type = Healthcheck.READINESS_TYPE;
      this.finder.push(healthcheck);
    }
    return healthcheck;
  }

  public getContainerGroup(): ContainerGroup {
    return this.finder.objects
      .filter((p) => p.type === ContainerGroup.OBJECT_NAME)
      .map((p: ContainerGroup) => p as ContainerGroup)
      .find((p) => p.id === this.cgroup);
  }

  private getContainer(container: string): Container {
    return this.finder.objects
      .filter((p) => p.type === Container.OBJECT_NAME)
      .map((p: Container) => p as Container)
      .find((p) => p.id === container);
  }

  private c2a(text): string[] {
    const re = /^"[^"]*"$/; // Check if argument is surrounded with double-quotes
    const re2 = /^([^"]|[^"].*?[^"])$/; // Check if argument is NOT surrounded with double-quotes

    const arr = [];
    let argPart = null;

    if (text === undefined || text.length === 0) {
      return arr;
    }

    text.split(' ').forEach(function (arg) {
      if ((re.test(arg) || re2.test(arg)) && !argPart) {
        arr.push(arg);
      } else {
        argPart = argPart ? argPart + ' ' + arg : arg;
        // If part is complete (ends with a double quote), we can add it to the array
        if (/"$/.test(argPart)) {
          arr.push(argPart);
          argPart = null;
        }
      }
    });

    for (let i = 0; i < arr.length; i++) {
      arr[i] = arr[i].replace(/^"(.*)"$/, '$1');
    }

    return arr;
  }

  private a2c(arr: string[]): string {
    let c = '';
    for (const element of arr) {
      if (element.indexOf(' ') !== -1) {
        c = c.concat('"' + element + '" ');
      } else {
        c = c.concat(element + ' ');
      }
    }
    return c;
  }


}
