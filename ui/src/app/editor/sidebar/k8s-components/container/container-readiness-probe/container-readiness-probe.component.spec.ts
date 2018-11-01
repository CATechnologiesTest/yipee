import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';

import { CustomValidators } from '../../../../../shared/validators/custom-validators.validators';
import { ContainerReadinessProbeComponent } from './container-readiness-probe.component';

describe('ContainerHealthcheckComponent', () => {
  let component: ContainerReadinessProbeComponent;
  let fixture: ComponentFixture<ContainerReadinessProbeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      imports: [ ReactiveFormsModule ],
      declarations: [ ContainerReadinessProbeComponent ],
      providers: [ FormBuilder ]
    })
    .compileComponents();
  }));

  beforeEach( inject([FormBuilder], (formBuilder: FormBuilder) => {
    fixture = TestBed.createComponent(ContainerReadinessProbeComponent);
    component = fixture.componentInstance;
    component.form = formBuilder.group({
      readinessProbe: formBuilder.group({
        interval: [{ value: 0, disabled: false }, [ /* add validations */ ]],
        retries: [{ value: 0, disabled: false }, [ /* add validations */ ]],
        timeout: [{ value: 0, disabled: false }, [ /* add validations */ ]],
        protocol: [{ value: 'http', disabled: false }, [ /* add validations */ ]],
        healthcmd: [{ value: 'null', disabled: false }, [
          CustomValidators.maxLength4096
        ]],
        httpGet: formBuilder.group({
          host: [{ value: 'host1', disabled: false }, [ /* add validations */ ]],
          port: [{ value: 'port1', disabled: false }, [ /* add validations */ ]],
          scheme: [{ value: 'scheme1', disabled: false }, [ /* add validations */ ]],
          path: [{ value: 'path1', disabled: false }, [ /* add validations */ ]],
          httpHeaders: formBuilder.array([])
        })
      })
    });
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
