import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';

import { Subject } from 'rxjs/Subject';

import { find } from 'lodash';

import { DownloadService } from '../shared/services/download.service';
import { YipeeFileService } from '../shared/services/yipee-file.service';
import { YipeeFileMetadata } from '../models/YipeeFileMetadata';

import { EditorEventService, InvalidKeysChangeEvent } from './editor-event.service';
import { K8sFile } from '../models/k8s/K8sFile';
import { Container } from '../models/common/Container';
import { ContainerGroup } from '../models/common/ContainerGroup';
import * as K8sService from '../models/k8s/Service';
import * as K8sVolume from '../models/common/Volume';
import { Ingress } from '../models/k8s/Ingress';
import { UnknownKind } from '../models/k8s/UnknownKind';
import { EmptyDirVolume } from '../models/common/EmptyDirVolume';
import { HostPathVolume } from '../models/common/HostPathVolume';
import { NameStringValue } from '../models/common/Generic';


@Injectable()
export class EditorService {

  static UNEXPECTED_RESPONSE = 'Unexpected response from server: ';

  private _dirty: boolean;
  editMode: string;
  readOnly: boolean;
  isWriter: boolean;
  yipeeFileID: string;
  metadata: YipeeFileMetadata;
  k8sFile: K8sFile = new K8sFile();
  fatalText: string[];
  warningText: string[];
  alertText: string[];
  infoText: string[];
  invalidKeys: string[];
  nerdModeType: string;
  showReadmeDialog = new Subject<any>();

  @Output() onContainerAdd = new EventEmitter<Container>();

  /**
     * cached items
     * these are vars that are cached to make things a bit more efficient
     * they are things whose return requires iteration over a potentially
     * infinite number of objects, so we only update them on command
    */
  private _service_map = [];

  constructor(
    private editorEventService: EditorEventService,
    private yipeeFileService: YipeeFileService,
    public downloadService: DownloadService
  ) {
    this._dirty = false;
    this.editMode = 'k8s';
    this.readOnly = false;
    this.isWriter = false;
    this.fatalText = [];
    this.warningText = [];
    this.alertText = [];
    this.infoText = [];
    this.invalidKeys = [];
    this.nerdModeType = undefined;

    /** Editor Event Service Subscribers
     * these live in the constructor, the only lifecycle method for services really
     * this is for things the editor service has to listen to to do any advanced logic
     * between objects in the model. The angular way, not the java way.
     */
    this.editorEventService.onServiceModelOnRefresh.subscribe(() => {
      // a services model has changed so we....
      this.initPodServiceNames();
    });

  }

  downloadCurrentModel(): void {
    this.downloadService.downloadKubernetesFile(true, this.k8sFile.toFlat()).subscribe((successfulDownload) => {
      if (successfulDownload) {
        this.dirty = false;
      } else {
        this.warningText.push(EditorService.UNEXPECTED_RESPONSE + 'failed to download');
      }
    });
  }

  downloadKubernetes(): void {
    this.downloadService.downloadKubernetesFile(true, this.k8sFile.toFlat()).subscribe((successfulDownload) => {
      if (successfulDownload) {
        this.dirty = false;
      } else {
        this.warningText.push(EditorService.UNEXPECTED_RESPONSE + 'failed to download');
      }
    });
  }

  downloadKubernetesArchive(): void {
    this.downloadService.downloadKubernetesArchive(true, this.k8sFile.toFlat()).subscribe((successfulDownload) => {
      if (successfulDownload) {
        this.dirty = false;
      } else {
        this.warningText.push(EditorService.UNEXPECTED_RESPONSE + 'failed to download');
      }
    });
  }

  downloadHelm(): void {
    this.downloadService.downloadHelmArchive(true, this.k8sFile.toFlat()).subscribe((successfulDownload) => {
      if (successfulDownload) {
        this.dirty = false;
      } else {
        this.warningText.push(EditorService.UNEXPECTED_RESPONSE + 'failed to download');
      }
    });
  }

  dumpK8sFile() {
    console.log(this.k8sFile.toFlat());
    console.log(this.k8sFile);
  }

  reportInvalidForm(key: string, value: boolean): void {
    const index = this.invalidKeys.indexOf(key);
    if (value) {
      if (index === -1) {
        this.invalidKeys.push(key);
        this.editorEventService.onInvalidKeysChange.emit(new InvalidKeysChangeEvent(this.invalidKeys));
      }
    } else {
      this.removeInvalidFormKey(key);
    }
  }

  removeInvalidFormKey(key: string): void {
    const index = this.invalidKeys.indexOf(key);
    if (index !== -1) {
      this.invalidKeys.splice(index, 1);
      this.editorEventService.onInvalidKeysChange.emit(new InvalidKeysChangeEvent(this.invalidKeys));
    }
  }

  hasError(): boolean {
    return (this.invalidKeys.length !== 0);
  }

  loadYipeeFile(yipeeFile: YipeeFileMetadata): Observable<boolean> {
    this.fatalText.length = 0;
    this.alertText.length = 0;
    this.infoText.length = 0;
    this.invalidKeys.length = 0;
    this.metadata = yipeeFile;
    this.k8sFile = yipeeFile.flatFile;
    return of(true);
  }

  newK8sEmptyDirVolume(volume?: EmptyDirVolume): EmptyDirVolume {
    if (volume === undefined) {
      volume = new EmptyDirVolume();
    }
    this.k8sFile.push(volume);
    this.dirty = true;
    volume.ui.canvas.position = { x: 100, y: 100 };
    return volume;
  }

  newK8sHostPathVolume(volume?: HostPathVolume): HostPathVolume {
    if (volume === undefined) {
      volume = new HostPathVolume();
    }
    this.k8sFile.push(volume);
    this.dirty = true;
    volume.ui.canvas.position = { x: 100, y: 100 };
    return volume;
  }

  newK8sVolume(volume?: K8sVolume.Volume): K8sVolume.Volume {
    if (volume === undefined) {
      volume = new K8sVolume.Volume();
    }
    this.k8sFile.push(volume);
    this.dirty = true;
    volume.ui.canvas.position = { x: 100, y: 100 };
    return volume;
  }

  newK8sService(service?: K8sService.Service): K8sService.Service {
    if (service === undefined) {
      service = new K8sService.Service();
    }
    this.k8sFile.push(service);
    this.dirty = true;
    service.ui.canvas.position = { x: 100, y: 100 };
    return service;
  }

  newK8sIngress(ingress?: Ingress): Ingress {
    if (ingress === undefined) {
      ingress = new Ingress();
    }
    this.k8sFile.push(ingress);
    this.dirty = true;
    ingress.ui.canvas.position = { x: 100, y: 100 };
    return ingress;
  }

  newK8sUnknownKind(unknownKind?: UnknownKind): UnknownKind {
    unknownKind = new UnknownKind();
    this.k8sFile.push(unknownKind);
    this.dirty = true;
    unknownKind.ui.canvas.position = { x: 100, y: 100 };
    return unknownKind;
  }

  addContainer(container: Container): void {
    this.k8sFile.push(container);
    this.dirty = true;
    container.ui.canvas.position = { x: 100, y: 100 };
    this.onContainerAdd.emit(container);
  }

  newContainer(container?: Container): Container {
    if (container === undefined) {
      container = new Container();
    }
    this.k8sFile.push(container);
    this.dirty = true;
    container.ui.canvas.position = { x: 100, y: 100 };
    return container;
  }

  addContainerToContainerGroup(container: Container, containerGroup: ContainerGroup): void {
    containerGroup.addContainer(container);
    this.dirty = true;
  }

  removeContainerFromContainerGroup(container: Container, containerGroup: ContainerGroup): void {
    containerGroup.removeContainer(container);
    this.dirty = true;
  }

  cloneContainer(container: Container): Container {
    return this.newContainer();
  }

  newContainerGroup(containerGroup?: ContainerGroup): ContainerGroup {
    if (containerGroup === undefined) {
      containerGroup = new ContainerGroup();
      this.k8sFile.push(containerGroup);
    }
    this.dirty = true;
    containerGroup.ui.canvas.position = { x: 100, y: 100 };
    containerGroup.source = 'k8s';
    this.reportInvalidForm(containerGroup.id, (containerGroup.container_count === 0));
    return containerGroup;
  }

  cloneContainerGroup(containerGroup: ContainerGroup): ContainerGroup {
    return this.newContainerGroup();
  }

  getUniqueName(base: string, source: any[]): string {
    if (source === undefined) {
      return base + '-0';
    }
    const existing = source.map(a => a.name);

    // if base is already already unique, return it

    if (existing.indexOf(base) === -1) {
      return base;
    }

    let suffix = 0;
    let name = base + '-' + suffix;
    let unique = false;
    while (!unique) {
      if (existing.indexOf(name) !== -1) {
        suffix++;
        name = base + '-' + suffix;
        continue;
      }
      unique = true;
    }
    return name;
  }

  // go through the container group service names and clear them if the corresponding service no longer exists
  private initPodServiceNames(): void {
    this.k8sFile.containerGroups.forEach((containerGroup: ContainerGroup) => {
      const serviceNameExistsInServiceMap = find(this.returnServiceMapByContainerGroupId(containerGroup.id), function (arrayValue) { return arrayValue.name === containerGroup.deployment_spec.service_name; });

      if (!serviceNameExistsInServiceMap) {
        containerGroup.deployment_spec.service_name = '-- Select a service --';
      }

    });
  }

  /* SERVICE_MAP */
  returnServiceMapByContainerGroupId(containerGroupId) {
    const serviceMap = [];
    this.k8sFile.services.forEach((service) => {
      const matchesContainerGroup = find(service.container_groups, { id: containerGroupId });

      if (matchesContainerGroup) {
        serviceMap.push(new NameStringValue(service.name, service.id));
      }
    });

    return serviceMap;
  }

  get dirty(): boolean {
    return this._dirty;
  }

  set dirty(value: boolean) {
    this._dirty = value;
  }

}
