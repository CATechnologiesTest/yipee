import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormsModule, FormBuilder, ReactiveFormsModule, FormArray, FormGroup, FormControl } from '@angular/forms';

import { UnknownKindContainerComponent } from './unknown-kind-container.component';
import { UnknownKind } from '../../../../models/k8s/UnknownKind';
import { EditorEventService } from '../../../editor-event.service';
import { EditorService } from '../../../editor.service';

describe(`k8s Sidebar, 'unknown kind' panel`, () => {
  let component: UnknownKindContainerComponent;
  let fixture: ComponentFixture<UnknownKindContainerComponent>;

  class MockEditorService {
    k8sFile = {
      services: [],
      containerGroups: [],
      unknownKinds: [],
      volumes: [],
      ingress: []
    };

    reportInvalidForm(id: string, isInvalid: boolean) {

    }
  }

  class Init {
    static returnTestUnknownKind(): UnknownKind {
      const uk: UnknownKind = new UnknownKind;

      return uk;
    }

    static returnGoodYaml(): string {
      const yaml = `
        apiVersion: v1
        kind: Servic
        metadata:
          name: dep
          annotations:
            yipee.io.lastModelUpdate: '2018-08-23T20:23:15.230Z'
            yipee.io.modelId: 235787a0-a712-11e8-aef1-771f3af8295b
            yipee.io.contextId: e2a41718-129d-11e8-9237-5fd92cf7c649
            yipee.io.modelURL: https://app.yipee.io/editor/235787a0-a712-11e8-aef1-771f3af8295b/e2a41718-129d-11e8-9237-5fd92cf7c649
        spec:
          selector:
            test: test1
          ports:
          - port: 420
            targetPort: 420
            name: test2
            protocol: TCP
          type: ClusterIP`;

          return yaml;
    }

    static returnBadYaml(): string {
      // error is the colon char on the kind field
      const yaml = `
        apiVersion: v1
        kind: Servic:
        metadata:
          name: dep
          annotations:
            yipee.io.lastModelUpdate: '2018-08-23T20:23:15.230Z'
            yipee.io.modelId: 235787a0-a712-11e8-aef1-771f3af8295b
            yipee.io.contextId: e2a41718-129d-11e8-9237-5fd92cf7c649
            yipee.io.modelURL: https://app.yipee.io/editor/235787a0-a712-11e8-aef1-771f3af8295b/e2a41718-129d-11e8-9237-5fd92cf7c649
        spec:
          selector:
            test: test1
          ports:
          - port: 420
            targetPort: 420
            name: test2
            protocol: TCP
          type: ClusterIP`;

          return yaml;
    }

    static returnBadYamlName(): string {
      // error is the colon char on the kind field
      const yaml = `
        apiVersion: v1
        kind: Service
        metadata:
          annotations:
            yipee.io.lastModelUpdate: '2018-08-23T20:23:15.230Z'
            yipee.io.modelId: 235787a0-a712-11e8-aef1-771f3af8295b
            yipee.io.contextId: e2a41718-129d-11e8-9237-5fd92cf7c649
            yipee.io.modelURL: https://app.yipee.io/editor/235787a0-a712-11e8-aef1-771f3af8295b/e2a41718-129d-11e8-9237-5fd92cf7c649
        spec:
          selector:
            test: test1
          ports:
          - port: 420
            targetPort: 420
            name: test2
            protocol: TCP
          type: ClusterIP`;

          return yaml;
    }

    static returnBadYamlKind(): string {
      // error is the colon char on the kind field
      const yaml = `
        apiVersion: v1
        metadata:
          name: dep
          annotations:
            yipee.io.lastModelUpdate: '2018-08-23T20:23:15.230Z'
            yipee.io.modelId: 235787a0-a712-11e8-aef1-771f3af8295b
            yipee.io.contextId: e2a41718-129d-11e8-9237-5fd92cf7c649
            yipee.io.modelURL: https://app.yipee.io/editor/235787a0-a712-11e8-aef1-771f3af8295b/e2a41718-129d-11e8-9237-5fd92cf7c649
        spec:
          selector:
            test: test1
          ports:
          - port: 420
            targetPort: 420
            name: test2
            protocol: TCP
          type: ClusterIP`;

          return yaml;
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        EditorEventService,
        FormBuilder,
        { provide: EditorService, useClass: MockEditorService }
      ],
      declarations: [UnknownKindContainerComponent]
    })
      .compileComponents();
  }));

  beforeEach(inject([EditorService], (editorService: EditorService) => {
    fixture = TestBed.createComponent(UnknownKindContainerComponent);
    component = fixture.componentInstance;
    component.unknownKind = Init.returnTestUnknownKind();
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.unknownKind.name).toEqual('Custom');
  });

  it('should load good yaml body', () => {
    expect(component).toBeTruthy();
    component.unknownKind.body = Init.returnGoodYaml();
    expect(component.unknownKind.name).toEqual('dep');
    expect(component.unknownKind.kind).toEqual('Servic');
    expect(component.unknownKind.error.message).toEqual(null);
    expect(component.unknownKind.error.name).toEqual(null);
  });

  it('should report bad yaml body', () => {
    expect(component).toBeTruthy();
    component.unknownKind.body = Init.returnGoodYaml();
    expect(component.unknownKind.name).toEqual('dep');
    expect(component.unknownKind.kind).toEqual('Servic');
    component.unknownKind.body = Init.returnBadYaml();
    expect(component.unknownKind.name).toEqual('dep');
    expect(component.unknownKind.kind).toEqual('Servic');
    expect(component.unknownKind.error.message).toContain('incomplete explicit mapping pair;');
    expect(component.unknownKind.error.name).toEqual('YAMLException');
  });

  it('should report bad yaml name', () => {
    expect(component).toBeTruthy();
    component.unknownKind.body = Init.returnBadYamlName();
    expect(component.unknownKind.name).toEqual('Custom');
    expect(component.unknownKind.kind).toEqual('Service');
    expect(component.error.message).toContain('Unknown kind YAML must contain "kind" and "name" parameters.');
    expect(component.error.name).toEqual('Error');
  });

  it('should report bad yaml kind', () => {
    expect(component).toBeTruthy();
    component.unknownKind.body = Init.returnBadYamlKind();
    expect(component.unknownKind.name).toEqual('dep');
    expect(component.unknownKind.kind).toEqual('Unknown');
    expect(component.error.message).toContain('Unknown kind YAML must contain "kind" and "name" parameters.');
    expect(component.error.name).toEqual('Error');
  });
});
