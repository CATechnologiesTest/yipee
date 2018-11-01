import * as joint from 'jointjs';

import { IconShape } from './icon.shape';
import { CanvasUtility } from '../canvas.utility';
import { EditorService } from '../../editor.service';
import { Ingress } from '../../../models/k8s/Ingress';
import { NameChangeEvent, OverrideChangeEvent } from '../../../models/Events';

export class K8sIngressShape extends IconShape {

  public static TYPE = 'k8s-ingress';

  ingress: Ingress;
  editorService: EditorService;

  constructor(editorService: EditorService, ingress: Ingress, attributes?: any, options?: any) {
    super('./assets/images/ingress.svg', ingress.id, K8sIngressShape.TYPE, attributes, options);
    this.ingress = ingress;
    this.editorService = editorService;
    this.canConnect = false;
    this.canClone = false;

    // get the position from annotations and then update that position when it changes

    this.set('position', this.ingress.ui.canvas.position);
    this.on('change:position', function () {
      this.editorService.dirty = true;
      this.ingress.ui.canvas.position = this.get('position');
    }, this);

    // set the icon text

    this.attr('.title/text', CanvasUtility.getStringForSize(this.ingress.name, IconShape.ICON_LABEL_WIDTH, '12px', CanvasUtility.fontFamily, 'normal'));

    // watch for changes to the name

    ingress.onNameChange.subscribe((event: NameChangeEvent) => {
      this.attr('.title/text', CanvasUtility.getStringForSize(event.newName, IconShape.ICON_LABEL_WIDTH, '12px', CanvasUtility.fontFamily, 'normal'));
    });

  }

}
