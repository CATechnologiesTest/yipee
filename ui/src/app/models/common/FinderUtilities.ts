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

  static findUi(finder: Finder, id: string): Annotation {
    return finder.objects
      .filter((p) => p.type === Annotation.OBJECT_NAME)
      .map((p: Annotation) => p as Annotation)
      .find((p) => p.annotated === id && p.key === 'ui');

  }
  static getUi(finder: Finder, id: string): Annotation {
    let ui = FinderUtilities.findUi(finder, id);
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
  static removeUi(finder: Finder, id: string) {
    const ui = FinderUtilities.findUi(finder, id);
    if (ui) {
      ui.remove();
    }

  }
  static findDescription(finder: Finder, id: string): Annotation {
    return finder.objects
      .filter((p) => p.type === Annotation.OBJECT_NAME)
      .map((p: Annotation) => p as Annotation)
      .find((p) => p.annotated === id && p.key === 'description');

  }
  static getDescription(finder: Finder, id: string): Annotation {
    let description = FinderUtilities.findDescription(finder, id);
    if (description === undefined) {
      description = new Annotation();
      description.annotated = id;
      description.key = 'description';
      description.value = '';
      finder.push(description);
    }
    return description;
  }

  static removeDescription(finder: Finder, id: string) {
    const description = FinderUtilities.findDescription(finder, id);
    if (description) {
      description.remove();
    }

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
