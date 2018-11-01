import { TestBed } from '@angular/core/testing';
import { Label } from './Label';

describe('Label', () => {

  const flat1 = {
    'type': 'label',
    'cgroup': 'd0bef4cf-5f0b-4fa1-b8b0-5da4bfe6b26c',
    'key': 'io.yipee.label',
    'value': 'foo',
    'ismap': false,
    'id': '0e3d910b-7446-4d6c-8e40-b9513d23e216'
  };

  const flat2 = {
    'type': 'label',
    'cgroup': 'xxx',
    'key': 'io.yipee.label',
    'value': 'foo',
    'ismap': false,
    'id': 'yyy'
  };

  const flat3 = {
    'type': 'label',
    'cgroup': 'zzz',
    'key': 'io.yipee.label',
    'value': 'bar',
    'ismap': false,
    'id': 'aaa'
  };

  const flat4 = {
    'type': 'label',
    'cgroup': 'xxx',
    'key': 'io.yipee.label2',
    'value': 'foo',
    'ismap': false,
    'id': 'yyy'
  };

  it('should handle round trip', () => {
    const a1 = Label.construct(Label.OBJECT_NAME);
    a1.fromFlat(flat1);
    expect(a1.toFlat()).toEqual(flat1);
  });

  it('equal should work', () => {
    const a1 = Label.construct(Label.OBJECT_NAME) as Label;
    const a2 = Label.construct(Label.OBJECT_NAME) as Label;
    const a3 = Label.construct(Label.OBJECT_NAME) as Label;
    const a4 = Label.construct(Label.OBJECT_NAME) as Label;
    a1.fromFlat(flat1);
    a2.fromFlat(flat2);
    a3.fromFlat(flat3);
    a4.fromFlat(flat4);
    expect(a1.equals(a1)).toBeTruthy();
    expect(a1.equals(a2)).toBeTruthy();
    expect(a1.equals(a3)).toBeFalsy();
    expect(a1.equals(a4)).toBeFalsy();
  });

  it('is in should work', () => {
    const a1 = Label.construct(Label.OBJECT_NAME) as Label;
    const a2 = Label.construct(Label.OBJECT_NAME) as Label;
    const a3 = Label.construct(Label.OBJECT_NAME) as Label;
    const a4 = Label.construct(Label.OBJECT_NAME) as Label;
    a1.fromFlat(flat1);
    a2.fromFlat(flat2);
    a3.fromFlat(flat3);
    a4.fromFlat(flat4);
    const l1 = [a1, a2];
    const l2 = [a2, a3];
    const l3 = [a3, a4];
    expect(a1.in(l1)).toBeTruthy();
    expect(a1.in(l2)).toBeTruthy();
    expect(a1.in(l3)).toBeFalsy();
  });

  it('equals with blanks shouldnt match', () => {
    const a1 = Label.construct(Label.OBJECT_NAME) as Label;
    const a2 = Label.construct(Label.OBJECT_NAME) as Label;
    expect(a1.equals(a2)).toBeFalsy();
  });

});
