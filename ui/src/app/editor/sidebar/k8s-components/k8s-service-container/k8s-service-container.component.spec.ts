import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormsModule, FormBuilder, ReactiveFormsModule, FormArray, FormGroup, FormControl } from '@angular/forms';

import { K8sServiceContainerComponent } from './k8s-service-container.component';
import { EditorService } from '../../../editor.service';
import { EditorEventService } from '../../../editor-event.service';
import { K8sFile } from '../../../../models/k8s/K8sFile';
import { Service } from '../../../../models/k8s/Service';
import { Subject } from 'rxjs/Subject';
import { PortMapping } from '../../../../models/common/PortMapping';
import { componentFactoryName } from '@angular/compiler';

describe('ServiceComponent', () => {
  let component: K8sServiceContainerComponent;
  let fixture: ComponentFixture<K8sServiceContainerComponent>;

  const flat = {
    'k8s-service': [
      {
        'type': 'k8s-service',
        'id': 'b5d7d86f-5351-4ae8-9923-85bd0854a4eb',
        'name': 'service-1',
        'service-type': 'loadbalancer',
        'cluster-ip': '1.1.1.1',
        'selector': {'key1': 'val1'},
        'port_mapping': {
          'base_type': '',
          'container': 'd5455792-7f5b-4725-97b1-1a0295c42fcb',
          'container_name': 'hello',
          'defining_service': '69627b28-a9e4-481e-bd0b-99b5ef278214',
          'external': '1337',
          'id': '153a4148-b28b-4ce3-813e-82d5c552e042',
          'internal': '1337',
          'name': 'parse-server',
          'protocol': 'tcp',
          'type': 'port-mapping',
        }

      }
    ]
  };

  class MockEditorService {
    k8sFile: K8sFile = new K8sFile();
    reportInvalidForm(sericeId, isInavalid) {
      // null
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: EditorService, useClass: MockEditorService },
        EditorEventService
      ],
      declarations: [ K8sServiceContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach( inject([EditorService], (editorService: EditorService) => {
    editorService.k8sFile.fromFlat(flat);
    expect(editorService.k8sFile.services.length).toBe(1);
    fixture = TestBed.createComponent(K8sServiceContainerComponent);
    component = fixture.componentInstance;
    component.service = editorService.k8sFile.services[0];
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe(`service's (top level items)`, () => {
    it(`name should autofill with value from editorService`, inject([EditorService], (editorService: EditorService) => {
      expect(editorService.k8sFile.services[0].name).toEqual('service-1');
      expect(component.form.value.name).toEqual('service-1');
    }));
    it(`name should be able to mutate value in editorService`, inject([EditorService], (editorService: EditorService) => {
      component.form.get('name').setValue('new service name one');
      expect(editorService.k8sFile.services[0].name).toEqual('new service name one');
    }));
    it(`service_type should autofill with value from editorService`, inject([EditorService], (editorService: EditorService) => {
      expect(editorService.k8sFile.services[0].service_type).toEqual('loadbalancer');
      expect(component.form.value.service_type).toEqual('loadbalancer');
    }));
    it(`service_type should be able to mutate value in editorService`, inject([EditorService], (editorService: EditorService) => {
      component.form.get('service_type').setValue('nodeport');
      expect(editorService.k8sFile.services[0].service_type).toEqual('nodeport');
    }));
    it(`cluster ip should autofill with value from editorService`, inject([EditorService], (editorService: EditorService) => {
      expect(editorService.k8sFile.services[0].cluster_ip).toEqual('1.1.1.1');
      expect(component.form.value.cluster_ip).toEqual('1.1.1.1');
    }));
    it(`cluster ip should be able to mutate value in editorService`, inject([EditorService], (editorService: EditorService) => {
      component.form.get('cluster_ip').setValue('2.2.2.2');
      expect(editorService.k8sFile.services[0].cluster_ip).toEqual('2.2.2.2');
    }));
  });

  it(`should add a selector when addSelector is called`, inject([EditorService], (editorService: EditorService) => {
    expect(editorService.k8sFile.services[0].selector.length).toEqual(1);
    component.addSelector();
    expect(editorService.k8sFile.services[0].selector.length).toEqual(2);
  }));

  it(`should remove a selector when removeSelector is called`, inject([EditorService], (editorService: EditorService) => {
    expect(editorService.k8sFile.services[0].selector.length).toEqual(1);
    component.removeSelector(0);
    expect(editorService.k8sFile.services[0].selector.length).toEqual(0);
  }));

  it(`should replace the list of selectors when handleBulkSelectorReplace is called`, inject([EditorService], (editorService: EditorService) => {
    expect(editorService.k8sFile.services[0].selector.length).toEqual(1);
    let bulkArray: Array<string[]>;
    bulkArray = [['key1', 'val1'], ['key2', 'val2'], ['key3', 'val3']];
    component.handleBulkSelectorReplace(bulkArray);
    expect(editorService.k8sFile.services[0].selector.length).toEqual(3);
  }));

  it(`should append a list of selectors to existing selectors when handleBulkSelectorAppend is called`, inject([EditorService], (editorService: EditorService) => {
    expect(editorService.k8sFile.services[0].selector.length).toEqual(1);
    let bulkArray: Array<string[]>;
    bulkArray = [['key1', 'val1'], ['key2', 'val2'], ['key3', 'val3']];
    component.handleBulkSelectorAppend(bulkArray);
    expect(editorService.k8sFile.services[0].selector.length).toEqual(4);
  }));

  it(`should add a serviceportmapping when addServicePortMapping is called`, inject([EditorService], (editorService: EditorService) => {

    expect(editorService.k8sFile.services[0].service_port_mapping.length).toEqual(0);
    const pm = new PortMapping();
    pm.external = '6666';
    pm.internal = '6379';
    pm.protocol = 'TCP';
    pm.svc_port_name = 'validname';
    pm.id = '123';
    component.addServicePortMapping(pm);
    expect(editorService.k8sFile.services[0].service_port_mapping.length).toEqual(1);

  }));

  it(`should have an error is service port mapping name is > 63`, inject([EditorService], (editorService: EditorService) => {

    expect(editorService.k8sFile.services[0].service_port_mapping.length).toEqual(0);
    const pm = new PortMapping();
    pm.external = '6666';
    pm.internal = '6379';
    pm.protocol = 'TCP';
    pm.svc_port_name = 'validnameasdfadsf';
    pm.id = '123';
    component.addServicePortMapping(pm);
    expect(editorService.k8sFile.services[0].service_port_mapping.length).toEqual(1);

    const form_array = component.form.get('service_port_mapping') as FormArray;

    expect(form_array.controls[0].get('name').hasError('maxLengthDNSLabel')).toBeFalsy();
    form_array.controls[0].get('name').setValue('0123456789012345678901234567890123456789012345678901234567890123');

    expect(form_array.controls[0].get('name').hasError('maxLengthDNSLabel')).toBeTruthy();

  }));
});
