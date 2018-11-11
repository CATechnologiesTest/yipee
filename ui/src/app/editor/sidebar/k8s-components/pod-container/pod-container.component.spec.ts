import { NO_ERRORS_SCHEMA, EventEmitter } from '@angular/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormBuilder, FormArray, FormGroup, FormControl } from '@angular/forms';
import { Subject } from 'rxjs/Subject';

import { PodContainerComponent } from './pod-container.component';
import { EditorEventService } from '../../../editor-event.service';
import { EditorService } from '../../../editor.service';
import { Label } from '../../../../models/common/Label';
import { TopLabel } from '../../../../models/k8s/TopLabel';
import { Service as k8sService } from '../../../../models/k8s/Service';
import { K8sFile } from '../../../../models/k8s/K8sFile';
import { ContainerGroup } from '../../../../models/common/ContainerGroup';


describe('PodContainerComponent', () => {

  class Initialize {

    static k8sFile: K8sFile;
    static getK8sFile(): K8sFile {
      Initialize.k8sFile = new K8sFile();
      return Initialize.k8sFile;
    }
    static constructStatefulSet(): ContainerGroup {
      const cgroup = ContainerGroup.construct(ContainerGroup.OBJECT_NAME) as ContainerGroup;
      Initialize.k8sFile.push(cgroup);
      cgroup.name = 'pod name one';
      cgroup.description = 'description one';
      cgroup.restart = 'Always';
      cgroup.deployment_spec.count = 4;
      cgroup.deployment_spec.service_name = 'service name 1';
      cgroup.deployment_spec.termination_grace_period = 544;
      cgroup.deployment_spec.update_strategy = 'RollingUpdate';
      cgroup.deployment_spec.pod_management_policy = 'OrderedReady';
      cgroup.deployment_spec.controller_type = 'StatefulSet';
      cgroup.deployment_spec.image_pull_secrets = [];
      cgroup.deployment_spec.service_account_name = 'san';
      const label1 = new Label();
      label1.key = 'l1key', label1.value = 'l1value';
      const label2 = new Label();
      label2.key = 'l2key', label2.value = 'l3value';
      cgroup.addLabel(label1);
      cgroup.addLabel(label2);
      const toplabel1 = new TopLabel();
      toplabel1.key = 'topl1key', toplabel1.value = 'topl1value';
      const toplabel2 = new TopLabel();
      toplabel2.key = 'topl2key', toplabel2.value = 'topl3value';
      cgroup.addTopLabel(toplabel1);
      cgroup.addTopLabel(toplabel2);
      cgroup.extra_hosts = ['exhost1', 'exhost2'];

      return cgroup;
    }

  }

  let component: PodContainerComponent;
  let fixture: ComponentFixture<PodContainerComponent>;

  class MockEditorService {
    k8sFile = Initialize.getK8sFile();

    returnServiceMapByContainerGroupId(containerGroupId) {
      return [];
    }

    reportInvalidForm(containerId, isValid) {
      // null
    }
  }

  class MockEditorEventService {
    public onPodLabelsChanged = new Subject<ContainerGroup>();
    onGenericTrack: EventEmitter<string> = new EventEmitter();
    public onServiceModelOnRefresh = new Subject<k8sService>();
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        EditorEventService,
        FormBuilder,
        { provide: EditorService, useClass: MockEditorService },
        { provide: EditorEventService, useClass: MockEditorEventService }

      ],
      declarations: [ PodContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach( inject([EditorService], (editorService: EditorService) => {
    fixture = TestBed.createComponent(PodContainerComponent);
    component = fixture.componentInstance;

    Initialize.constructStatefulSet();
    component.pod = editorService.k8sFile.containerGroups[0];
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe(`pod's (top level items)`, () => {
    it(`name should autofill with value from editorService`, inject([EditorService], (editorService: EditorService) => {
      expect(editorService.k8sFile.containerGroups[0].name).toEqual('pod name one');
      expect(component.form.value.name).toEqual('pod name one');
    }));
    it(`name should be able to mutate value in editorService`, inject([EditorService], (editorService: EditorService) => {
      component.form.get('name').setValue('new pod name');
      expect(editorService.k8sFile.containerGroups[0].name).toEqual('new pod name');
    }));
    it(`description should autofill with value from editorService`, inject([EditorService], (editorService: EditorService) => {
      expect(editorService.k8sFile.containerGroups[0].description).toEqual('description one');
      expect(component.form.value.description).toEqual('description one');
    }));
    it(`description should be able to mutate value in editorService`, inject([EditorService], (editorService: EditorService) => {
      component.form.get('description').setValue('new pod description');
      expect(editorService.k8sFile.containerGroups[0].description).toEqual('new pod description');
    }));
  });

  describe(`pod's deployment spec items`, () => {
    it(`deployment_spec.count should autofill with value from editorService`, inject([EditorService], (editorService: EditorService) => {
      expect(editorService.k8sFile.containerGroups[0].deployment_spec.count).toEqual(4);
      expect(component.form.value.replicas).toEqual(4);
    }));
    it(`deployment_spec.count should be able to mutate value in editorService`, inject([EditorService], (editorService: EditorService) => {
      (component.form.get('replicas') as FormControl).setValue(9);
      expect(component.form.value.replicas).toEqual(9);
      expect(editorService.k8sFile.containerGroups[0].deployment_spec.count).toEqual(9);
    }));
    it(`deployment_spec.service_name should autofill with value from editorService`, inject([EditorService], (editorService: EditorService) => {
      expect(editorService.k8sFile.containerGroups[0].deployment_spec.service_name).toEqual('service name 1');
      expect(component.form.get('service_name').value).toEqual('service name 1');
    }));
    it(`deployment_spec.termination_grace_period should autofill with value from editorService`, inject([EditorService], (editorService: EditorService) => {
      expect(editorService.k8sFile.containerGroups[0].deployment_spec.termination_grace_period).toEqual(544);
      expect(component.form.value.grace_period).toEqual(544);
    }));
    it(`deployment_spec.termination_grace_period should be able to mutate value in editorService`, inject([EditorService], (editorService: EditorService) => {
      (component.form.get('grace_period') as FormControl).setValue(243);
      expect(component.form.value.grace_period).toEqual(243);
      expect(editorService.k8sFile.containerGroups[0].deployment_spec.termination_grace_period).toEqual(243);
    }));
    it(`deployment_spec.update_strategy should autofill with value from editorService`, inject([EditorService], (editorService: EditorService) => {
      expect(editorService.k8sFile.containerGroups[0].deployment_spec.update_strategy).toEqual('RollingUpdate');
      expect(component.form.value.update_strategy).toEqual('RollingUpdate');
    }));
    it(`deployment_spec.update_strategy should be able to mutate value in editorService`, inject([EditorService], (editorService: EditorService) => {
      (component.form.get('update_strategy') as FormControl).setValue('Partition');
      expect(component.form.value.update_strategy).toEqual('Partition');
      expect(editorService.k8sFile.containerGroups[0].deployment_spec.update_strategy).toEqual('Partition');
    }));
    it(`deployment_spec.pod_management should autofill with value from editorService`, inject([EditorService], (editorService: EditorService) => {
      expect(editorService.k8sFile.containerGroups[0].deployment_spec.pod_management_policy).toEqual('OrderedReady');
      expect(component.form.value.pod_management).toEqual('OrderedReady');
    }));
    it(`deployment_spec.pod_management should be able to mutate value in editorService`, inject([EditorService], (editorService: EditorService) => {
      (component.form.get('pod_management') as FormControl).setValue('Parallel');
      expect(component.form.value.pod_management).toEqual('Parallel');
      expect(editorService.k8sFile.containerGroups[0].deployment_spec.pod_management_policy).toEqual('Parallel');
    }));
    it(`deployment_spec.pod_management should autofill with value from editorService`, inject([EditorService], (editorService: EditorService) => {
      expect(editorService.k8sFile.containerGroups[0].restart).toEqual('Always');
      expect(component.form.value.restart).toEqual('Always');
    }));
    it(`deployment_spec.pod_management should be able to mutate value in editorService`, inject([EditorService], (editorService: EditorService) => {
      (component.form.get('restart') as FormControl).setValue('Never');
      expect(component.form.value.restart).toEqual('Never');
      expect(editorService.k8sFile.containerGroups[0].restart).toEqual('Never');
    }));
  });

  describe(`pod's deployment label`, () => {
    it('should autofill with the values from editor service', inject([EditorService], (editorService: EditorService) => {
      const labelControl = component.form.get('label') as FormArray;
      expect(labelControl.value.length).toEqual(2);
      expect(labelControl.value[0].key).toEqual('l1key');
      expect(labelControl.value[0].value).toEqual('l1value');
    }));
    it('should be able to create a label formGroup', inject([EditorService], (editorService: EditorService) => {
      const testLabel = new Label();
      testLabel.key = 'keykeykey', testLabel.value = 'valuevalue';
      const testSubject = component.createLabel(testLabel);
      expect(testSubject).toEqual(jasmine.any(FormGroup));
      expect(testSubject.value.key).toEqual('keykeykey');
      expect(testSubject.value.value).toEqual('valuevalue');
    }));
    it('should be able to remove a label to the editor service and this.form', inject([EditorService], (editorService: EditorService) => {
      const labelControl = component.form.get('label') as FormArray;
      expect(labelControl.value.length).toEqual(2);
      expect(labelControl.value[0].key).toEqual('l1key');
      expect(labelControl.value[0].value).toEqual('l1value');
      component.removeLabel(0);
      expect(labelControl.value.length).toEqual(1);
      expect(labelControl.value[0].key).toEqual('l2key');
      expect(labelControl.value[0].value).toEqual('l3value');
    }));
    it('should be able to add a new label to the editor service and this.form', inject([EditorService], (editorService: EditorService) => {
      const labelControl = component.form.get('label') as FormArray;
      expect(labelControl.value.length).toEqual(2);
      component.addLabel();
      expect(labelControl.value.length).toEqual(3);
      expect(editorService.k8sFile.containerGroups[0].label.length).toEqual(3);
    }));
  });

  describe(`pod's deployment top_label`, () => {
    it('should autofill with the values from editor service', inject([EditorService], (editorService: EditorService) => {
      const topLabelControl = component.form.get('top_label') as FormArray;
      expect(topLabelControl.value.length).toEqual(2);
      expect(topLabelControl.value[0].key).toEqual('topl1key');
      expect(topLabelControl.value[0].value).toEqual('topl1value');
    }));
    it('should be able to create a top_label formGroup', inject([EditorService], (editorService: EditorService) => {
      const testTopLabel = new TopLabel();
      testTopLabel.key = 'topkey', testTopLabel.value = 'topvalue';
      const testSubject = component.createTopLabel(testTopLabel);
      expect(testSubject).toEqual(jasmine.any(FormGroup));
      expect(testSubject.value.key).toEqual('topkey');
      expect(testSubject.value.value).toEqual('topvalue');
    }));
    it('should be able to remove a top_label to the editor service and this.form', inject([EditorService], (editorService: EditorService) => {
      const topLabelControl = component.form.get('top_label') as FormArray;
      expect(topLabelControl.value.length).toEqual(2);
      expect(topLabelControl.value[0].key).toEqual('topl1key');
      expect(topLabelControl.value[0].value).toEqual('topl1value');
      component.removeTopLabel(0);
      expect(topLabelControl.value.length).toEqual(1);
      expect(topLabelControl.value[0].key).toEqual('topl2key');
      expect(topLabelControl.value[0].value).toEqual('topl3value');
    }));
    it('should be able to add a new top_label to the editor service and this.form', inject([EditorService], (editorService: EditorService) => {
      const topLabelControl = component.form.get('top_label') as FormArray;
      expect(topLabelControl.value.length).toEqual(2);
      component.addTopLabel();
      expect(topLabelControl.value.length).toEqual(3);
      expect(editorService.k8sFile.containerGroups[0].top_label.length).toEqual(3);
    }));
  });

  describe(`pod's deployment extra_hosts`, () => {
    it('should autofill with the values from editor service', inject([EditorService], (editorService: EditorService) => {
      const extraHostsControl = component.form.get('extra_hosts') as FormArray;
      expect(extraHostsControl.value.length).toEqual(2);
      expect(extraHostsControl.value[0]).toEqual('exhost1');
      expect(extraHostsControl.value[1]).toEqual('exhost2');
    }));
    it('should be able to create a top_label formControl', inject([EditorService], (editorService: EditorService) => {
      const testSubject = component.createExtraHost('textexhost');
      expect(testSubject).toEqual(jasmine.any(FormControl));
      expect(testSubject.value).toEqual('textexhost');
    }));
    it('should be able to add a new extra_host to the editor service and this.form', inject([EditorService], (editorService: EditorService) => {
      const extraHostsControl = component.form.get('extra_hosts') as FormArray;
      component.addExtraHost('testexhostwefwe');
      expect(extraHostsControl.value.length).toEqual(3);
      expect(extraHostsControl.value[0]).toEqual('exhost1');
      expect(extraHostsControl.value[1]).toEqual('exhost2');
      expect(extraHostsControl.value[2]).toEqual('testexhostwefwe');
    }));
    it('should be able to remove a extra_host from the editor service and this.form', inject([EditorService], (editorService: EditorService) => {
      const extraHostsControl = component.form.get('extra_hosts') as FormArray;
      component.removeExtraHost(0);
      expect(extraHostsControl.value.length).toEqual(1);
      expect(extraHostsControl.value[0]).toEqual('exhost2');
    }));
  });
});
