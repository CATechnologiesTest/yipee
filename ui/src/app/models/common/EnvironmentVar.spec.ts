import { TestBed } from '@angular/core/testing';
import { EnvironmentVar } from './EnvironmentVar';

describe('EnvironmentVar', () => {

  const flat1 = {
    'type': 'environment-var',
    'container': 'd0bef4cf-5f0b-4fa1-b8b0-5da4bfe6b26c',
    'key': 'CALLBACK_HOST',
    'value': '${CALLBACK_HOST}',
    'id': '7906c1bb-bf3c-4c4f-b864-fa5849668973'
  };

  const flat2 = {
    'type': 'environment-var',
    'container': 'd0bef4cf-5f0b-4fa1-b8b0-5da4bfe6b26c',
    'key': 'CALLBACK_HOST',
    'valueFrom': {
      'configMapKeyRef': {
        'key': 'TWO',
        'name': 'my-config-map'
      }
    },
    'id': '7906c1bb-bf3c-4c4f-b864-fa5849668973'
  };

  const flat3 = {
    'type': 'environment-var',
    'container': 'd0bef4cf-5f0b-4fa1-b8b0-5da4bfe6b26c',
    'key': 'CALLBACK_HOST',
    'valueFrom': {
      'secretKeyRef': {
        'key': 'TWO',
        'name': 'my-secret'
      }
    },
    'id': '7906c1bb-bf3c-4c4f-b864-fa5849668973'
  };

  const flat4 = {
    'type': 'environment-var',
    'container': 'd0bef4cf-5f0b-4fa1-b8b0-5da4bfe6b26c',
    'key': 'FR',
    'valueFrom': {
      'fieldRef': {
        'apiVersion': 'v1',
        'fieldPath': 'status.podIP'
      }
    },
    'id': '7906c1bb-bf3c-4c4f-b864-fa5849668973'
  };

  const flat5 = {
    'type': 'environment-var',
    'container': 'd0bef4cf-5f0b-4fa1-b8b0-5da4bfe6b26c',
    'key': 'RFR',
    'valueFrom': {
      'resourceFieldRef': {
        'containerName': 'newcontainername',
        'divisor': '1',
        'resource': 'limits.cpu'
      }
    },
    'id': '7906c1bb-bf3c-4c4f-b864-fa5849668989'
  };

  const flat6 = {
    'type': 'environment-var',
    'container': 'd0bef4cf-5f0b-4fa1-b8b0-5da4bfe6b26c',
    'key': 'RFR',
    'valueFrom': {
      'resourceFieldRef': {
        'divisor': '1',
        'resource': 'limits.cpu'
      }
    },
    'id': '7906c1bb-bf3c-4c4f-b864-fa5849668989'
  };

  it('should handle round trip for env var', () => {
    const e = EnvironmentVar.construct(EnvironmentVar.OBJECT_NAME) as EnvironmentVar;
    e.fromFlat(flat1);
    expect(e.toFlat()).toEqual(flat1);
    expect(e.key).toEqual('CALLBACK_HOST');
    expect(e.value).toEqual('${CALLBACK_HOST}');
    expect(e.isEmpty()).toBeFalsy();
    expect(e.isConfigRef()).toBeFalsy();
    expect(e.isSecretRef()).toBeFalsy();
    expect(e.isFieldRef()).toBeFalsy();
    expect(e.isResourceFieldRef()).toBeFalsy();
  });

  it('should handle round trip for config map ref', () => {
    const e = EnvironmentVar.construct(EnvironmentVar.OBJECT_NAME) as EnvironmentVar;
    e.fromFlat(flat2);
    expect(e.toFlat()).toEqual(flat2);
    expect(e.key).toEqual('CALLBACK_HOST');
    expect(e.config_key).toEqual('TWO');
    expect(e.config_name).toEqual('my-config-map');
    expect(e.isEmpty()).toBeFalsy();
    expect(e.isConfigRef()).toBeTruthy();
    expect(e.isSecretRef()).toBeFalsy();
    expect(e.isFieldRef()).toBeFalsy();
    expect(e.isResourceFieldRef()).toBeFalsy();
  });

  it('should handle round trip for secret ref', () => {
    const e = EnvironmentVar.construct(EnvironmentVar.OBJECT_NAME) as EnvironmentVar;
    e.fromFlat(flat3);
    expect(e.toFlat()).toEqual(flat3);
    expect(e.key).toEqual('CALLBACK_HOST');
    expect(e.secret_key).toEqual('TWO');
    expect(e.secret_name).toEqual('my-secret');
    expect(e.isEmpty()).toBeFalsy();
    expect(e.isConfigRef()).toBeFalsy();
    expect(e.isSecretRef()).toBeTruthy();
    expect(e.isFieldRef()).toBeFalsy();
    expect(e.isResourceFieldRef()).toBeFalsy();
  });

  it('should handle round trip for field ref', () => {
    const e = EnvironmentVar.construct(EnvironmentVar.OBJECT_NAME) as EnvironmentVar;
    e.fromFlat(flat4);
    expect(e.toFlat()).toEqual(flat4);
    expect(e.key).toEqual('FR');
    expect(e.apiVersion).toEqual('v1');
    expect(e.fieldPath).toEqual('status.podIP');
    expect(e.isEmpty()).toBeFalsy();
    expect(e.isConfigRef()).toBeFalsy();
    expect(e.isSecretRef()).toBeFalsy();
    expect(e.isFieldRef()).toBeTruthy();
    expect(e.isResourceFieldRef()).toBeFalsy();
  });

  it('should handle round trip for resource field ref with a container name', () => {
    const e = EnvironmentVar.construct(EnvironmentVar.OBJECT_NAME) as EnvironmentVar;
    e.fromFlat(flat5);
    expect(e.toFlat()).toEqual(flat5);
    expect(e.key).toEqual('RFR');
    expect(e.containerName).toEqual('newcontainername');
    expect(e.divisor).toEqual('1');
    expect(e.resource).toEqual('limits.cpu');
    expect(e.isEmpty()).toBeFalsy();
    expect(e.isConfigRef()).toBeFalsy();
    expect(e.isSecretRef()).toBeFalsy();
    expect(e.isFieldRef()).toBeFalsy();
    expect(e.isResourceFieldRef()).toBeTruthy();
  });

  it('should handle round trip for resource field ref without a container name', () => {
    const e = EnvironmentVar.construct(EnvironmentVar.OBJECT_NAME) as EnvironmentVar;
    e.fromFlat(flat6);
    expect(e.toFlat()).toEqual(flat6);
    expect(e.key).toEqual('RFR');
    expect(e.divisor).toEqual('1');
    expect(e.resource).toEqual('limits.cpu');
    expect(e.isEmpty()).toBeFalsy();
    expect(e.isConfigRef()).toBeFalsy();
    expect(e.isSecretRef()).toBeFalsy();
    expect(e.isFieldRef()).toBeFalsy();
    expect(e.isResourceFieldRef()).toBeTruthy();
  });

});
