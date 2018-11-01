import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';

import { IngressRuleComponent } from './ingress-rules.component';
import { EditorService } from '../../../../editor.service';
import { CustomValidators } from '../../../../../shared/validators/custom-validators.validators';
import { Ingress } from '../../../../../models/k8s/Ingress';
import { K8sFile } from '../../../../../models/k8s/K8sFile';

describe('IngressTlsComponent', () => {
  let component: IngressRuleComponent;
  let fixture: ComponentFixture<IngressRuleComponent>;

  const flat = {
    'ingress': [
      {
        'id': 'acf86b34-8399-4e6c-9098-f4b5e33b186a',
        'metadata':
        {
          'name': 'name1',
          'annotations':
          {
            'annoname': 'annovalue'
          },
          'labels':
          {
            'labelname': 'labelvalue'
          }
        },
        'spec':
        {
          'tls':
            [{
              hosts:
                [
                  'host23'
                ],
              secretName: 'secretName'
            }],
          'backend':
          {
            'service-id': '-- Select a service --',
            'servicePort': 0
          },
          'rules':
            [{
              'host': 'host1',
              'http':
              {
                'paths':
                  [{
                    'path': 'path1',
                    'backend':
                    {
                      'service-id': '-- Select a service --',
                      'servicePort': 0
                    }
                  }]
              }
            }]
        },
        'type': 'ingress'
      }

    ]
  };

  class MockEditorService {
    k8sFile: K8sFile = new K8sFile();

    reportInvalidForm(volumeId, isInavalid) {

    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [ IngressRuleComponent ],
      providers: [
        FormBuilder,
        Ingress,
        { provide: EditorService, useClass: MockEditorService }
      ]
    })
    .compileComponents();
  }));

  beforeEach( inject([FormBuilder, EditorService, Ingress], (formBuilder: FormBuilder, editorService: EditorService, ingress: Ingress) => {
    fixture = TestBed.createComponent(IngressRuleComponent);
    component = fixture.componentInstance;
    editorService.k8sFile.fromFlat(flat);
    expect(editorService.k8sFile.ingress.length).toBe(1);
    component.ingress = editorService.k8sFile.ingress[0];

    component.form = formBuilder.group({
      name: [{ value: 'name1', disabled: false }, [
        Validators.required,
        CustomValidators.maxLength253,
        CustomValidators.lowercaseAlphaNumericDashPeriod,
        CustomValidators.startsWithDash,
        CustomValidators.endsWithDash,
        CustomValidators.startsWithPeriod,
        CustomValidators.endsWithPeriod,
        CustomValidators.duplicateK8sNameValidator(editorService, 'ingress')
      ]],
      description: [{ value: 'a description', disabled: false }, [ /* add validations */]],
      labels: formBuilder.array([]),
      annotations: formBuilder.array([
        formBuilder.group({
          key: [{ value: 'key1', disabled: false }, [
            Validators.required,
            CustomValidators.lowercaseAlphaNumericDashPeriodSlash,
            CustomValidators.containsDoublePeriod,
            CustomValidators.containsDoubleDash
          ]],
          value: [{ value: 'value1', disabled: false }, [
            Validators.required
          ]],
          id: [{ value: '1234', disabled: true }]
        })
      ]),
      backend_service_id: [{ value: '-- Select a service --', disabled: false }, [
        Validators.required,
        CustomValidators.containsSelectAService
      ]],
      backend_service_port: [{ value: '9999', disabled: false }, [
        Validators.required,
        CustomValidators.numericPortRangeIncludesZero
      ]],
      tls: formBuilder.array([]),
      rule: formBuilder.array([
        formBuilder.group({
          host: [{ value: 'ruleHost1', disabled: false }, [
            Validators.required,
            CustomValidators.dnsValidator
          ]],
          paths: formBuilder.array([
            formBuilder.group({
              path: [{ value: 'path1', disabled: false }, [
                Validators.required
              ]],
              service: [{ value: 'service1', disabled: false }, [
                Validators.required,
                CustomValidators.containsSelectAService
              ]],
              port: [{ value: '9090', disabled: false }, [
                Validators.required,
                CustomValidators.numericPortRangeIncludesZero
              ]],
              id: [{ value: '789789', disabled: false }]
            })
          ]),
          id: [{ value: 8888, disabled: false }]
        })
      ])
      /* NOTE: YOU ADD MORE FORM FIELDS HERE, COMMENTING SECTIONS */
    });


    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get rule when rule is called', () => {
    const currentRule = component.rule;
    expect(currentRule.length).toEqual(1);
  });

  it('should emit a true value when handleAddRule is called', () => {
    component.addRule.subscribe ((value: boolean) => {
      expect(value).toBeDefined();
      expect(value).toEqual(true);
    });
    component.handleAddRule();
  });

  it('should emit an index value when handleRemoveRule is called', () => {
    component.removeRule.subscribe ((value: number) => {
      expect(value).toBeDefined();
      expect(value).toEqual(89);
    });
    component.handleRemoveRule(89);
  });

  it('should emit an index when handleAddPath is called', () => {
    component.addPath.subscribe ((value: number) => {
      expect(value).toBeDefined();
      expect(value).toEqual(5);
    });
    component.handleAddPath(5);
  });

  it('should emit a rule path object when handleRemovePath is called', () => {
    component.removePath.subscribe ((rulePathObject: any) => {
      expect(rulePathObject).toBeDefined();
      expect(rulePathObject.ruleIndex).toEqual(5);
      expect(rulePathObject.pathIndex).toEqual(7);
    });
    component.handleRemovePath(5, 7);
  });

});
