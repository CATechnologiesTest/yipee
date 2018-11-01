import * as joint from 'jointjs';

import { IconShape } from './icon.shape';
import { CanvasUtility } from '../canvas.utility';
import { EditorService } from '../../editor.service';
import { Service } from '../../../models/k8s/Service';
import { NameChangeEvent, OverrideChangeEvent } from '../../../models/Events';

export class K8sServiceShape extends IconShape {

  public static TYPE = 'k8s-service';

  service: Service;
  editorService: EditorService;

  constructor(editorService: EditorService, service: Service, attributes?: any, options?: any) {
    super('./assets/images/service-k8s.svg', service.id, K8sServiceShape.TYPE, attributes, options, true);
    this.service = service;
    this.editorService = editorService;
    this.canConnect = true;
    this.canClone = false;

    // get the position from annotations and then update that position when it changes

    this.set('position', this.service.ui.canvas.position);
    this.on('change:position', function () {
      this.editorService.dirty = true;
      this.service.ui.canvas.position = this.get('position');
    }, this);

    // set the icon text

    this.attr('.title/text', CanvasUtility.getStringForSize(this.service.name, IconShape.ICON_LABEL_WIDTH, '12px', CanvasUtility.fontFamily, 'normal'));

    // watch for changes to the name

    service.onNameChange.subscribe((event: NameChangeEvent) => {
      this.attr('.title/text', CanvasUtility.getStringForSize(event.newName, IconShape.ICON_LABEL_WIDTH, '12px', CanvasUtility.fontFamily, 'normal'));
    });

  }

}
