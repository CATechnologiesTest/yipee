import * as joint from 'jointjs';
import { IconShape } from './icon.shape';
import { CanvasUtility } from '../canvas.utility';
import { EditorService } from '../../editor.service';
import { NameChangeEvent, OverrideChangeEvent } from '../../../models/Events';
import { Container } from '../../../models/common/Container';

export class ContainerShape extends IconShape {

  public static TYPE = 'container';

  container: Container;
  editorService: EditorService;

  constructor(editorService: EditorService, container: Container, attributes?: any, options?: any) {
    super('./assets/images/container.svg', container.id, ContainerShape.TYPE, attributes, options);
    this.container = container;
    this.editorService = editorService;
    this.canClone = false;

    // update the icon

    this.updateIcon();

    // get the position from annotations and then update that position when it changes

    this.set('position', this.container.ui.canvas.position);
    this.on('change:position', function () {
      this.editorService.dirty = true;
      this.container.ui.canvas.position = this.get('position');
    }, this);

    // set the icon text

    this.attr('.title/text', CanvasUtility.getStringForSize(this.container.name, IconShape.ICON_LABEL_WIDTH, '12px', CanvasUtility.fontFamily, 'normal'));

    // watch for changes to the name

    container.onNameChange.subscribe((event: NameChangeEvent) => {
      this.attr('.title/text', CanvasUtility.getStringForSize(event.newName, IconShape.ICON_LABEL_WIDTH, '12px', CanvasUtility.fontFamily, 'normal'));
    });

  }

  updateIcon(): void {
    if (this.container.isInitContainer()) {
      this.changeIcon('./assets/images/init-container.svg');
    }
  }

  isInitContainer(): boolean {
    return this.container.isInitContainer();
  }

  comparePosition(shape: ContainerShape): number {
    return this.container.comparePosition(shape.container);
  }

  clone(): ContainerShape {
    const container = this.editorService.cloneContainer(this.container);
    return new ContainerShape(this.editorService, container);
  }

}
