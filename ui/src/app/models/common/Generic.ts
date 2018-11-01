import { v4 as uuid } from 'uuid';

/** name string value pair array backed by a map */

export class NameStringValue {

  public id: string;
  public name: string;
  public value: string;

  constructor(name: string, value: string) {
    this.id = uuid();
    this.name = name;
    this.value = value;
  }

}

export class MapNameStringValueArray {

  public array: NameStringValue[];

  constructor() {
    this.array = [];
  }

  fromFlat(flat: any): void {
    for (const key in flat) {
      if (flat.hasOwnProperty(key)) {
        this.array.push(new NameStringValue(key, flat[key]));
      }
    }
  }

  toFlat(): any {
    const flat = {};
    for (const entry of this.array) {
      flat[entry.name] = entry.value;
    }
    return flat;
  }

  remove(id: string): void {
    this.array = this.array.filter((p) => p.id !== id);
  }

}
