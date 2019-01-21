import * as joint from 'jointjs';
import { BaseShape } from './base.shape';
import { CanvasUtility } from '../canvas.utility';
import { EditorService } from '../../editor.service';
import { ContainerGroup } from '../../../models/common/ContainerGroup';
import { ContainerShape } from './container.shape';
import { NameChangeEvent } from '../../../models/Events';

class LayoutInformation {
  x: number;
  y: number;
  width: number;
  height: number;
  count: number;
  constructor() { }
}

export class ContainerGroupShape extends BaseShape {

  public static POD_DEFAULT_WIDTH = 150;
  public static POD_DEFAULT_HEIGHT = 150;
  public static MARGIN = 25;
  public static PADDING = 25;
  public static TYPE = 'cgroup';
  public static TYPE_CRONJOB = 'CronJob';

  cgroup: ContainerGroup;
  editorService: EditorService;

  constructor(editorService: EditorService, cgroup: ContainerGroup, attributes?: any, options?: any) {
    super(cgroup.id, ContainerGroupShape.TYPE, attributes, options);
    this.cgroup = cgroup;
    this.editorService = editorService;
    this.set('markup', this.markup);
    this.canConnect = false;
    this.canClone = false;
    this.setStatus(this.cgroup.deployment_status.status);
    this.setRestartCount(this.cgroup.deployment_status.restart_count);
    this.setRequestActiveCounts(this.cgroup.deployment_status.requested_replicas, this.cgroup.deployment_status.active_replicas);


    // get the position from annotations and then update that position when it changes

    this.set('position', this.cgroup.ui.canvas.position);
    this.on('change:position', function () {
      this.editorService.dirty = true;
      this.cgroup.ui.canvas.position = this.get('position');
    }, this);

    // layout the shape if the embeds change

    this.on('change:embeds', function () {
      this.layout();
    }, this);

    // set the pod text and position

    this.attr('.title/text', CanvasUtility.getStringForSize(this.cgroup.name, ContainerGroupShape.POD_DEFAULT_WIDTH, '12px', CanvasUtility.fontFamily, 'normal'));
    this.positionTitle();
    this.setBackground();
    this.setType();

    // watch for changes to the name

    cgroup.onNameChange.subscribe((event: NameChangeEvent) => {
      this.attr('.title/text', CanvasUtility.getStringForSize(event.newName, this.size().width, '12px', CanvasUtility.fontFamily, 'normal'));
    });

    cgroup.onRefresh.subscribe((event: boolean) => {
      this.layout();
    });

    cgroup.deployment_status.onAttributeChange.subscribe((attribute: string) => {
      switch (attribute) {
        case 'status':
          this.setStatus(this.cgroup.deployment_status.status);
          break;
        case 'restart_count':
          this.setRestartCount(this.cgroup.deployment_status.restart_count);
          break;
        case 'requested_replicas':
        case 'active_replicas':
          this.setRequestActiveCounts(this.cgroup.deployment_status.requested_replicas, this.cgroup.deployment_status.active_replicas);
          break;
      }
    });

  }

  set hasError(value: boolean) {
    this._hasError = value;
    if (this._hasError) {
      this.attr('.error/display', 'inline');
    } else {
      this.attr('.error/display', 'none');
    }
  }

  setStatus(value: string): void {
    this.attr('.green/display', (value === 'green' ? 'inline' : 'none'));
    this.attr('.yellow/display', (value === 'yellow' ? 'inline' : 'none'));
    this.attr('.red/display', (value === 'red' ? 'inline' : 'none'));
  }

  setRestartCount(value: number): void {
    this.attr('.restart/text', CanvasUtility.getStringForSize(value + '', 28, '10px', CanvasUtility.fontFamily, 'normal'));
  }

  setRequestActiveCounts(request: number, active: number): void {
    if (active === 0) {
      this.attr('.active-badge/fill', 'red');
    } else if (active < request) {
      this.attr('.active-badge/fill', 'yellow');
    } else if (active >= request) {
      this.attr('.active-badge/fill', 'green');
    } else {
      this.attr('.active-badge/fill', 'white');
    }
    this.attr('.active/text', CanvasUtility.getStringForSize(active + '/' + request, 28, '10px', CanvasUtility.fontFamily, 'normal'));
  }

  get markup(): string {
    return `<g>
    <rect class="background" rx="10" ry="10"/>
    <rect class="border" rx="10" ry="10"/>
    <image class="deleteCanvasObject" height="20" width="20" x="4" y="4" xlink:href="./assets/images/times-circle-line.svg"/>
    
    <text class="type" x="28" y="18" alignment-baseline="top" text-anchor="left"/>

    <rect class="restart-badge" rx="5" ry="5" x="45" y="5" width="30" height="16"/>
    <text class="restart" x="60" y="17" alignment-baseline="central" text-anchor="middle"/>

    <rect class="active-badge" rx="5" ry="5" x="84" y="5" width="45" height="16"/>
    <text class="active" x="106" y="17" alignment-baseline="central" text-anchor="middle"/>

    <image class="error" height="24" width="24" x="76" y="2" xlink:href="./assets/images/exclamation-circle-line.svg"/>
    
    <text class="title" x="50" y="92" alignment-baseline="central" text-anchor="middle"/>
    
    
    </g>`;
  }

  willAcceptChildType(type: string): boolean {
    switch (type) {
      case ContainerShape.TYPE:
        return true;
      default:
        return false;
    }
  }

  layout(): void {
    if (this.getEmbeddedCells().length === 0) {
      this.resize(ContainerGroupShape.POD_DEFAULT_WIDTH, ContainerGroupShape.POD_DEFAULT_HEIGHT);
    } else {
      const li = new LayoutInformation();
      li.width = 0;
      li.height = 0;
      li.x = ContainerGroupShape.MARGIN;
      li.y = ContainerGroupShape.MARGIN;
      li.count = 0;
      this.layoutChildren(this.getInitContainerChildren(), li);
      if (this.getContainerChildren().length > 0) {
        li.x = ContainerGroupShape.MARGIN;
        li.y = li.height + ContainerGroupShape.MARGIN;
        li.count = 0;
        this.layoutChildren(this.getContainerChildren(), li);
      }
      li.height += ContainerGroupShape.MARGIN;
      this.resize(li.width, li.height);
    }
    this.positionTitle();
    this.positionError();
  }

  layoutChildren(children: joint.dia.Cell[], li: LayoutInformation): void {
    for (const child of children) {
      const element = child as joint.dia.Element;
      const size = element.size();
      if (li.count > 2) {
        li.x = ContainerGroupShape.MARGIN;
        li.y += size.height + ContainerGroupShape.MARGIN;
        li.count = 0;
      }
      element.position(li.x, li.y, { parentRelative: true });
      li.x += size.width;
      li.x += ContainerGroupShape.PADDING;
      li.width = Math.max(li.width, li.x);
      li.height = Math.max(li.height, li.y + size.height);
      li.count++;
    }
    if (li.count === 0) {
      li.y -= ContainerGroupShape.MARGIN;
    }
  }

  getContainerChildren(): joint.dia.Cell[] {
    return this.getEmbeddedCells()
      .filter((c) => c.attributes.type === ContainerShape.TYPE)
      .map((c) => c as ContainerShape)
      .filter((c) => !c.isInitContainer());
  }

  getInitContainerChildren(): joint.dia.Cell[] {
    return this.getEmbeddedCells()
      .filter((c) => c.attributes.type === ContainerShape.TYPE)
      .map((c) => c as ContainerShape)
      .filter((c) => c.isInitContainer())
      .sort((a, b) => a.comparePosition(b));
  }

  setBackground(): void {
    switch (this.cgroup.controller_type) {
      case 'Deployment':
        this.attr('.background/fill', '#058ed3');
        break;
      case 'StatefulSet':
        this.attr('.background/fill', '#7db5d6');
        break;
      case 'DaemonSet':
        this.attr('.background/fill', '#ffffff');
        break;
      case ContainerGroupShape.TYPE_CRONJOB:
        this.attr('.background/fill', '#D3D3D3');
        break;
    }
  }

  setType(): void {
    switch (this.cgroup.controller_type) {
      case 'Deployment':
        this.attr('.type/text', 'D');
        break;
      case 'StatefulSet':
        this.attr('.type/text', 'SS');
        break;
      case 'DaemonSet':
        this.attr('.type/text', 'DS');
        break;
      case ContainerGroupShape.TYPE_CRONJOB:
        this.attr('.type/text', 'CJ');
        break;
    }
  }

  positionTitle(): void {
    const size = this.size();
    this.attr('.title/x', size.width / 2);
    this.attr('.title/y', size.height - 6);
  }

  positionError(): void {
    const size = this.size();
    this.attr('.error/x', size.width - 26);
  }

  defaults(): Backbone.ObjectHash {
    return joint.util.deepSupplement({
      size: {
        width: ContainerGroupShape.POD_DEFAULT_WIDTH,
        height: ContainerGroupShape.POD_DEFAULT_HEIGHT
      },
      attrs: {
        '.background': {
          'ref-width': '100%',
          'ref-height': '100%',
          fill: '#FFFFFF'
        },
        '.error': {
          display: 'none'
        },
        '.deleteCanvasObject': {
          event: 'element:deleteCanvasObject:pointerdown'
        },
        '.border': {
          'ref-width': '100%',
          'ref-height': '100%',
          fill: 'none',
          stroke: '#007cbb',
          'stroke-width': 1
        },
        '.title': {
          'font-size': 12,
          'font-weight': 'normal',
          stroke: '#000000',
          fill: '#000000'
        },
        '.type': {
          'font-size': 12,
          'font-weight': 'normal',
          stroke: '#000000',
          fill: '#000000'
        }
      }
    }, joint.shapes.basic.Generic.prototype.defaults);
  }
}
