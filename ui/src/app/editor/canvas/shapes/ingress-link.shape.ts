import * as joint from 'jointjs';

import { LinkShape } from './link.shape';
import { K8sServiceShape } from './k8s-service.shape';

export class IngressLinkShape extends LinkShape {

  public static TYPE = 'ingress';

  constructor(attributes?: any, options?: any) {
    super(attributes, options);
    this.linkTargets = [K8sServiceShape.TYPE];
  }

  defaults(): Backbone.ObjectHash {
    return joint.util.deepSupplement({
      type: IngressLinkShape.TYPE,
      attrs: {
        '.connection': {
          stroke: 'blue',
          'stroke-width': 1
        },
        '.marker-source': {
          fill: 'white',
          d: ''
        },
        '.marker-target': {
          fill: 'blue',
          stroke: 'blue',
          d: 'M 10 0 L 0 5 L 10 10 z'
        }
      }
    }, joint.dia.Link.prototype.defaults);
  }
}
