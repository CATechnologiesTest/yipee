import { TestBed } from '@angular/core/testing';
import { ClassLookupEntry } from './ClassLookupEntry';
import { ParsedObject } from './ParsedObject';

class TestClass extends ParsedObject {

  public static construct(type: string): TestClass {
    return new TestClass(type);
  }

  constructor(type: string) {
    super(type);
  }

  testMethod(foo: string): void {
    expect(foo).toBe('bar');
  }

}

describe('ClassLookupEntry', () => {

  it('should create test class', () => {
    const cle = new ClassLookupEntry('test-class', TestClass.construct);
    const instance = cle.getInstance() as TestClass;
    expect(instance).toBeDefined();
    expect((instance instanceof TestClass)).toBeTruthy();
    instance.testMethod('bar');
  });

});
