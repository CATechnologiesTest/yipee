import { TestBed } from '@angular/core/testing';
import { SeparatorNameValuePair } from './GenericTypes';

describe('GenericTypes', () => {

  it('should parse environment variables correctly', () => {
    const snvp = new SeparatorNameValuePair('=');

    snvp.fromRaw('a=b');
    expect(snvp.name).toEqual('a');
    expect(snvp.value).toEqual('b');

    snvp.fromRaw('a=');
    expect(snvp.name).toEqual('a');
    expect(snvp.value).toEqual('');

    snvp.fromRaw('a=b=c');
    expect(snvp.name).toEqual('a');
    expect(snvp.value).toEqual('b=c');

    snvp.fromRaw('a');
    expect(snvp.name).toEqual('a');
    expect(snvp.value).toEqual('');

  });

});
