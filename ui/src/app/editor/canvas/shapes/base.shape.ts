import * as joint from 'jointjs';

export class BaseShape extends joint.shapes.basic.Generic {

  key: string;
  _hasError = false;
  canRemove = true;
  canClone = true;
  canConnect = true;

  constructor(key: string, type: string, attributes?: any, options?: any) {
    super(attributes, options);
    this.key = key;
    this.set('type', type);
    this.set('markup', this.markup);
  }

  get hasError(): boolean {
    return this._hasError;
  }

  set hasError(value: boolean) {
    this._hasError = value;
  }

  get tooltip(): string {
    return 'default';
  }

  get markup(): string {
    return `<g></g>`;
  }

  layout(): void { }

  willAcceptChildType(type: string): boolean {
    return false;
  }

  repositionRight(padding: number): void {
    const position = this.get('position');
    const size = this.get('size');
    position.x = position.x + size.width + padding;
    this.set('position', position);
  }

}
