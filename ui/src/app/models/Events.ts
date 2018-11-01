/** events emitted by models */

export class NameChangeEvent {
  oldName: string;
  newName: string;
  constructor(oldName: string, newName: string) {
    this.oldName = oldName;
    this.newName = newName;
  }
}

export class ValueChangeEvent {
  oldValue: any;
  newValue: any;
  constructor(oldValue: any, newValue: any) {
    this.oldValue = oldValue;
    this.newValue = newValue;
  }
}

export class OverrideChangeEvent {
  oldValue: string;
  newValue: string;
  constructor(oldValue: string, newValue: string) {
    this.oldValue = oldValue;
    this.newValue = newValue;
  }
}
