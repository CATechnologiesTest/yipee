import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { Container } from '../models/common/Container';
import { Service as k8sService } from '../models/k8s/Service';
import { ContainerGroup } from '../models/common/ContainerGroup';

export enum EventSource {
  Sidepanel,
  Canvas
}

export class InvalidKeysChangeEvent {
  invalidKeys: string[];

  constructor(invalidKeys: string[]) {
    this.invalidKeys = invalidKeys;
  }
}

export class SelectionChangedEvent {
  selectDefault: boolean;
  selectedKey: string;
  source: EventSource;

  constructor(selectDefault: boolean, selectedKey: string, source: EventSource) {
    this.selectDefault = selectDefault;
    this.selectedKey = selectedKey;
    this.source = source;
  }
}

export class ContainerVolumeChangedEvent {
  container: Container;
  source: EventSource;

  constructor(container: Container, source: EventSource) {
    this.container = container;
    this.source = source;
  }
}

export class ServiceSecretChangedEvent {
  bool: boolean;

  constructor(bool) {
    this.bool = bool;
  }
}

@Injectable()
export class EditorEventService {

  onGenericTrack: EventEmitter<string> = new EventEmitter();
  onContainerVolumeChange: EventEmitter<ContainerVolumeChangedEvent> = new EventEmitter();
  onContainerEmptyDirChange: EventEmitter<ContainerVolumeChangedEvent> = new EventEmitter();
  onContainerHostPathChange: EventEmitter<ContainerVolumeChangedEvent> = new EventEmitter();
  onServiceSecretChange: EventEmitter<ServiceSecretChangedEvent> = new EventEmitter();
  onSelectionChange: EventEmitter<SelectionChangedEvent> = new EventEmitter();
  onInvalidKeysChange: EventEmitter<InvalidKeysChangeEvent> = new EventEmitter();
  onCompatSecretChange: EventEmitter<boolean> = new EventEmitter();
  onLogoChange: EventEmitter<boolean> = new EventEmitter();
  onAppSecretChange: EventEmitter<boolean> = new EventEmitter();

  public onServiceSelectorChange = new Subject<k8sService>();
  public onPodLabelsChanged = new Subject<ContainerGroup>();

  private selectedKey: string;
  private defaultSelected = false;

  /* On Refreshes */
  public onServiceModelOnRefresh = new Subject<k8sService>();

  constructor() {
  }

  getSelectedKey(): string {
    return this.selectedKey;
  }

  isDefaultSelected(): boolean {
    return this.defaultSelected;
  }

  selectDefault(): void {
    this.selectedKey = '';
    this.defaultSelected = true;
    this.onSelectionChange.emit(new SelectionChangedEvent(true, this.selectedKey, EventSource.Canvas));
  }

  canvasSelectionChanged(key: string): void {
    this.selectedKey = key;
    this.defaultSelected = false;
    this.onSelectionChange.emit(new SelectionChangedEvent(false, this.selectedKey, EventSource.Canvas));
  }

}
