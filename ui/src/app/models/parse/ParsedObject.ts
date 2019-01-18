import { EventEmitter } from '@angular/core';

import { v4 as uuid } from 'uuid';
import { Finder } from './Finder';

/** base parsed object interface, all classes must extend this interface */

export class ParsedObject {

  id: string;
  type: string;
  finder: Finder;
  base_type: string;
  public onRefresh: EventEmitter<boolean> = new EventEmitter();
  public onAttributeChange: EventEmitter<string> = new EventEmitter();

  public static construct(type: string): ParsedObject {
    return new ParsedObject(type);
  }

  constructor(type: string) {
    this.type = type;
    this.base_type = '';
    this.id = uuid();
  }

  /** refresh all objects of a certain type */
  refreshObjectsByType(type: string): void {
    const objects = this.finder.objects.filter((p) => p.type === type);
    for (const object of objects) {
      object.onRefresh.emit(true);
    }
  }

  /** object added lifecycle event */
  objectAdded(object: ParsedObject): void { }

  /** object removed lifecycle event */
  objectRemoved(object: ParsedObject): void { }

  /** attribute changed lifecycle event */
  attributeChanged(object: ParsedObject, attribute: string): void { }

  /** initiate an attribute change event */
  initiateAttributeChange(attribute: string): void {
    if (this.finder) {
      for (const object of this.finder.objects) {
        object.attributeChanged(this, attribute);
      }
    }
  }

  /** is the object empty */
  isEmpty(): boolean {
    return false;
  }

  /** convert from a flat object */
  fromFlat(flat: any): void {
    this.id = flat['id'];
  }

  /** convert to a flat object */
  toFlat(): any {
    return {
      type: this.type,
      id: this.id
    };
  }

  /** remove this object */
  remove(): void {
    this.finder.remove(this.id);
  }

}
