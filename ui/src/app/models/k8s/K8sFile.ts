import { Annotation } from '../common/Annotation';
import { AppInfo } from '../common/AppInfo';
import { ClassLookupEntry } from '../parse/ClassLookupEntry';
import { Command } from '../common/Command';
import { Config } from '../common/Config';
import { ConfigRef } from '../common/ConfigRef';
import { Container } from '../common/Container';
import { ContainerGroup } from '../common/ContainerGroup';
import { ContainerLifecycle } from '../common/ContainerLifecycle';
import { CronJobData } from './CronJobData';
import { DeploymentSpec } from '../common/DeploymentSpec';
import { DevelopmentConfig } from '../common/DevelopmentConfig';
import { EmptyDirVolume } from '../common/EmptyDirVolume';
import { HostPathVolume } from '../common/HostPathVolume';
import { Entrypoint } from '../common/Entrypoint';
import { EnvironmentVar } from '../common/EnvironmentVar';
import { ExternalConfig } from '../common/ExternalConfig';
import { ExtraHosts } from '../common/ExtraHosts';
import { Healthcheck } from '../common/Healthcheck';
import { Image } from '../common/Image';
import { ImagePullPolicy } from './ImagePullPolicy';
import { Ingress } from './Ingress';
import { Label } from '../common/Label';
import { ParsedObject } from '../parse/ParsedObject';
import { Parser } from '../parse/Parser';
import { PortMapping } from '../common/PortMapping';
import { Replication } from '../common/Replication';
import { Restart } from '../common/Restart';
import { Secret } from '../common/Secret';
import { SecretRef } from '../common/SecretRef';
import { SecretVolume } from '../common/SecretVolume';
import { Service } from './Service';
import { TopLabel } from './TopLabel';
import { Volume } from '../common/Volume';
import { VolumeRef } from '../common/VolumeRef';
import { Namespace } from '../k8s/Namespace';
import { UnknownKind } from '../k8s/UnknownKind';
import { K8sSecretVolume } from './K8sSecretVolume';
import { K8sSecretRef } from './K8sSecretRef';
import { K8sAnnotation } from './K8sAnnotation';

/** a parsed k8s file */

export class K8sFile {

  private static LOOKUP_TABLE: ClassLookupEntry[] = [
    new ClassLookupEntry(Annotation.OBJECT_NAME, Annotation.construct),
    new ClassLookupEntry(AppInfo.OBJECT_NAME, AppInfo.construct),
    new ClassLookupEntry(Command.OBJECT_NAME, Command.construct),
    new ClassLookupEntry(Config.OBJECT_NAME, Config.construct),
    new ClassLookupEntry(ConfigRef.OBJECT_NAME, ConfigRef.construct),
    new ClassLookupEntry(Container.OBJECT_NAME, Container.construct),
    new ClassLookupEntry(ContainerGroup.OBJECT_NAME, ContainerGroup.construct),
    new ClassLookupEntry(ContainerLifecycle.OBJECT_NAME, ContainerLifecycle.construct),
    new ClassLookupEntry(CronJobData.OBJECT_NAME, CronJobData.construct),
    new ClassLookupEntry(DeploymentSpec.OBJECT_NAME, DeploymentSpec.construct),
    new ClassLookupEntry(DevelopmentConfig.OBJECT_NAME, DevelopmentConfig.construct),
    new ClassLookupEntry(EmptyDirVolume.OBJECT_NAME, EmptyDirVolume.construct),
    new ClassLookupEntry(HostPathVolume.OBJECT_NAME, HostPathVolume.construct),
    new ClassLookupEntry(Entrypoint.OBJECT_NAME, Entrypoint.construct),
    new ClassLookupEntry(EnvironmentVar.OBJECT_NAME, EnvironmentVar.construct),
    new ClassLookupEntry(ExternalConfig.OBJECT_NAME, ExternalConfig.construct),
    new ClassLookupEntry(ExtraHosts.OBJECT_NAME, ExtraHosts.construct),
    new ClassLookupEntry(Healthcheck.OBJECT_NAME, Healthcheck.construct),
    new ClassLookupEntry(Image.OBJECT_NAME, Image.construct),
    new ClassLookupEntry(ImagePullPolicy.OBJECT_NAME, ImagePullPolicy.construct),
    new ClassLookupEntry(Ingress.OBJECT_NAME, Ingress.construct),
    new ClassLookupEntry(Label.OBJECT_NAME, Label.construct),
    new ClassLookupEntry(PortMapping.OBJECT_NAME, PortMapping.construct),
    new ClassLookupEntry(Replication.OBJECT_NAME, Replication.construct),
    new ClassLookupEntry(Restart.OBJECT_NAME, Restart.construct),
    new ClassLookupEntry(Secret.OBJECT_NAME, Secret.construct),
    new ClassLookupEntry(SecretRef.OBJECT_NAME, SecretRef.construct),
    new ClassLookupEntry(SecretVolume.OBJECT_NAME, SecretVolume.construct),
    new ClassLookupEntry(Service.OBJECT_NAME, Service.construct),
    new ClassLookupEntry(TopLabel.OBJECT_NAME, TopLabel.construct),
    new ClassLookupEntry(Volume.OBJECT_NAME, Volume.construct),
    new ClassLookupEntry(VolumeRef.OBJECT_NAME, VolumeRef.construct),
    new ClassLookupEntry(Namespace.OBJECT_NAME, Namespace.construct),
    new ClassLookupEntry(UnknownKind.OBJECT_NAME, UnknownKind.construct),
    new ClassLookupEntry(K8sSecretVolume.OBJECT_NAME, K8sSecretVolume.construct),
    new ClassLookupEntry(K8sSecretRef.OBJECT_NAME, K8sSecretRef.construct),
    new ClassLookupEntry(K8sAnnotation.OBJECT_NAME, K8sAnnotation.construct)
  ];

  private heldObjects = [];
  private parser: Parser;

  constructor() {
    this.parser = new Parser(K8sFile.LOOKUP_TABLE);
  }

  get appInfo(): AppInfo {
    return this.getAppInfo();
  }

  get containerGroups(): ContainerGroup[] {
    return this.parser.finder.objects.filter((o) => o.type === ContainerGroup.OBJECT_NAME) as ContainerGroup[];
  }

  get containers(): Container[] {
    return this.parser.finder.objects.filter((o) => o.type === Container.OBJECT_NAME) as Container[];
  }

  get ingress(): Ingress[] {
    return this.parser.finder.objects.filter((o) => o.type === Ingress.OBJECT_NAME) as Ingress[];
  }

  get unknownKinds(): UnknownKind[] {
    return this.parser.finder.objects.filter((o) => o.type === UnknownKind.OBJECT_NAME) as UnknownKind[];
  }

  get volumes(): Volume[] {
    return this.parser.finder.objects.filter((o) => o.type === Volume.OBJECT_NAME) as Volume[];
  }

  get empty_dirs(): EmptyDirVolume[] {
    return this.parser.finder.objects.filter((o) => o.type === EmptyDirVolume.OBJECT_NAME) as EmptyDirVolume[];
  }

  get host_paths(): HostPathVolume[] {
    return this.parser.finder.objects.filter((o) => o.type === HostPathVolume.OBJECT_NAME) as HostPathVolume[];
  }

  get services(): Service[] {
    return this.parser.finder.objects.filter((o) => o.type === Service.OBJECT_NAME) as Service[];
  }

  get configs(): Config[] {
    return this.parser.finder.objects.filter((o) => o.type === Config.OBJECT_NAME) as Config[];
  }

  addConfig(config: Config): void {
    this.parser.finder.push(config);
  }

  removeConfig(id: string): void {
    const config = this.configs.find((c) => c.id === id);
    if (config !== undefined) {
      config.remove();
    }
  }

  get secrets(): Secret[] {
    return this.parser.finder.objects.filter((o) => o.type === Secret.OBJECT_NAME) as Secret[];
  }

  get secret_volumes(): SecretVolume[] {
    return this.parser.finder.objects.filter((o) => o.type === SecretVolume.OBJECT_NAME) as SecretVolume[];
  }

  get k8s_secret_volumes(): K8sSecretVolume[] {
    return this.parser.finder.objects.filter((o) => o.type === K8sSecretVolume.OBJECT_NAME) as K8sSecretVolume[];
  }

  addSecretVolume(secretVolume: SecretVolume): void {
    this.parser.finder.push(secretVolume);
  }

  addK8sSecretVolume(secretVolume: K8sSecretVolume): void {
    this.parser.finder.push(secretVolume);
  }

  removeSecretVolume(id: string): void {
    const secretVolume = this.secret_volumes.find((s) => s.id === id);
    if (secretVolume !== undefined) {
      secretVolume.remove();
    }
  }

  removeK8sSecretVolume(id: string): void {
    const secretVolume = this.k8s_secret_volumes.find((s) => s.id === id);
    if (secretVolume !== undefined) {
      secretVolume.remove();
    }
  }

  /** convert from a flat file object */
  fromFlat(flat: any): void {
    this.parser.fromFlat(flat, this, this.store, this.hold);
  }

  /** covert to a flat file object */
  toFlat(): any {
    return this.parser.toFlat(this.parser.finder.objects, this.heldObjects);
  }

  /** store a single parsed object for use by the application */
  store(context: any, object: ParsedObject): void {
    context.parser.finder.push(object);
  }

  /** hold a group of objects that are unknown or not wanted */
  hold(context: any, object: any): void {
    // store held objects locally, no need expose them
    context.heldObjects.push(object);
  }

  push(object: ParsedObject): void {
    object.finder = this.parser.finder;
    this.parser.finder.push(object);
  }

  filterByType(type: string): ParsedObject[] {
    return this.parser.finder.objects.filter((p) => p.type === type);
  }

  private getAppInfo(): AppInfo {
    let ai = this.parser.finder.objects.find((p) => p.type === AppInfo.OBJECT_NAME) as AppInfo;
    if (ai === undefined) {
      ai = new AppInfo();
      this.parser.finder.push(ai);
    }
    return ai;
  }

}
