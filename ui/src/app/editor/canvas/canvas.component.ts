import { Component, OnInit, OnDestroy } from '@angular/core';
declare var $: JQueryStatic;
import * as joint from 'jointjs';

import * as K8sService from '../../models/k8s/Service';
import * as K8sVolume from '../../models/common/Volume';
import { Ingress } from '../../models/k8s/Ingress';
import { Container } from '../../models/common/Container';
import { ContainerGroup } from '../../models/common/ContainerGroup';

import { ContainerGroupShape, ContainerShape, BaseShape, DefaultLinkShape, IngressLinkShape, VolumeLinkShape, IconShape, LinkShape, K8sVolumeShape, K8sServiceShape } from './shapes';
import { EditorEventService, EventSource, ContainerVolumeChangedEvent } from '../editor-event.service';
import { EditorService } from '../editor.service';
import { EmptyDirVolume } from '../../models/common/EmptyDirVolume';
import { HostPathVolume } from '../../models/common/HostPathVolume';
import { K8sIngressShape } from './shapes/k8s-ingress.shape';
import { K8sEmptyDirShape } from './shapes/k8s-emptydir.shape';
import { K8sHostPathShape } from './shapes/k8s-hostpath.shape';
import { K8sServiceLinkShape } from './shapes/k8s-service-link.shape';
import { K8sUnknownKindShape } from './shapes/k8s-unknown-kind.shape';
import { environment } from '../../../environments/environment';

const properties = {
  paper: {
    minWidth: 3000,
    minHeight: 2000
  }
};

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent extends joint.mvc.View<undefined> implements OnInit, OnDestroy {

  graph: joint.dia.Graph;
  paper: joint.dia.Paper;
  selection = { collection: new Set([ ]) };
  haloAction: false;
  linkBeingCreated: LinkShape;

  showNewK8sContainerDialog: boolean;
  showNewK8sInitContainerDialog: boolean;
  showNewK8sServiceDialog: boolean;
  showNewK8sVolumeDialog: boolean;
  showNewK8sVolumeTemplateDialog: boolean;
  showNewK8sEmptyDirDialog: boolean;
  showNewK8sHostPathDialog: boolean;
  showNewK8sStatefulSetDialog: boolean;
  showNewK8sDeploymentDialog: boolean;
  showNewK8sDaemonSetDialog: boolean;
  showNewK8sCRONJobDialog: boolean;
  showNewK8sIngressDialog: boolean;

  showNewServiceDialog: boolean;
  showNewVolumeDialog: boolean;
  showNewNetworkDialog: boolean;
  showConfirmDeleteDialog: boolean;

  confirmDeleteCellView: joint.dia.CellView;
  confirmDeleteObjectType: string;
  confirmDeleteObjectName: string;

  isProduction = environment.production;

  constructor(
    public editorService: EditorService,
    public editorEventService: EditorEventService
  ) {
    super();
    this.showNewNetworkDialog = false;
    this.showNewServiceDialog = false;
    this.showNewVolumeDialog = false;
    this.showConfirmDeleteDialog = false;
    this.editorService.onContainerAdd.subscribe((container) => {
      this.addContainer(container);
    });

    // on invalid key change, get the graph elements extending BaseShape and set their error flag if erros exist
    this.editorEventService.onInvalidKeysChange.subscribe((invalidKeys) => {
      const shapes = this.graph.getElements().filter(graphElement => graphElement instanceof BaseShape) as BaseShape[];
      for (const shape of shapes) {
        shape.hasError = this.editorService.invalidKeys.includes(shape.key);
      }
    });
  }

  /* ********************** */
  /* INITIALIZATION METHODS */
  /* ********************** */
  createK8sObjects(): void {

    const shapes: any = [];
    const containerMap: { [key: string]: ContainerShape; } = {};
    const groupMap: { [key: string]: ContainerGroupShape; } = {};
    const ingressMap: { [key: string]: K8sIngressShape; } = {};
    const unknownKindMap: { [key: string]: K8sUnknownKindShape; } = {};
    const volumeMap: { [key: string]: any; } = {};
    const serviceMap: { [key: string]: K8sServiceShape; } = {};

    const doLayout = !this.hasPositionData();

    // for each ingress item, create the k8s shape and add it to shapes array and ingressMap
    for (const ingress of this.editorService.k8sFile.ingress) {
      const shape = new K8sIngressShape(this.editorService, ingress);
      shapes.push(shape);
      ingressMap[ingress.id] = shape;
    }

    // for each unknownKind item, create the k8s shape and add it to the shapes array and unknownKindMap
    for (const unknownKind of this.editorService.k8sFile.unknownKinds) {
      const shape = new K8sUnknownKindShape(this.editorService, unknownKind);
      shapes.push(shape);
      unknownKindMap[unknownKind.id] = shape;
    }

    // for each container-group item, create the k8s shape and add it to the shapes array and groupMap
    for (const group of this.editorService.k8sFile.containerGroups) {
      const shape = new ContainerGroupShape(this.editorService, group);
      shapes.push(shape);
      groupMap[group.id] = shape;
    }

    // containers (including init containers)
    for (const container of this.editorService.k8sFile.containers) {
      const shape = new ContainerShape(this.editorService, container);
      shapes.push(shape);
      containerMap[container.id] = shape;
      if (container.cgroup !== undefined && groupMap[container.cgroup] !== undefined) {
        groupMap[container.cgroup].embed(shape);
      }
    }

    // for each volume item, create the k8s shape and add it to the shapes array and volumeMap
    for (const volume of this.editorService.k8sFile.volumes) {
      const shape = new K8sVolumeShape(this.editorService, volume);
      shapes.push(shape);
      volumeMap[volume.id] = shape;
    }

    // for each empty_dir item, create the k8s shape and add it to the shapes array and volumeMap
    for (const empty_dir of this.editorService.k8sFile.empty_dirs) {
      const shape = new K8sEmptyDirShape(this.editorService, empty_dir);
      shapes.push(shape);
      volumeMap[empty_dir.id] = shape;
    }

    // for each host_path item, create the k8s shape and add it to the shapes array and volumeMap
    for (const host_path of this.editorService.k8sFile.host_paths) {
      const shape = new K8sHostPathShape(this.editorService, host_path);
      shapes.push(shape);
      volumeMap[host_path.id] = shape;
    }

    // for each service item, create the k8s shape and add it to the shapes array and serviceMap
    for (const service of this.editorService.k8sFile.services) {
      const shape = new K8sServiceShape(this.editorService, service);
      shapes.push(shape);
      serviceMap[service.id] = shape;
    }

    // iterate through containers and volumes to create links between the two, push links into shapes array
    for (const container of this.editorService.k8sFile.containers) {
      // for volumes referred to via volume entry
      for (const ref of container.volume_ref) {
        if (volumeMap[ref.volume] !== undefined) {
          const link = new VolumeLinkShape(
            {
              source: { id: containerMap[container.id].id },
              target: { id: volumeMap[ref.volume].id }
            });
          shapes.push(link);
        }
      }
      // for volumes referred to via empty directory entry
      for (const ref of container.empty_dir_ref) {
        if (volumeMap[ref.volume] !== undefined) {
          const link = new VolumeLinkShape(
            {
              source: { id: containerMap[container.id].id },
              target: { id: volumeMap[ref.volume].id }
            });
          shapes.push(link);
        }
      }
      // for volumes referred to via host path entry
      for (const ref of container.host_path_ref) {
        if (volumeMap[ref.volume] !== undefined) {
          const link = new VolumeLinkShape(
            {
              source: { id: containerMap[container.id].id },
              target: { id: volumeMap[ref.volume].id }
            });
          shapes.push(link);
        }
      }
    }

    // add all of the shapes from the shapes array to the canvas
    this.graph.addCells(shapes, null);

    // update the container group links
    this.updateServiceContainerGroupLinks();

    // if labels change, update the container group links again
    this.editorEventService.onPodLabelsChanged.subscribe((cgroup: ContainerGroup) => {
      this.updateServiceContainerGroupLinks();
    });

    // if selectors change, update the container group links again
    this.editorEventService.onServiceSelectorChange.subscribe((service: K8sService.Service) => {
      this.updateServiceContainerGroupLinks();
    });

    // bring all graph elements to front
    const elementShapes = shapes.filter((shape) => shape.isElement() === true);
    for (const element of elementShapes) {
      element.toFront();
    }

    // layout entire graph, or layour container groups
    if (doLayout) {
      this.layoutGraph();
    } else {
      this.layoutContainerGroups();
      this.fitPaperToContent();
    }
  }
  /* ************************** */
  /* END INITIALIZATION METHODS */
  /* ************************** */

  /* *************** */
  /* CANVAS HANDLERS */
  /* *************** */
  initializeCanvasHandlers(): void {
    // this.selection = new joint.ui.Selection({
    //   paper: this.paper,
    //   handles: SelectionConfiguration.getConfiguration().handles
    // });

    // initiate selecting when the user grabs the blank area of the paper while the Shift key is pressed.
    // otherwise, initiate paper pan.
    this.paper.on('blank:pointerdown', function (evt, x, y) {
      this.unhighlightAll();
      this.editorEventService.selectDefault();
    }, this);


    // this.selection.on('selection-box:pointerdown', function (cellView: joint.dia.CellView, evt) {

    //   const cell = cellView.model as BaseShape;

    //   // unselect an element if the CTRL/Meta key is pressed while a selected element is clicked.

    //   if (this.keyboard.isActive('ctrl meta', evt)) {
    //     this.selection.collection.remove(cell);
    //   }

    // }, this);

    // reparent on pointer up events

    // this.selection.on('selection-box:pointerup', function (cellView: joint.dia.CellView, evt, x, y) {
    //   if (cellView instanceof joint.dia.LinkView) {
    //     return;
    //   }
    //   this.stopReparent(x, y);
    // }, this);

    this.paper.on('cell:pointerup', function (cellView: joint.dia.CellView, evt, x, y) {
      if (cellView instanceof joint.dia.LinkView) {
        return;
      }
      this.stopReparent(x, y);
    }, this);

    // validate on pointer move events

    // this.selection.on('selection-box:pointermove', function (cellView: joint.dia.CellView, evt, x, y) {
    //   if (cellView instanceof joint.dia.LinkView) {
    //     return;
    //   }
    //   const cell = cellView.model as BaseShape;
    //   this.validateElementDrop(cell, x, y);
    // }, this);

    this.paper.on('cell:pointermove', function (cellView: joint.dia.CellView, evt, x, y) {
      if (cellView instanceof joint.dia.LinkView) {
        return;
      }
      const cell = cellView.model as BaseShape;
      this.validateElementDrop(cell, x, y);
    }, this);

    // select on pointer down

    this.paper.on('element:pointerdown', function (cellView: joint.dia.CellView, evt, x, y) {
      const cell = cellView.model as BaseShape;
      if (this.linkBeingCreated &&
        this.linkBeingCreated.canLinkTo(cell)) {
        this.linkBeingCreated.set('target', { id: cell.id });
        this.linkCreated(this.linkBeingCreated);
        delete this.linkBeingCreated;
        this.linkBeingCreated = null;
        this.linkTargetUnhighlight(cellView);
      }
      // this.handleHaloRemoveElement(cellView);
      // select an element if CTRL/Meta key is pressed while the element is clicked

      // if (this.keyboard.isActive('ctrl meta', evt)) {
      //   cellView.model.toFront();
      //   this.selection.collection.add(cellView.model);
      // } else {
      if (!this.selection.collection.has(cell)) {
        this.selectSingleShape(cell);
      }
      // }

    }, this);

    this.paper.on('element:deleteCanvasObject:pointerdown', function (cellView: joint.dia.CellView, evt, x, y) {
      if (!this.linkBeingCreated) {
        this.handleHaloRemoveElement(cellView);
      }
    }, this);

    // Code to handle the link anchor being clicked.
    this.paper.on('element:linkAnchor:pointerdown', function (cellView: joint.dia.CellView, evt, x, y) {
      const cell = cellView.model as BaseShape;
      if (this.linkBeingCreated &&
        cell.id === this.linkBeingCreated.get('source').id) {
        // User clicked on the source, clear the inprocess link creation
        delete this.linkBeingCreated;
        this.linkBeingCreated = null;
        return;
      }
      switch (cell.get('type')) {
        case K8sServiceShape.TYPE:
          this.linkBeingCreated = new K8sServiceLinkShape();
          this.linkBeingCreated.set('source', { id: cell.id });
          break;
        case K8sIngressShape.TYPE:
          this.linkBeingCreated = new IngressLinkShape();
          this.linkBeingCreated.set('source', { id: cell.id });
          break;
        case K8sVolumeShape.TYPE:
        case K8sEmptyDirShape.TYPE:
        case K8sHostPathShape.TYPE:
          this.linkBeingCreated = new VolumeLinkShape();
          this.linkBeingCreated.set('source', { id: cell.id });
          break;

      }
    }, this);


    // this.paper.on('elemment:pointerup', function(evt) {
    // console.log('Pointer up');
    //   var target = evt.data.link.get('target');
    //   if (evt.data.x === target.x && evt.data.y === target.y) {
    //       // remove zero-length links
    //       evt.data.link.remove();
    //   }}, this);

    this.paper.on('cell:mouseenter', function (cellView: joint.dia.CellView, evt) {
      const cell = cellView.model as BaseShape;
      // If we are connecting objects, and the source object can connect to this
      // object, highlight the object
      if (this.linkBeingCreated &&
        this.linkBeingCreated.canLinkTo(cell)) {
          this.linkTargetHighlight(cellView);
      }
    }, this);

    this.paper.on('cell:mouseleave', function (cellView: joint.dia.CellView, evt) {
      const cell = cellView.model as BaseShape;
      if (this.linkBeingCreated &&
        this.linkBeingCreated.canLinkTo(cell)) {
          this.linkTargetUnhighlight(cellView);
      }
    }, this);
    // listen for selection changes from the canvas

    // this.selection.collection.on('add reset remove', this.selectionChange, this);
  }

  linkTargetHighlight(cellView: joint.dia.CellView) {
    cellView.highlight(null,
      {
        highlighter: {
          name: 'addClass',
          options: {
            className: 'yipee-highlight-connection'
          }
        }
      });
  }

  linkTargetUnhighlight(cellView: joint.dia.CellView) {
    cellView.unhighlight(null,
      {
        highlighter: {
          name: 'addClass',
          options: {
            className: 'yipee-highlight-connection'
          }
        }
      });
  }
  /* ******************* */
  /* END CANVAS HANDLERS */
  /* ******************* */

  /* ***************** */
  /* LIFECYCLE METHODS */
  /* ***************** */
  ngOnInit(): void {
    super.init();

    // create the canvas graph and papers objects
    const graph = this.graph = new joint.dia.Graph;

    const paper = this.paper = new joint.dia.Paper({
      width: properties.paper.minWidth,
      height: properties.paper.minHeight,
      clickThreshold: 1,
      gridSize: 1,
      drawGrid: true,
      linkPinning: false,
      model: graph,
      validateConnection: this.validateConnection,
      defaultLink: new DefaultLinkShape,
      restrictTranslate: true
    });

    $('.canvas-paper').append(paper.el);
    this.paper.render();

    // this.canvasUtility.loadShapes(this.graph, this.paper);

    // link created change handler
    // this.graph.on('change:source change:target', function (link) {
    //   if (link.get('source').id && link.get('target').id && link instanceof DefaultLinkShape) {
    //     this.linkCreated(link);
    //   }
    // }, this);

    // once an item is removed from the canvas, also remove it from the model
    this.graph.on('remove', function (cell, collection, opt) {
      if (cell.isLink()) {
        this.linkRemoved(cell);
      } else {
        this.elementRemoved(cell);
      }
    }, this);

    this.initializeCanvasHandlers();

    this.createK8sObjects();
  }

  ngOnDestroy(): void { }
  /* ********************* */
  /* END LIFECYCLE METHODS */
  /* ********************* */

  /* ******* */
  /* UTILITY */
  /* ******* */
  onDebug(): void {
    console.log('flat', this.editorService.k8sFile.toFlat());
    console.log('k8sFile', this.editorService.k8sFile);
  }

  fitPaperToContent() {
    this.paper.fitToContent({
      minWidth: properties.paper.minWidth,
      minHeight: properties.paper.minHeight
    });
  }
  /* *********** */
  /* END UTILITY */
  /* *********** */
  updateServiceContainerGroupLinks(): void {

    for (const service of this.editorService.k8sFile.services) {
      const serviceShape = this.getK8sServiceShape(service);
      if (serviceShape === undefined) {
        continue;
      }
      let existing = this.getK8sServiceLinkShapes().filter((l) => l.attributes.source.id === serviceShape.id);
      for (const cgroup of service.container_groups) {
        const cgroupShape = this.getContainerGroupShape(cgroup);
        if (cgroupShape === undefined) {
          continue;
        }
        const linkShape = existing.find((l) => l.attributes.target.id === cgroupShape.id);
        if (linkShape === undefined) {
          const link = new K8sServiceLinkShape(
            {
              source: { id: serviceShape.id },
              target: { id: cgroupShape.id }
            });
          link.canRemove = false;
          this.graph.addCell(link);
        } else {
          existing = existing.filter((l) => l.attributes.target.id !== cgroupShape.id);
        }
      }
      this.graph.removeCells(existing);
    }

  }

  fullscreen(): void {
    joint.util.toggleFullScreen();
  }

  newContainerGroup(cg?: ContainerGroup): void {
    const cgroup = this.editorService.newContainerGroup(cg);
    const shape = new ContainerGroupShape(this.editorService, cgroup);
    shape.canConnect = false;
    shape.hasError = (cgroup.container_count === 0);
    shape.layout();
    this.positionNewShape(shape);
    this.graph.addCell(shape);
    this.fitPaperToContent();
    this.selectSingleShape(shape);
  }

  newK8sEmptyDirVolume(vol?: EmptyDirVolume): void {
    const volume = this.editorService.newK8sEmptyDirVolume(vol);
    const shape = new K8sEmptyDirShape(this.editorService, volume);
    this.positionNewShape(shape);
    this.graph.addCell(shape);
    this.fitPaperToContent();
    this.selectSingleShape(shape);
  }

  newK8sHostPathVolume(vol?: HostPathVolume): void {
    const volume = this.editorService.newK8sHostPathVolume(vol);
    const shape = new K8sHostPathShape(this.editorService, volume);
    this.positionNewShape(shape);
    this.graph.addCell(shape);
    this.fitPaperToContent();
    this.selectSingleShape(shape);
  }

  newK8sVolume(vol?: K8sVolume.Volume): void {
    const volume = this.editorService.newK8sVolume(vol);
    const shape = new K8sVolumeShape(this.editorService, volume);
    this.positionNewShape(shape);
    this.graph.addCell(shape);
    this.fitPaperToContent();
    this.selectSingleShape(shape);
  }

  newK8sIngress(ing?: Ingress): void {
    const ingress = this.editorService.newK8sIngress(ing);
    const shape = new K8sIngressShape(this.editorService, ingress);
    this.positionNewShape(shape);
    this.graph.addCell(shape);
    this.fitPaperToContent();
    this.selectSingleShape(shape);
  }

  createNewUnknownKind() {
    const unknownKind = this.editorService.newK8sUnknownKind();
    const shape = new K8sUnknownKindShape(this.editorService, unknownKind);
    this.positionNewShape(shape);
    this.graph.addCell(shape);
    this.fitPaperToContent();
    this.selectSingleShape(shape);
  }

  newK8sService(svc?: K8sService.Service): void {
    const service = this.editorService.newK8sService(svc);
    const shape = new K8sServiceShape(this.editorService, service);
    this.positionNewShape(shape);
    this.graph.addCell(shape);
    this.fitPaperToContent();
    this.selectSingleShape(shape);
    this.editorEventService.onServiceModelOnRefresh.next();
  }

  newContainer(container?: Container): void {
    container = (container ? container : this.editorService.newContainer());
    this.addContainer(container);
  }

  addContainer(container: Container): void {
    const shape = new ContainerShape(this.editorService, container);
    this.positionNewShape(shape);
    this.graph.addCell(shape);
    this.fitPaperToContent();
    this.selectSingleShape(shape);
  }

  selectionChange(): void {
    if (this.selection.collection.size === 1) {
    this.selection.collection.forEach(function (shape: BaseShape) {
    this.editorEventService.canvasSelectionChanged(shape.key);
        this.unhighlightAll();
        this.emphasizeLinks(shape);
        const cellView = this.paper.findViewByModel(shape);
        this.displayHalo(cellView);
      }, this);
    }

    if (this.selection.collection.size !== 1) {
      this.editorEventService.selectDefault();
      this.unemphasizeLinks();
    this.unhighlightAll();
      this.removeHalo();
    }

  }

  unhighlightAll(): void {
    for (const cell of this.graph.getCells()) {
      this.paper.findViewByModel(cell).unhighlight();
    }
  }

  emphasizeLinks(shape: joint.dia.Cell): void {
    this.unemphasizeLinks();
    for (const cell of this.graph.getConnectedLinks(shape)) {
      if (cell instanceof LinkShape) {
        const link = cell as LinkShape;
        link.emphasize();
      }
    }
  }

  unemphasizeLinks(): void {
    for (const cell of this.graph.getLinks()) {
      if (cell instanceof LinkShape) {
        const link = cell as LinkShape;
        link.unemphasize();
      }
    }
  }

  validateElementDrop(shape: BaseShape, x: number, y: number): void {

    // don't validate links

    if (shape.isLink()) {
      return;
    }

    const point = new joint.g.Point(x, y);
    if (this.getSelectionTypes().length !== 1) {
      this.unhighlightAll();
      return;
    }
    let cellViewsBelow = this.paper.findViewsFromPoint(point);
    if (cellViewsBelow.length > 1) {
      // filter our the shape we are moving
      cellViewsBelow = cellViewsBelow.filter((e) => e.model.id !== shape.id);
      // find the single one that will accept the shape
      const cellViewBelow = cellViewsBelow.find((e) => {
        const base = e.model as BaseShape;
        return (base.willAcceptChildType(shape.attributes.type));
      });
      // prevent recursive embedding
      if (cellViewBelow && cellViewBelow.model.get('parent') !== shape.id) {
        const base = cellViewBelow.model as BaseShape;
        if (base.willAcceptChildType(shape.attributes.type)) {
          this.unhighlightAll();
          cellViewBelow.highlight();
        } else {
          this.unhighlightAll();
        }
      }
    } else {
      this.unhighlightAll();
    }
  }

  validateConnection(
    cellViewSource: joint.dia.CellView,
    magnetSource: SVGElement,
    cellViewTarget: joint.dia.CellView,
    magnetTarget: SVGElement,
    end: string,
    linkView: joint.dia.LinkView): boolean {

    // can't link to yourself

    if (cellViewSource === cellViewTarget) {
      return false;
    }

    const source = cellViewSource.model;
    const target = cellViewTarget.model;

    // can only link to another element (this excludes links and other items on the paper)

    if (!target.isElement()) {
      return false;
    }

    // validate target based on source type

    switch (source.attributes.type) {
      case K8sVolumeShape.TYPE:
        switch (target.attributes.type) {
          case ContainerShape.TYPE: {
            const vol = source as K8sVolumeShape;
            const cont = target as ContainerShape;
            return cont.container.canConnectVolume(vol.volume);
          }
        }
        break;
      case K8sEmptyDirShape.TYPE:
        switch (target.attributes.type) {
          case ContainerShape.TYPE: {
            const vol = source as K8sEmptyDirShape;
            const cont = target as ContainerShape;
            return cont.container.canConnectEmptyDir(vol.volume);
          }
        }
        break;
      case K8sHostPathShape.TYPE:
        switch (target.attributes.type) {
          case ContainerShape.TYPE: {
            const vol = source as K8sHostPathShape;
            const cont = target as ContainerShape;
            return cont.container.canConnectHostPath(vol.volume);
          }
        }
        break;
      case K8sServiceShape.TYPE:
        switch (target.attributes.type) {
          case ContainerGroupShape.TYPE: {
            return true;
          }
          case K8sIngressShape.TYPE: {
            return true;
          }
        }
        break;
      case K8sIngressShape.TYPE:
        switch (target.attributes.type) {
          case K8sServiceShape.TYPE: {
            return true;
          }
        }
        break;
      case ContainerShape.TYPE:
        switch (target.attributes.type) {
          case K8sVolumeShape.TYPE: {
            const vol = target as K8sVolumeShape;
            const cont = source as ContainerShape;
            return cont.container.canConnectVolume(vol.volume);
          }
          case K8sEmptyDirShape.TYPE: {
            const vol = target as K8sEmptyDirShape;
            const cont = source as ContainerShape;
            return cont.container.canConnectEmptyDir(vol.volume);
          }
          case K8sHostPathShape.TYPE: {
            const vol = target as K8sHostPathShape;
            const cont = source as ContainerShape;
            return cont.container.canConnectHostPath(vol.volume);
          }
        }
        break;
      default:
        break;
    }

    // any fall through indicates an invalid target

    return false;
  }

  elementRemoved(cell: joint.dia.Cell): void {
    switch (cell.attributes.type) {
      case ContainerShape.TYPE: {
        const shape = cell as ContainerShape;
        this.editorService.removeInvalidFormKey(shape.container.id);
        const cgroup = shape.container.getContainerGroup();
        if (cgroup !== undefined) {
          this.editorService.removeContainerFromContainerGroup(shape.container, cgroup);
        }
        shape.container.remove();
        break;
      }
      case ContainerGroupShape.TYPE: {
        const shape = cell as ContainerGroupShape;
        this.editorService.removeInvalidFormKey(shape.cgroup.id);
        shape.cgroup.remove();
        break;
      }
      case K8sVolumeShape.TYPE: {
        const shape = cell as K8sVolumeShape;
        this.editorService.removeInvalidFormKey(shape.volume.id);
        shape.volume.remove();
        break;
      }
      case K8sEmptyDirShape.TYPE: {
        const shape = cell as K8sEmptyDirShape;
        this.editorService.removeInvalidFormKey(shape.volume.id);
        shape.volume.remove();
        break;
      }
      case K8sHostPathShape.TYPE: {
        const shape = cell as K8sHostPathShape;
        this.editorService.removeInvalidFormKey(shape.volume.id);
        shape.volume.remove();
        break;
      }
      case K8sServiceShape.TYPE: {
        const shape = cell as K8sServiceShape;
        this.editorService.removeInvalidFormKey(shape.service.id);
        shape.service.remove();
        this.editorEventService.onServiceModelOnRefresh.next();
        break;
      }
      case K8sIngressShape.TYPE: {
        const shape = cell as K8sIngressShape;
        this.editorService.removeInvalidFormKey(shape.ingress.id);
        shape.ingress.remove();
        break;
      }
      case K8sUnknownKindShape.TYPE: {
        const shape = cell as K8sUnknownKindShape;
        this.editorService.removeInvalidFormKey(shape.unknownKind.id);
        shape.unknownKind.remove();
        break;
      }
    }
    this.clearSelection();
  }

  linkRemoved(cell: joint.dia.Cell): void {
    switch (cell.attributes.type) {
      case VolumeLinkShape.TYPE: {
        const link = cell as VolumeLinkShape;
        const target = this.graph.getCell(link.get('target').id) as BaseShape;
        switch (target.attributes.type) {
          case K8sVolumeShape.TYPE: {
            const source = this.graph.getCell(link.get('source').id) as ContainerShape;
            const shape = target as K8sVolumeShape;
            source.container.removeVolumeReference(shape.volume);
            this.editorEventService.onContainerVolumeChange.emit(new ContainerVolumeChangedEvent(source.container, EventSource.Canvas));
            break;
          }
          case K8sEmptyDirShape.TYPE: {
            const source = this.graph.getCell(link.get('source').id) as ContainerShape;
            const shape = target as K8sEmptyDirShape;
            source.container.removeEmptyDirReference(shape.volume);
            this.editorEventService.onContainerEmptyDirChange.emit(new ContainerVolumeChangedEvent(source.container, EventSource.Canvas));
            break;
          }
          case K8sHostPathShape.TYPE: {
            const source = this.graph.getCell(link.get('source').id) as ContainerShape;
            const shape = target as K8sHostPathShape;
            source.container.removeHostPathReference(shape.volume);
            this.editorEventService.onContainerHostPathChange.emit(new ContainerVolumeChangedEvent(source.container, EventSource.Canvas));
            break;
          }
        }
        break;
      }
    }
  }

  linkCreated(link: DefaultLinkShape): void {
    const source = this.graph.getCell(link.get('source').id);
    const target = this.graph.getCell(link.get('target').id);
    switch (source.attributes.type) {
      case K8sServiceShape.TYPE:
        switch (target.attributes.type) {
          case ContainerGroupShape.TYPE: {
            const src = source as K8sServiceShape;
            const tgt = target as ContainerGroupShape;
            src.service.connectServiceToContainerGroup(tgt.cgroup);
            this.graph.removeCells([link], null);
            this.editorService.dirty = true;
            this.editorEventService.onGenericTrack.emit('AddServiceSelector');
            break;
          }
          case K8sIngressShape.TYPE: {
            const src = source as K8sServiceShape;
            const tgt = target as K8sIngressShape;
            tgt.ingress.connectServiceToIngress(src.service);
            const lnk = new IngressLinkShape({
              source: { id: tgt.id },
              target: { id: src.id }
            });
            this.graph.removeCells([link], null);
            this.graph.addCell(lnk);
            this.editorService.dirty = true;
            this.editorEventService.onGenericTrack.emit('AddIngressService');
            break;
          }
        }
        break;
      case K8sIngressShape.TYPE:
        switch (target.attributes.type) {
          case K8sServiceShape.TYPE: {
            const src = source as K8sIngressShape;
            const tgt = target as K8sServiceShape;
            src.ingress.connectServiceToIngress(tgt.service);
            const lnk = new IngressLinkShape({
              source: { id: src.id },
              target: { id: tgt.id }
            });
            this.graph.removeCells([link], null);
            this.graph.addCell(lnk);
            this.editorService.dirty = true;
            this.editorEventService.onGenericTrack.emit('AddIngressService');
            break;
          }
        }
        break;
      case K8sVolumeShape.TYPE:
        switch (target.attributes.type) {
          case ContainerShape.TYPE: {
            const vol = source as K8sVolumeShape;
            const container = target as ContainerShape;
            container.container.addVolumeReference(vol.volume);
            this.editorEventService.onContainerVolumeChange.emit(new ContainerVolumeChangedEvent(container.container, EventSource.Canvas));
            this.editorEventService.onGenericTrack.emit('AddContainerVolumeMount');
            const lnk = new VolumeLinkShape(
              {
                source: { id: container.id },
                target: { id: vol.id }
              });
            this.graph.removeCells([link], null);
            this.graph.addCells([lnk], null);
            break;
          }
        }
        break;
      case K8sEmptyDirShape.TYPE:
        switch (target.attributes.type) {
          case ContainerShape.TYPE: {
            const vol = source as K8sEmptyDirShape;
            const container = target as ContainerShape;
            container.container.addEmptyDirReference(vol.volume);
            this.editorEventService.onContainerEmptyDirChange.emit(new ContainerVolumeChangedEvent(container.container, EventSource.Canvas));
            this.editorEventService.onGenericTrack.emit('AddContainerVolumeMount');
            const lnk = new VolumeLinkShape(
              {
                source: { id: container.id },
                target: { id: vol.id }
              });
            this.graph.removeCells([link], null);
            this.graph.addCells([lnk], null);
            break;
          }
        }
        break;
      case K8sHostPathShape.TYPE:
        switch (target.attributes.type) {
          case ContainerShape.TYPE: {
            const vol = source as K8sHostPathShape;
            const container = target as ContainerShape;
            container.container.addHostPathReference(vol.volume);
            this.editorEventService.onContainerHostPathChange.emit(new ContainerVolumeChangedEvent(container.container, EventSource.Canvas));
            this.editorEventService.onGenericTrack.emit('AddContainerVolumeMount');
            const lnk = new VolumeLinkShape(
              {
                source: { id: container.id },
                target: { id: vol.id }
              });
            this.graph.removeCells([link], null);
            this.graph.addCells([lnk], null);
            break;
          }
        }
        break;
      case ContainerShape.TYPE:
        switch (target.attributes.type) {
          case K8sVolumeShape.TYPE: {
            const vol = target as K8sVolumeShape;
            const container = source as ContainerShape;
            container.container.addVolumeReference(vol.volume);
            this.editorEventService.onContainerVolumeChange.emit(new ContainerVolumeChangedEvent(container.container, EventSource.Canvas));
            this.editorEventService.onGenericTrack.emit('AddContainerVolumeMount');
            const lnk = new VolumeLinkShape(
              {
                source: { id: container.id },
                target: { id: vol.id }
              });
            this.graph.removeCells([link], null);
            this.graph.addCells([lnk], null);
            break;
          }
          case K8sEmptyDirShape.TYPE: {
            const vol = target as K8sEmptyDirShape;
            const container = source as ContainerShape;
            container.container.addEmptyDirReference(vol.volume);
            this.editorEventService.onContainerEmptyDirChange.emit(new ContainerVolumeChangedEvent(container.container, EventSource.Canvas));
            this.editorEventService.onGenericTrack.emit('AddContainerVolumeMount');
            const lnk = new VolumeLinkShape(
              {
                source: { id: container.id },
                target: { id: vol.id }
              });
            this.graph.removeCells([link], null);
            this.graph.addCells([lnk], null);
            break;
          }
          case K8sHostPathShape.TYPE: {
            const vol = target as K8sHostPathShape;
            const container = source as ContainerShape;
            container.container.addHostPathReference(vol.volume);
            this.editorEventService.onContainerHostPathChange.emit(new ContainerVolumeChangedEvent(container.container, EventSource.Canvas));
            this.editorEventService.onGenericTrack.emit('AddContainerVolumeMount');
            const lnk = new VolumeLinkShape(
              {
                source: { id: container.id },
                target: { id: vol.id }
              });
            this.graph.removeCells([link], null);
            this.graph.addCells([lnk], null);
            break;
          }
        }
        break;
      default:
        break;
    }
  }

  getSelectionTypes(): string[] {
    const types: string[] = [];
    this.selection.collection.forEach(function (shape: BaseShape) {
      if (types.indexOf(shape.attributes.type) === -1) {
        types.push(shape.attributes.type);
      }
    }, this);
    return types;
  }

  stopReparent(x: number, y: number): void {

    // iterate over all selected items (they may be dragging all of them)

    const point = new joint.g.Point(x, y);
    const types = this.getSelectionTypes();
    if (types.length === 1 && !this.haloAction) {
    this.selection.collection.forEach(function (shape: BaseShape) {
      // findViewsFromPoint() returns the view for the `cell` itself so filter
      const cellsBelow = this.paper.findViewsFromPoint(point).filter((c: joint.dia.CellView) => c.model.id !== shape.id) as joint.dia.CellView[];
      let embedded = false;
      for (const cell of cellsBelow) {
        // prevent recursive embedding
        if (cell && cell.model.get('parent') !== shape.id) {
          const base = cell.model as BaseShape;
          if (base.willAcceptChildType(shape.attributes.type)) {
            this.embedShape(shape, base);
            embedded = true;
          }
        }
      }
      if (!embedded) {
        this.embedShape(shape);
      }
    }, this);
    }
    this.haloAction = false;
    this.unhighlightAll();
  }

  embedShape(shape: BaseShape, parent?: BaseShape): void {
    const oldParent = this.getParentShape(shape);
    if (oldParent && parent && oldParent.id === parent.id) {
      return;
    }
    if (oldParent) {
      if (oldParent instanceof ContainerGroupShape && shape instanceof ContainerShape) {
        const cgroup = oldParent as ContainerGroupShape;
        const container = shape as ContainerShape;
        this.editorService.removeContainerFromContainerGroup(container.container, cgroup.cgroup);
      }
      oldParent.unembed(shape);
      oldParent.layout();
    }
    if (parent) {
      if (parent instanceof ContainerGroupShape && shape instanceof ContainerShape) {
        const cgroup = parent as ContainerGroupShape;
        const container = shape as ContainerShape;
        this.editorService.addContainerToContainerGroup(container.container, cgroup.cgroup);
      }
      parent.embed(shape);
      parent.layout();
    }
  }

  getParentShape(shape: BaseShape): BaseShape {
    const id = shape.get('parent');
    return this.graph.get('cells').find(function (cell) {
      return cell.id === id;
    }, this);
  }

  clearSelection(): void {
    this.selection.collection.clear();
    this.selectionChange();
  }

  selectSingleShape(shape: BaseShape): void {
    if (shape.isElement()) {
      shape.toFront();
      const children = shape.getEmbeddedCells();
      if (children) {
        for (const child of children) {
          for (const link of this.graph.getConnectedLinks(child)) {
            link.toFront();
          }
          child.toFront();
        }
      }
      this.clearSelection();
      this.selection.collection.add(shape);
      this.selectionChange();
      const cellView = this.paper.findViewByModel(shape);
      this.unhighlightAll();
      cellView.highlight();
      this.editorEventService.canvasSelectionChanged(shape.key);
    }
  }

  removeHalo(): void {
    // if (this.halo) {
    //   this.halo.remove();
    //   this.halo = undefined;
    // }
  }

  handleHaloRemoveElement(cellView: joint.dia.CellView): void {
    switch (cellView.model.attributes.type) {
      case ContainerShape.TYPE: {
        const shape = cellView.model as ContainerShape;
        this.confirmDeleteObjectType = ContainerShape.TYPE;
        this.confirmDeleteObjectName = shape.container.name;
        break;
      }
      case K8sVolumeShape.TYPE: {
        const shape = cellView.model as K8sVolumeShape;
        this.confirmDeleteObjectType = 'volume';
        this.confirmDeleteObjectName = shape.volume.name;
        break;
      }
      case K8sEmptyDirShape.TYPE: {
        const shape = cellView.model as K8sEmptyDirShape;
        this.confirmDeleteObjectType = 'empty directory';
        this.confirmDeleteObjectName = shape.volume.name;
        break;
      }
      case K8sServiceShape.TYPE: {
        const shape = cellView.model as K8sServiceShape;
        this.confirmDeleteObjectType = 'service';
        this.confirmDeleteObjectName = shape.service.name;
        break;
      }
      case ContainerGroupShape.TYPE: {
        const shape = cellView.model as ContainerGroupShape;
        this.confirmDeleteObjectType = 'workload';
        this.confirmDeleteObjectName = shape.cgroup.name;
        break;
      }
      case K8sIngressShape.TYPE: {
        const shape = cellView.model as K8sIngressShape;
        this.confirmDeleteObjectType = 'ingress';
        this.confirmDeleteObjectName = shape.ingress.name;
        break;
      }
      case K8sUnknownKindShape.TYPE: {
        const shape = cellView.model as K8sUnknownKindShape;
        this.confirmDeleteObjectType = 'unknown-kind';
        this.confirmDeleteObjectName = shape.unknownKind.name;
        break;
      }
    }
    this.confirmDeleteCellView = cellView;
    this.showConfirmDeleteDialog = true;
  }

  removeElementConfirmed(): void {
    this.graph.removeCells([this.confirmDeleteCellView.model]);
    this.confirmDeleteCellView = undefined;
    this.editorEventService.selectDefault();
  }

  displayHalo(cellView: joint.dia.CellView): void {

    // this.removeHalo();

    // const cell = cellView.model;

    // if (cell.isElement()) {
    //   const icon = cell as BaseShape;
    //   this.halo = new joint.ui.Halo({
    //     cellView: cellView,
    //     handles: HaloConfiguration.getConfiguration().handles
    //   });

    //   if (!icon.canRemove || this.editorService.readOnly) {
    //     this.halo.removeHandle('remove');
    //   } else {
    //     this.halo.on('action:remove:pointerdown', function (evt) {
    //       this.handleHaloRemoveElement(cellView);
    //     }, this);
    //   }

    //   if (!icon.canClone || this.editorService.readOnly) {
    //     this.halo.removeHandle('clone');
    //   }

    //   if (!icon.canConnect || this.editorService.readOnly) {
    //     this.halo.removeHandle('link');
    //   }

    //   this.halo.on('action:link:pointerdown', function () {
    //     this.haloAction = true;
    //   }, this);

    //   this.halo.on('action:remove:pointerdown', function () {
    //     this.haloAction = true;
    //   }, this);

    //   this.halo.on('action:clone:pointerdown', function () {
    //     this.haloAction = true;
    //   }, this);

    //   this.halo.render();
    // }
  }

  // search and break if the k8sFile contains position data for service, volumes, or container groups
  // return false if no position data was found
  hasPositionData(): boolean {
    for (const service of this.editorService.k8sFile.services) {
      if (service.ui.canvas.position.x !== 0 && service.ui.canvas.position.y !== 0) {
        return true;
      }
    }
    for (const volume of this.editorService.k8sFile.volumes) {
      if (volume.ui.canvas.position.x !== 0 && volume.ui.canvas.position.y !== 0) {
        return true;
      }
    }
    for (const cgroup of this.editorService.k8sFile.containerGroups) {
      if (cgroup.ui.canvas.position.x !== 0 && cgroup.ui.canvas.position.y !== 0) {
        return true;
      }
    }
    return false;
  }

  positionNewShape(shape: BaseShape): void {
    const elements = this.graph.getElements();
    let foundSpace = false;
    while (!foundSpace) {
      foundSpace = true;
      for (const element of elements) {
        if (element.getBBox().intersect(shape.getBBox())) {
          foundSpace = false;
          break;
        }
      }
      if (!foundSpace) {
        shape.repositionRight(25);
      }
    }
  }

  layoutContainerGroups() {
    for (const group of this.getContainerGroupShapes()) {
      group.layout();
      group.toFront();
      for (const child of group.getEmbeddedCells()) {
        for (const link of this.graph.getConnectedLinks(child)) {
          link.toFront();
        }
        child.toFront();
      }
    }
  }

  getK8sVolumeShapes(): K8sVolumeShape[] {
    return this.graph.getElements().filter((e) => e.attributes.type === K8sVolumeShape.TYPE) as K8sVolumeShape[];
  }

  // Find all the volumes in the graph and filter out those that are attached to containers
  getK8sUnattachedStorageShapes(ids: string[]): IconShape[] {
    return this.graph.getElements().filter(
      (e) => (e.attributes.type === K8sVolumeShape.TYPE ||
        e.attributes.type === K8sHostPathShape.TYPE ||
        e.attributes.type === K8sEmptyDirShape.TYPE) &&
        !ids.includes(e.id.toString())
    ) as IconShape[];

  }

  getK8sEmptyDirShapes(): K8sEmptyDirShape[] {
    return this.graph.getElements().filter((e) => e.attributes.type === K8sEmptyDirShape.TYPE) as K8sEmptyDirShape[];
  }

  getK8sHostPathShapes(): K8sHostPathShape[] {
    return this.graph.getElements().filter((e) => e.attributes.type === K8sHostPathShape.TYPE) as K8sHostPathShape[];
  }

  getK8sVolumeForContainerGroupShapes(cgroup: ContainerGroup): K8sVolumeShape[] {
    const ids: string[] = [];
    for (const container of cgroup.containers) {
      for (const vol_ref of container.volume_ref) {
        if (!(ids.includes(vol_ref.volume))) {
          ids.push(vol_ref.volume);
        }
      }
    }
    return this.getK8sVolumeShapes().filter((v) => ids.includes(v.volume.id));
  }

  getK8sEmptyDirForContainerGroupShapes(cgroup: ContainerGroup): K8sEmptyDirShape[] {
    const ids: string[] = [];
    for (const container of cgroup.containers) {
      for (const vol_ref of container.empty_dir_ref) {
        if (!(ids.includes(vol_ref.volume))) {
          ids.push(vol_ref.volume);
        }
      }
    }
    return this.getK8sEmptyDirShapes().filter((v) => ids.includes(v.volume.id));
  }

  getK8sHostPathForContainerGroupShapes(cgroup: ContainerGroup): K8sHostPathShape[] {
    const ids: string[] = [];
    for (const container of cgroup.containers) {
      for (const vol_ref of container.host_path_ref) {
        if (!(ids.includes(vol_ref.volume))) {
          ids.push(vol_ref.volume);
        }
      }
    }
    return this.getK8sHostPathShapes().filter((v) => ids.includes(v.volume.id));
  }

  getK8sIngressShapes(): K8sIngressShape[] {
    return this.graph.getElements().filter((e) => e.attributes.type === K8sIngressShape.TYPE) as K8sIngressShape[];
  }

  getK8sUnknownKinds(): K8sUnknownKindShape[] {
    return this.graph.getElements().filter((e) => e.attributes.type === K8sUnknownKindShape.TYPE) as K8sUnknownKindShape[];
  }

  getK8sServiceShapes(): K8sServiceShape[] {
    return this.graph.getElements().filter((e) => e.attributes.type === K8sServiceShape.TYPE) as K8sServiceShape[];
  }

  getK8sServiceShape(service: K8sService.Service): K8sServiceShape {
    const shapes = this.getK8sServiceShapes();
    return shapes.find((e) => e.service.id === service.id);
  }

  getContainerGroupShapes(): ContainerGroupShape[] {
    return this.graph.getElements().filter((e) => e.attributes.type === ContainerGroupShape.TYPE) as ContainerGroupShape[];
  }

  getK8sServiceForContainerGroupShapes(cgroup: ContainerGroup): K8sServiceShape[] {
    return this.getK8sServiceShapes().filter((e) => e.service.containerGroupInService(cgroup));
  }

  getContainerGroupShape(cgroup: ContainerGroup): ContainerGroupShape {
    const shapes = this.graph.getElements().filter((e) => e.attributes.type === ContainerGroupShape.TYPE) as ContainerGroupShape[];
    return shapes.find((e) => e.cgroup.id === cgroup.id);
  }

  getK8sServiceLinkShapes(): K8sServiceLinkShape[] {
    return this.graph.getLinks().filter((l) => l.attributes.type === K8sServiceLinkShape.TYPE) as K8sServiceLinkShape[];
  }

  k8sLayout() {

    this.layoutContainerGroups();

    const groupColumn = 225;
    const serviceColumn = 100;
    const padding = 25;
    const attachedStorage = [];
    let ingressX = groupColumn;
    let groupY = 100;
    let serviceY = 100;
    let volumeY = 100;
    let unattachedVolumeY = volumeY;

    // layout ingress objects across the top

    for (const ingress of this.getK8sIngressShapes()) {
      ingress.position(ingressX, groupY);
      ingressX += ingress.size().width + padding;
    }
    if (this.getK8sIngressShapes().length > 0) {
      groupY += groupY + padding;
      serviceY += serviceY + padding;
      volumeY += volumeY + padding;
      unattachedVolumeY += unattachedVolumeY + padding;
    }

    // layout container groups and any items connected to them

    for (const group of this.getContainerGroupShapes()) {
      group.position(groupColumn, groupY);
      for (const service of this.getK8sServiceForContainerGroupShapes(group.cgroup)) {
        service.position(serviceColumn, serviceY);
        serviceY += service.size().height;
        serviceY += padding;
      }
      for (const volume of this.getK8sVolumeForContainerGroupShapes(group.cgroup)) {
        volume.position(groupColumn + group.size().width + padding, volumeY);
        volumeY += volume.size().height;
        volumeY += padding;
        attachedStorage.push(volume.id);
      }
      for (const volume of this.getK8sEmptyDirForContainerGroupShapes(group.cgroup)) {
        volume.position(groupColumn + group.size().width + padding, volumeY);
        volumeY += volume.size().height;
        volumeY += padding;
        attachedStorage.push(volume.id);
      }
      for (const volume of this.getK8sHostPathForContainerGroupShapes(group.cgroup)) {
        volume.position(groupColumn + group.size().width + padding, volumeY);
        volumeY += volume.size().height;
        volumeY += padding;
        attachedStorage.push(volume.id);
      }
      groupY += group.size().height;
      groupY += padding;
      groupY = Math.max(groupY, serviceY, volumeY);
      serviceY = groupY;
      volumeY = groupY;
    }
    // Put unattached volumes at the bottom
    let volumeColumn = serviceColumn;
    let adjustForVolumeRow = false;
    let volumeRowAdjustment = 0;
    for (const volume of this.getK8sUnattachedStorageShapes(attachedStorage)) {
      volume.position(volumeColumn, groupY);
      volumeColumn += volume.size().width + padding;
      if (!adjustForVolumeRow) {
        adjustForVolumeRow = true;
        volumeRowAdjustment = volume.size().height + padding;
      }
    }
    if (adjustForVolumeRow) {
      groupY += volumeRowAdjustment;
    }
    // Put unknown kinds at the buttom of the model
    let unknownKindColumn = serviceColumn;
    for (const unknownKind of this.getK8sUnknownKinds()) {
      unknownKind.position(unknownKindColumn, groupY);
      unknownKindColumn += unknownKind.size().width + padding;
    }

    this.layoutContainerGroups();

  }

  treeLayout() {
    joint.layout.DirectedGraph.layout(this.graph);
  }

  layoutGraph() {
    if (this.editorService.editMode === 'k8s') {
      this.k8sLayout();
    } else {
      joint.layout.DirectedGraph.layout(this.graph, {
        setLinkVertices: false,
        //        resizeClusters: false,
        rankDir: 'TB',
        marginX: 100,
        marginY: 100
      });
    }
    this.fitPaperToContent();
  }

}








// DECPRECATED

// resized(): void {
//   this.navigator.updateCurrentView();
// }

// center(): void {
//   this.paperScroller.centerContent();
// }
