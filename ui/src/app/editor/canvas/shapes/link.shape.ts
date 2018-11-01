import * as joint from 'jointjs';
import { BaseShape } from './base.shape';

export class LinkShape extends joint.dia.Link {

  _canRemove = true;
  linkTargets: Array<string>;

  constructor(attributes?: any, options?: any) {
    super(attributes, options);
    this.canRemove = true;
    this.set('vertexMarkup',
      `<g class="marker-vertex-group" transform="translate(<%= x %>, <%= y %>)">
        <circle class="marker-vertex" idx="<%= idx %>" r="8"/>
        <circle class="marker-vertex-remove-area" fill="red" idx="<%= idx %>" r="10" transform="translate(0, -20)"/>
        <path class="marker-vertex-remove" fill="red" idx="<%= idx %>" transform="scale(.5) translate(-18, -58)" d="M 18 2 A 16 16 0 1 0 34 18 A 16 16 0 0 0 18 2 Z m 8 22.1 a 1.4 1.4 0 0 1 -2 2 l -6 -6 L 12 26.12 a 1.4 1.4 0 1 1 -2 -2 L 16 18.08 L 9.83 11.86 a 1.4 1.4 0 1 1 2 -2 L 18 16.1 l 6.17 -6.17 a 1.4 1.4 0 1 1 2 2 L 20 18.08 Z">
          <title>Remove vertex.</title>
        </path>
      </g>`
    );
  }

  get canRemove(): boolean {
    return this._canRemove;
  }

  set canRemove(value: boolean) {
    this._canRemove = value;
    if (this._canRemove) {
      this.set('toolMarkup',
        `<g class="link-tool">
          <g class="tool-remove" event="remove">
            <circle r="11" />
            <path transform="scale(.8) translate(-16, -16)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z" />
            <title>Remove link.</title>
          </g>
        </g>`
      );
    } else {
      this.set('toolMarkup',
        `<g class="link-tool">
        </g>`
      );
    }
  }

  public emphasize(): void {
    this.attr('.connection/stroke-width', 3);
  }

  public unemphasize(): void {
    this.attr('.connection/stroke-width', 1);
  }

  public canLinkTo(shape: BaseShape): boolean {
    return this.linkTargets &&
      this.linkTargets.includes(shape.get('type'));
  }
}
