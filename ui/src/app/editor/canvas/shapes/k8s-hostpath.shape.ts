import * as joint from 'jointjs';

import { IconShape } from './icon.shape';
import { CanvasUtility } from '../canvas.utility';
import { EditorService } from '../../editor.service';
import { HostPathVolume } from '../../../models/common/HostPathVolume';
import { NameChangeEvent } from '../../../models/Events';

export class K8sHostPathShape extends IconShape {

  public static TYPE = 'k8s-hostpath';

  volume: HostPathVolume;
  editorService: EditorService;

  constructor(editorService: EditorService, volume: HostPathVolume, attributes?: any, options?: any) {
    super('./assets/images/host-path.svg', volume.id, K8sHostPathShape.TYPE, attributes, options, true);
    this.volume = volume;
    this.editorService = editorService;
    this.canClone = false;

    // get the position from annotations and then update that position when it changes

    this.set('position', this.volume.ui.canvas.position);
    this.on('change:position', function() {
      this.editorService.dirty = true;
      this.volume.ui.canvas.position = this.get('position');
    }, this);

    // set the icon text

    this.attr('.title/text', CanvasUtility.getStringForSize(this.volume.name, IconShape.ICON_LABEL_WIDTH, '12px', CanvasUtility.fontFamily, 'normal'));

    // watch for changes to the name

    volume.onNameChange.subscribe((event: NameChangeEvent) => {
      this.attr('.title/text', CanvasUtility.getStringForSize(event.newName, IconShape.ICON_LABEL_WIDTH, '12px', CanvasUtility.fontFamily, 'normal'));
    });

  }

}
