import { ClassLookupEntry } from './ClassLookupEntry';
import { ParsedObject } from './ParsedObject';
import { Finder } from './Finder';

/** flat file parser */

type StoreCallback = (context: any, object: ParsedObject) => any;

type HoldCallback = (context: any, object: any) => any;

export class Parser {

  finder: Finder = new Finder();
  lookup: Map<string, ClassLookupEntry>;

  constructor(lookupEntries: ClassLookupEntry[]) {
    this.lookup = new Map<string, ClassLookupEntry>();
    for (const entry of lookupEntries) {
      this.lookup.set(entry.type, entry);
    }
  }

  fromFlat(flat: any, context: any, storeCallback: StoreCallback, holdCallback: HoldCallback): boolean {
    Object.keys(flat).forEach(function (key) {
      const type = key;
      const lookup = this.lookup.get(type);
      if (lookup) {
        for (const entry of flat[key]) {
          const obj = lookup.getInstance(this.finder) as ParsedObject;
          obj.fromFlat(entry);
          obj.finder = this.finder;
          storeCallback(context, obj);
        }
      } else {
        // hold the entire group of objects, no need to parse
        const hold = {};
        hold[key] = flat[key];
        holdCallback(context, hold);
      }
    }, this);
    return true;
  }

  toFlat(stored: ParsedObject[], held: any[]): any {
    const raw = {};
    for (const key of Array.from(this.lookup.keys())) {
      const entries = stored.filter((p) => p.type === key && !p.isEmpty()).map((p) => p.toFlat());
      if (entries.length !== 0) {
        raw[key] = entries;
      }
    }
    for (const entry of held) {
      Object.keys(entry).forEach(function (key) {
        const entries = [];
        for (const item of entry[key]) {
          entries.push(item);
        }
        raw[key] = entries;
      }, this);
    }
    return raw;
  }

}
