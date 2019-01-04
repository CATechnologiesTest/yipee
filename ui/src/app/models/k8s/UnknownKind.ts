import { EventEmitter } from '@angular/core';

import { ParsedObject } from '../parse/ParsedObject';
import { NameChangeEvent } from '../Events';
import { FinderUtilities } from '../common/FinderUtilities';
import * as jsyaml from 'js-yaml';

export class UnknownKind extends ParsedObject {
  public static OBJECT_NAME = 'unknown-k8s-kind';

  public onNameChange: EventEmitter<NameChangeEvent> = new EventEmitter<NameChangeEvent>();

  _body: string;
  _name: string;
  _kind: string;
  error: {
    name: string;
    message: string;
  };

  public static construct(type: string): ParsedObject {
    return new UnknownKind();
  }

  constructor() {
    super(UnknownKind.OBJECT_NAME);
    this._name = 'Custom';
  }

  get ui(): any {
    return FinderUtilities.getUi(this.finder, this.id).value;
  }

  set body(yamlString: string) {
    let parsedYaml: any = null;

    // parse yaml to get the name, maybe throw and error
    try {
      parsedYaml = jsyaml.load(yamlString);
      this.error = { name: null, message: null };

      // if name exists in parsedYaml then set name otherwise set it to custom
      if (parsedYaml && parsedYaml.metadata && parsedYaml.metadata.name) {
        this.name = parsedYaml.metadata.name;
      } else {
        this.name = 'Custom';
      }

       // if kind exists in parsedYaml then set name otherwise set it to custom
       if (parsedYaml && parsedYaml.kind) {
        this._kind = parsedYaml.kind;
      } else {
        this._kind = 'Unknown';
      }

    } catch (error) {
      this.error = { name: error.name, message: error.message };
    }

    this._body = yamlString;
  }

  get body(): string {
    return this._body;
  }

  get name(): string {
    return this._name;
  }

  get kind(): string {
    return this._kind;
  }

  set name(value: string) {
    this.onNameChange.emit(new NameChangeEvent(this._name, value));
    this._name = value;
    this.initiateAttributeChange('name');
    this.onRefresh.emit(true);
  }

  /** convert from a flat object */
  fromFlat(flat: any): void {
    super.fromFlat(flat);
    this.body = flat['body'];
  }

  /** convert to a flat object */
  toFlat(): any {
    const flat = super.toFlat();
    flat['body'] = this.body;
    return flat;
  }

  remove() {
    super.remove();
    FinderUtilities.removeObjectAnnotations(this.finder, this.id);
  }

}
