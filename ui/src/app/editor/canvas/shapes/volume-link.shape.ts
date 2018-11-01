import * as joint from 'jointjs';

import { LinkShape } from './link.shape';
import { ContainerShape } from './container.shape';
import { BaseShape } from './base.shape';


export class VolumeLinkShape extends LinkShape {

  public static TYPE = 'volume';

  constructor(attributes?: any, options?: any) {
    super(attributes, options);
    this.linkTargets = [ContainerShape.TYPE];

  }

  defaults(): Backbone.ObjectHash {
    return joint.util.deepSupplement({
      type: VolumeLinkShape.TYPE,
      attrs: {
        '.connection': {
          stroke: 'green',
          'stroke-width': 1
        },
        '.marker-source': {
          fill: 'white',
          d: ''
        },
        '.marker-target': {
          fill: 'green',
          stroke: 'green',
          d: 'M 10 0 L 0 5 L 10 10 z'
        }
      }
    }, joint.dia.Link.prototype.defaults);
  }

  public canLinkTo(shape: BaseShape): boolean {
    // TODO add logic to restrict Persistent Volume Claim Templates
    // to containers and init containers within a stateful set container
    // group
    return super.canLinkTo(shape);
  }
}
