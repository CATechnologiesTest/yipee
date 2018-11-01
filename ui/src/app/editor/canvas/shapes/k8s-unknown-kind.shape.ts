import * as joint from 'jointjs';

import { IconShape } from './icon.shape';
import { CanvasUtility } from '../canvas.utility';
import { EditorService } from '../../editor.service';
import { UnknownKind } from '../../../models/k8s/UnknownKind';
import { NameChangeEvent, OverrideChangeEvent } from '../../../models/Events';

export class K8sUnknownKindShape extends IconShape {

  public static TYPE = 'k8s-unknown-kind-shape';

  unknownKind: UnknownKind;
  editorService: EditorService;

  constructor(editorService: EditorService, unknownKind: UnknownKind, attributes?: any, options?: any) {
    super('./assets/images/plugin.svg', unknownKind.id, K8sUnknownKindShape.TYPE, attributes, options);
    this.unknownKind = unknownKind;
    this.editorService = editorService;
    this.canConnect = false;
    this.canClone = false;

    // get the position from annotations and then update that position when it changes
    this.set('position', this.unknownKind.ui.canvas.position);
    this.on('change:position', function () {
      this.editorService.dirty = true;
      this.unknownKind.ui.canvas.position = this.get('position');
    }, this);

    // set the icon text
    this.attr('.title/text', CanvasUtility.getStringForSize(unknownKind.name, IconShape.ICON_LABEL_WIDTH, '12px', CanvasUtility.fontFamily, 'normal'));

    // watch for changes to the name
    unknownKind.onNameChange.subscribe((event: NameChangeEvent) => {
      this.attr('.title/text', CanvasUtility.getStringForSize(event.newName, IconShape.ICON_LABEL_WIDTH, '12px', CanvasUtility.fontFamily, 'normal'));
    });

  }

}
