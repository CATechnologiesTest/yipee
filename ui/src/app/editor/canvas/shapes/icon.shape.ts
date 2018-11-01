import * as joint from 'jointjs';
import { BaseShape } from './base.shape';

export class IconShape extends BaseShape {

  public static ICON_LABEL_WIDTH = 90;

  imageRef: string;
  linkable: boolean;


  constructor(imageRef: string, key: string, type: string, attributes?: any, options?: any, linkable?: boolean) {
    super(key, type, attributes, options);
    this.imageRef = imageRef;
    this.linkable = linkable;
    this.set('markup', this.markup);
  }

  set hasError(value: boolean) {
    this._hasError = value;
    if (this._hasError) {
      this.attr('.error/display', 'inline');
    } else {
      this.attr('.error/display', 'none');
    }
  }

  get markup(): string {
    let markup: string;
    markup = `<g>
    <rect class="background" rx="10" ry="10"/>
    <rect class="border" rx="10" ry="10"/>
    <image class="image" height="60" width="70" x="15" y="13" xlink:href="${this.imageRef}"/>
    <image class="error" height="24" width="24" x="74" y="2" xlink:href="./assets/images/exclamation-circle-line.svg"/>
    <image class="deleteCanvasObject" height="20" width="20" x="4" y="4" xlink:href="./assets/images/times-circle-line.svg"/>`;

    if (this.linkable) {
      markup = markup + `    <image class="linkAnchor" height="24" width="24" x="74" y="60" xlink:href="./assets/images/link-line.svg"/>`;
    }
    return markup + `
    <text class="title" x="50" y="92" alignment-baseline="central" text-anchor="middle"/>
    </g>`;
  }

  changeIcon(imageRef: string): void {
    if (imageRef !== this.imageRef) {
      this.imageRef = imageRef;
      this.set('markup', this.markup);
    }
  }

  defaults(): Backbone.ObjectHash {
    return joint.util.deepSupplement({
      size: {
        width: 100,
        height: 100
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
        '.linkAnchor': {
          event: 'element:linkAnchor:pointerdown'
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
          stroke: '#007cbb',
          fill: '#000000'
        }
      }
    }, joint.shapes.basic.Generic.prototype.defaults);
  }
}
