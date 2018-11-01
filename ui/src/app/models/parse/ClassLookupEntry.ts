/** lookup entry for a class used by the parser */

type ConstructCallback = (type: string) => any;

export class ClassLookupEntry {

  type: string;
  construct: ConstructCallback;

  constructor(type: string, construct: ConstructCallback) {
    this.type = type;
    this.construct = construct;
  }

  getInstance() {
    const instance = this.construct(this.type);
    return instance;
  }

}
