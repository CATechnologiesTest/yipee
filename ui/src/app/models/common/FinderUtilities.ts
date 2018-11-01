import { Finder } from '../parse/Finder';
import { VolumeRef } from './VolumeRef';
import { Volume } from './Volume';
import { Annotation } from './Annotation';
import { Namespace } from '../k8s/Namespace';
import { EmptyDirVolume } from './EmptyDirVolume';
import { HostPathVolume } from './HostPathVolume';

export class FinderUtilities {

  static getVolumeRef(finder: Finder, container: string): VolumeRef[] {
    return finder.objects
      .filter((p) => p.type === VolumeRef.OBJECT_NAME)
      .map((p: VolumeRef) => p as VolumeRef)
      .filter((p: VolumeRef) => p.base_volume !== undefined)
      .filter((p: VolumeRef) => p.base_volume.type === Volume.OBJECT_NAME)
      .filter((p) => p.container === container);
  }

  static getEmptyDirRef(finder: Finder, container: string): VolumeRef[] {
    return finder.objects
      .filter((p) => p.type === VolumeRef.OBJECT_NAME)
      .map((p: VolumeRef) => p as VolumeRef)
      .filter((p: VolumeRef) => p.base_volume !== undefined)
      .filter((p: VolumeRef) => p.base_volume.type === EmptyDirVolume.OBJECT_NAME)
      .filter((p) => p.container === container);
  }

  static getHostPathRef(finder: Finder, container: string): VolumeRef[] {
    return finder.objects
      .filter((p) => p.type === VolumeRef.OBJECT_NAME)
      .map((p: VolumeRef) => p as VolumeRef)
      .filter((p: VolumeRef) => p.base_volume !== undefined)
      .filter((p: VolumeRef) => p.base_volume.type === HostPathVolume.OBJECT_NAME)
      .filter((p) => p.container === container);
  }

  static getUi(finder: Finder, id: string): Annotation {
    let ui = finder.objects
      .filter((p) => p.type === Annotation.OBJECT_NAME)
      .map((p: Annotation) => p as Annotation)
      .find((p) => p.annotated === id && p.key === 'ui');
    if (ui === undefined) {
      ui = new Annotation();
      ui.annotated = id;
      ui.key = 'ui';
      ui.value = {
        'canvas': {
          'position': {
            'x': 0,
            'y': 0
          }
        }
      };
      finder.push(ui);
    }
    return ui;
  }

  static getDescription(finder: Finder, id: string): Annotation {
    let description = finder.objects
      .filter((p) => p.type === Annotation.OBJECT_NAME)
      .map((p: Annotation) => p as Annotation)
      .find((p) => p.annotated === id && p.key === 'description');
    if (description === undefined) {
      description = new Annotation();
      description.annotated = id;
      description.key = 'description';
      description.value = '';
      finder.push(description);
    }
    return description;
  }

  static getNamespace(finder: Finder, id: string): Namespace {
    let namespace = finder.objects
      .find((p) => p.type === Namespace.OBJECT_NAME) as Namespace;
    if (namespace === undefined) {
      namespace = new Namespace();
      namespace.name = '';
      finder.push(namespace);
    }
    return namespace;
  }
}
