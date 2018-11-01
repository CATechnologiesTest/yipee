import * as joint from 'jointjs';
import { LinkShape } from './link.shape';

export class DefaultLinkShape extends LinkShape {

  public static TYPE = 'default-link';

  constructor(attributes?: any, options?: any) {
    super(attributes, options);
  }

  defaults(): Backbone.ObjectHash {
    return joint.util.deepSupplement({
      type: DefaultLinkShape.TYPE,
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
          fill: 'black',
          stroke: 'black',
          d: 'M 10 0 L 0 5 L 10 10 z'
        }
      }
    }, joint.dia.Link.prototype.defaults);
  }
}
