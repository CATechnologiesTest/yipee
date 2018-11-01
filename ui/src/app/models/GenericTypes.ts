export interface NameValueString {
  name: string;
  value: string;
}

export interface NameValueNumber {
  name: string;
  value: number;
}

export interface NameValueBoolean {
  name: string;
  value: boolean;
}

export class SeparatorNameValuePair {

  separator: string;
  name: string;
  value: string;

  constructor(separator: string, raw?: string) {
    this.separator = separator;
    this.fromRaw(raw);
  }

  public fromRaw(raw: string): void {
    if (raw) {
      const array = raw.split(this.separator);
      this.name = array[0];
      if (array.length === 1) {
        this.value = '';
      } else {
        const index = raw.indexOf(this.separator) + 1;
        if (index > raw.length) {
          this.value = '';
        } else {
          this.value = raw.substring(index);
        }
      }
    } else {
      this.name = '';
      this.value = '';
    }
  }

  public toRaw(): string {
    return this.name + this.separator + this.value;
  }

  public toArray(): string[] {
    const array: string[] = [];
    array.push(this.name);
    array.push(this.value);
    return array;
  }
}
