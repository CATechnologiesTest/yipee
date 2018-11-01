import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';

import { IngressBackendComponent } from './ingress-backend.component';
import { EditorService } from '../../../../editor.service';
import { CustomValidators } from '../../../../../shared/validators/custom-validators.validators';
import { Ingress } from '../../../../../models/k8s/Ingress';
import { K8sFile } from '../../../../../models/k8s/K8sFile';

describe('IngressBackendComponent', () => {
  let component: IngressBackendComponent;
  let fixture: ComponentFixture<IngressBackendComponent>;

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
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [IngressBackendComponent],
      providers: [
        FormBuilder,
        Ingress,
        { provide: EditorService, useClass: MockEditorService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(inject([FormBuilder, EditorService, Ingress], (formBuilder: FormBuilder, editorService: EditorService, ingress: Ingress) => {
    fixture = TestBed.createComponent(IngressBackendComponent);
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
      rule: formBuilder.array([])
      /* NOTE: YOU ADD MORE FORM FIELDS HERE, COMMENTING SECTIONS */
    });

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
