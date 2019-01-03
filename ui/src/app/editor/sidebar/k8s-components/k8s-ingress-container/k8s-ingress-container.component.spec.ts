import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormsModule, FormBuilder, ReactiveFormsModule, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';

import { K8sIngressContainerComponent } from './k8s-ingress-container.component';
import { EditorService } from '../../../editor.service';
import { EditorEventService } from '../../../editor-event.service';
import { K8sFile } from '../../../../models/k8s/K8sFile';
import { Ingress, IngressPath } from '../../../../models/k8s/Ingress';
import { CustomValidators } from '../../../../shared/validators/custom-validators.validators';
import { Label } from '../../../../models/common/Label';

describe('IngressComponent', () => {
  let component: K8sIngressContainerComponent;
  let fixture: ComponentFixture<K8sIngressContainerComponent>;

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
      declarations: [K8sIngressContainerComponent],
      providers: [
        FormBuilder,
        Ingress,
        Label,
        { provide: EditorService, useClass: MockEditorService },
        EditorEventService
      ]
    })
      .compileComponents();
  }));

  beforeEach(inject([FormBuilder, EditorService, Ingress], (formBuilder: FormBuilder, editorService: EditorService, ingress: Ingress) => {

    fixture = TestBed.createComponent(K8sIngressContainerComponent);
    component = fixture.componentInstance;
    editorService.k8sFile.fromFlat(flat);
    expect(editorService.k8sFile.ingress.length).toBe(1);
    component.ingress = editorService.k8sFile.ingress[0];
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a label when addLabel() is called', () => {
    expect(component.ingress.labels.length).toEqual(1);
    expect((component.form.controls.labels as FormArray).length).toEqual(1);
    component.addLabel();
    expect(component.ingress.labels.length).toEqual(2);
    expect((component.form.controls.labels as FormArray).length).toEqual(2);
  });

  it('should recreate labels when recreateLabels() is called', () => {
    expect(component.ingress.labels.length).toEqual(1);
    expect((component.form.controls.labels as FormArray).length).toEqual(1);
    component.addLabel();
    component.recreateLabels();
    expect(component.ingress.labels.length).toEqual(2);
    expect((component.form.controls.labels as FormArray).length).toEqual(2);
  });

  it('should remove the label at the index given when removeLabel() is called', () => {
    expect(component.ingress.labels.length).toEqual(1);
    expect((component.form.controls.labels as FormArray).length).toEqual(1);
    component.addLabel();
    expect(component.ingress.labels.length).toEqual(2);
    expect((component.form.controls.labels as FormArray).length).toEqual(2);
    component.removeLabel(0);
    expect(component.ingress.labels.length).toEqual(1);
    expect((component.form.controls.labels as FormArray).length).toEqual(1);
    expect(component.ingress.labels[0].key).toEqual('');
    expect(component.ingress.labels[0].value).toEqual('');
    expect((component.form.controls.labels as FormArray).controls[0].value).toEqual({ key: '', value: '' });
  });

  it('should add an annotation when addAnnotation() is called', () => {
    expect(component.ingress.annotations.length).toEqual(1);
    expect((component.form.controls.annotations as FormArray).length).toEqual(1);
    component.addAnnotation();
    expect(component.ingress.annotations.length).toEqual(2);
    expect((component.form.controls.annotations as FormArray).length).toEqual(2);
  });

  it('should recreate annotations when recreateAnnotations() is called', () => {
    expect(component.ingress.annotations.length).toEqual(1);
    expect((component.form.controls.annotations as FormArray).length).toEqual(1);
    component.addAnnotation();
    component.recreateAnnotations();
    expect(component.ingress.annotations.length).toEqual(2);
    expect((component.form.controls.annotations as FormArray).length).toEqual(2);
  });

  it('should remove the annotation at the index given when removeAnnotation() is called', () => {
    expect(component.ingress.annotations.length).toEqual(1);
    expect((component.form.controls.annotations as FormArray).length).toEqual(1);
    component.addAnnotation();
    expect(component.ingress.annotations.length).toEqual(2);
    expect((component.form.controls.annotations as FormArray).length).toEqual(2);
    component.removeAnnotation(0);
    expect(component.ingress.annotations.length).toEqual(1);
    expect((component.form.controls.annotations as FormArray).length).toEqual(1);
    expect(component.ingress.annotations[0].key).toEqual('');
    expect(component.ingress.annotations[0].value).toEqual('');
    expect((component.form.controls.annotations as FormArray).controls[0].value).toEqual({ key: '', value: '' });
  });

  it('should add a TLS when addTLS() is called', () => {
    expect(component.ingress.tls.length).toEqual(1);
    expect((component.form.controls.tls as FormArray).length).toEqual(1);
    component.addTLS();
    expect(component.ingress.tls.length).toEqual(2);
    expect((component.form.controls.tls as FormArray).length).toEqual(2);
  });

  it('should recreate TLS when recreateTLS() is called', () => {
    expect(component.ingress.tls.length).toEqual(1);
    expect((component.form.controls.tls as FormArray).length).toEqual(1);
    component.addTLS();
    component.recreateTls();
    expect(component.ingress.tls.length).toEqual(2);
    expect((component.form.controls.tls as FormArray).length).toEqual(2);
  });

  it('should remove the TLS at the index given when removeTLS() is called', () => {
    expect(component.ingress.tls.length).toEqual(1);
    expect((component.form.controls.tls as FormArray).length).toEqual(1);
    component.addTLS();
    expect(component.ingress.tls.length).toEqual(2);
    expect((component.form.controls.tls as FormArray).length).toEqual(2);
    component.removeTLS(0);
    expect(component.ingress.tls.length).toEqual(1);
    expect((component.form.controls.tls as FormArray).length).toEqual(1);
    expect(component.ingress.tls[0].secret_name).toEqual('');
    expect(component.ingress.tls[0].hosts).toEqual('');
    expect((component.form.controls.tls as FormArray).controls[0].value).toEqual({ secret_name: '', hosts: '' });
  });

  it('should add a rule when addRule() is called', () => {
    expect(component.ingress.rules.length).toEqual(1);
    expect((component.form.controls.rule as FormArray).length).toEqual(1);
    component.addRule();
    expect(component.ingress.rules.length).toEqual(2);
    expect((component.form.controls.rule as FormArray).length).toEqual(2);
  });

  it('should recreate Rules when recreateRule() is called', () => {
    expect(component.ingress.rules.length).toEqual(1);
    expect((component.form.controls.rule as FormArray).length).toEqual(1);
    component.addRule();
    component.recreateRule();
    expect(component.ingress.rules.length).toEqual(2);
    expect((component.form.controls.rule as FormArray).length).toEqual(2);
  });

  it('should remove the rule at the index given when removeRule() is called', () => {
    expect(component.ingress.rules.length).toEqual(1);
    expect((component.form.controls.rule as FormArray).length).toEqual(1);
    component.addRule();
    expect(component.ingress.rules.length).toEqual(2);
    expect((component.form.controls.rule as FormArray).length).toEqual(2);
    const newRuleId = (component.form.controls.rule as FormArray).controls[1].value.id;
    component.removeRule(0);
    expect(component.ingress.rules.length).toEqual(1);
    expect((component.form.controls.rule as FormArray).length).toEqual(1);
    expect(component.ingress.rules[0].host).toEqual('');
    expect(component.ingress.rules[0].paths).toEqual([]);
    expect((component.form.controls.rule as FormArray).controls[0].value).toEqual({ host: '', paths: [], id: newRuleId });
  });

  it('should add a blank path to a rule when addNewPath() is called with the rule index', () => {
    expect(component.ingress.rules[0].paths.length).toEqual(1);
    expect(((component.form.controls.rule) as FormArray).controls[0].value.paths.length).toEqual(1);
    component.addNewPath(0);
    expect(component.ingress.rules[0].paths.length).toEqual(2);
    expect(((component.form.controls.rule) as FormArray).controls[0].value.paths.length).toEqual(2);
  });

  it('should add a prepopulated path to a rule when addExistingPath() is called with the rule index', () => {
    expect(component.ingress.rules[0].paths.length).toEqual(1);
    expect(((component.form.controls.rule) as FormArray).controls[0].value.paths.length).toEqual(1);
    const path = new IngressPath();
    path.id = '79e985f4-3f12-4322-a6cd-38ec76bdfe22';
    path.path = 'path1';
    path.service_id = '-- Select a service --';
    path.service_port = 9090;
    const newPath = component.addExistingPath(path);
    component.ingress.rules[0].paths.push(path);
    ((((component.form.controls.rule) as FormArray).controls[0] as FormGroup).controls.paths as FormArray).push(newPath);
    expect(component.ingress.rules[0].paths.length).toEqual(2);
    expect(((component.form.controls.rule) as FormArray).controls[0].value.paths.length).toEqual(2);
  });

  it('should remove the path at the rule and path index given when removePath() is called', () => {

    expect(component.ingress.rules[0].paths.length).toEqual(1);
    expect(((component.form.controls.rule) as FormArray).controls[0].value.paths.length).toEqual(1);
    component.addNewPath(0);
    expect(component.ingress.rules[0].paths.length).toEqual(2);
    expect(((component.form.controls.rule) as FormArray).controls[0].value.paths.length).toEqual(2);
    const newPathId = (((component.form.controls.rule as FormArray).controls[0] as FormGroup).controls.paths as FormArray).controls[1].value.id;
    const rulePathObject = {
      ruleIndex: 0,
      pathIndex: 0
    };
    component.removePath(rulePathObject);
    expect(component.ingress.rules[0].paths.length).toEqual(1);
    expect(((component.form.controls.rule) as FormArray).controls[0].value.paths.length).toEqual(1);
    expect(component.ingress.rules[0].paths[0].path).toEqual('');
    expect(component.ingress.rules[0].paths[0].service_id).toEqual('-- Select a service --');
    expect(component.ingress.rules[0].paths[0].service_port).toEqual(1);
    expect(component.ingress.rules[0].paths[0].id).toEqual(newPathId);
    expect((((component.form.controls.rule as FormArray).controls[0] as FormGroup).controls.paths as FormArray).controls[0].value).toEqual({ id: newPathId, path: '', port: 1, service: '-- Select a service --' });
  });

});
