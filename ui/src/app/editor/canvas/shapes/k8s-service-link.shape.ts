import * as joint from 'jointjs';
import { LinkShape } from './link.shape';
import { ContainerGroupShape } from './container-group.shape';
import { BaseShape } from './base.shape';

export class K8sServiceLinkShape extends LinkShape {

  public static TYPE = 'k8s-service';

  constructor(attributes?: any, options?: any) {
    super(attributes, options);
    this.linkTargets = [ContainerGroupShape.TYPE];
  }

  defaults(): Backbone.ObjectHash {
    return joint.util.deepSupplement({
      type: K8sServiceLinkShape.TYPE,
      attrs: {
        '.connection': {
          stroke: 'black',
          'stroke-width': 1
        },
        '.marker-source': {
          fill: 'white',
          d: ''
        },
        '.marker-target': {
          fill: 'while',
          d: ''
        }
      }
    }, joint.dia.Link.prototype.defaults);
  }
  // Override the link check as we can't link to CronJobs
  public canLinkTo(shape: BaseShape): boolean {
    if (super.canLinkTo(shape)) {
      if (shape instanceof ContainerGroupShape) {
        let c: ContainerGroupShape;
        c = shape;
        return c.cgroup.controller_type !== ContainerGroupShape.TYPE_CRONJOB;
      }
    }
    return false;
  }
}
