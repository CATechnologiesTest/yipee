import { ParsedObject } from './ParsedObject';

/** finder objectt */

export class Finder {

  public objects: ParsedObject[] = [];

  constructor() { }

  push(object: ParsedObject): void {
    object.finder = this;
    if (!this.exists(object)) {
      this.objects.push(object);
      this.objectAdded(object);
    }
  }

  remove(id: string): void {
    const object = this.objects.find((p) => p.id === id);
    this.objects = this.objects.filter((p) => p.id !== id);
    this.objectRemoved(object);
  }

  private exists(object: ParsedObject): boolean {
    return (this.objects.find((p: ParsedObject) => p.id === object.id) !== undefined);
  }

  private objectAdded(object: ParsedObject): void {
    for (const o of this.objects) {
      o.objectAdded(object);
    }
  }

  private objectRemoved(object: ParsedObject): void {
    if (object) {
      for (const o of this.objects) {
        o.objectRemoved(object);
      }
    }
  }

}
