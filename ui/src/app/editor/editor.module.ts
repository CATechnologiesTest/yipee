import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DndModule } from 'ng2-dnd';

import { EditorComponent } from './editor.component';
import { SharedModule } from '../shared/shared.module';
import { CanvasComponent } from './canvas/canvas.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SidebarGroupComponent } from './sidebar/sidebar-group.component';
import { SidebarPanelComponent } from './sidebar/sidebar-panel.component';
import { EditorService } from './editor.service';
import { EditorEventService } from './editor-event.service';

// Nerdmode Components
import { NerdmodeContainerComponent } from './sidebar/components/nerdmode-container/nerdmode-container.component';
import { NerdmodeViewerComponent } from './sidebar/components/nerdmode/nerdmode-viewer/nerdmode-viewer.component';

// k8s related components
import { ContainerContainerComponent } from './sidebar/k8s-components/container-container/container-container.component';
import { PodContainerComponent } from './sidebar/k8s-components/pod-container/pod-container.component';
import { ContainerEnvironmentVariablesComponent } from './sidebar/k8s-components/container/container-environment-variables/container-environment-variables.component';
import { ContainerPortsComponent } from './sidebar/k8s-components/container/container-ports/container-ports.component';
import { ContainerLivenessProbeComponent } from './sidebar/k8s-components/container/container-liveness-probe/container-liveness-probe.component';
import { ContainerReadinessProbeComponent } from './sidebar/k8s-components/container/container-readiness-probe/container-readiness-probe.component';
import { ContainerAdvancedComponent } from './sidebar/k8s-components/container/container-advanced/container-advanced.component';
import { ContainerVolumesComponent } from './sidebar/k8s-components/container/container-volumes/container-volumes.component';
import { ContainerEmptyDirsComponent } from './sidebar/k8s-components/container/container-empty-dirs/container-empty-dirs.component';
import { ContainerHostPathsComponent } from './sidebar/k8s-components/container/container-host-paths/container-host-paths.component';
import { PodLabelsComponent } from './sidebar/k8s-components/pod/pod-labels/pod-labels.component';
import { PodExtraHostsComponent } from './sidebar/k8s-components/pod/pod-extra-hosts/pod-extra-hosts.component';
import { K8sInfoContainerComponent } from './sidebar/k8s-components/k8s-info-container/k8s-info-container.component';
import { K8sVolumeContainerComponent } from './sidebar/k8s-components/k8s-volume-container/k8s-volume-container.component';
import { K8sServiceContainerComponent } from './sidebar/k8s-components/k8s-service-container/k8s-service-container.component';
import { ServiceSelectorComponent } from './sidebar/k8s-components/k8s-service/k8s-service-selector/k8s-service-selector.component';
import { K8sServiceContainerPortsComponent } from './sidebar/k8s-components/k8s-service/k8s-service-container-ports/k8s-service-container-ports.component';
import { PodTopLabelsComponent } from './sidebar/k8s-components/pod/pod-top-labels/pod-top-labels.component';
import { K8sSecretsComponent } from './sidebar/k8s-components/k8s-info/k8s-secrets/k8s-secrets.component';
import { K8sConfigmapComponent } from './sidebar/k8s-components/k8s-info/k8s-configmap/k8s-configmap.component';
import { ContainerSecretsComponent } from './sidebar/k8s-components/container/container-secrets/container-secrets.component';
import { ContainerConfigsComponent } from './sidebar/k8s-components/container/container-configs/container-configs.component';
import { StatefulSetComponent } from './sidebar/k8s-components/pod/stateful-set/stateful-set.component';
import { DeploymentComponent } from './sidebar/k8s-components/pod/deployment/deployment.component';
import { DaemonSetComponent } from './sidebar/k8s-components/pod/daemon-set/daemon-set.component';
import { CronJobComponent } from './sidebar/k8s-components/pod/cron-job/cron-job.component';
import { K8sEmptyDirComponent } from './sidebar/k8s-components/k8s-empty-dir/k8s-empty-dir.component';
import { K8sHostPathComponent } from './sidebar/k8s-components/k8s-host-path/k8s-host-path.component';
import { K8sServiceServicePortsComponent } from './sidebar/k8s-components/k8s-service/k8s-service-service-ports/k8s-service-service-ports.component';
import { PodImagePullSecretsComponent } from './sidebar/k8s-components/pod/pod-image-pull-secrets/pod-image-pull-secrets.component';
import { InitContainersComponent } from './sidebar/k8s-components/pod/init-containers/init-containers.component';
import { K8sIngressContainerComponent } from './sidebar/k8s-components/k8s-ingress-container/k8s-ingress-container.component';
import { IngressLabelsComponent } from './sidebar/k8s-components/k8s-ingress/k8s-ingress-labels/ingress-labels.component';
import { IngressBackendComponent } from './sidebar/k8s-components/k8s-ingress/k8s-ingress-backend/ingress-backend.component';
import { IngressAnnotationsComponent } from './sidebar/k8s-components/k8s-ingress/k8s-ingress-annotations/ingress-annotations.component';
import { IngressTlsComponent } from './sidebar/k8s-components/k8s-ingress/k8s-ingress-tls/ingress-tls.component';
import { IngressRuleComponent } from './sidebar/k8s-components/k8s-ingress/k8s-ingress-rules/ingress-rules.component';
import { AnnotationsComponent } from './sidebar/k8s-components/k8s-service/k8s-service-annotations/k8s-annotations.component';
import { UnknownKindContainerComponent } from './sidebar/k8s-components/unknown-kind-container/unknown-kind-container.component';
import { K8sHelmComponent } from './sidebar/k8s-components/k8s-info/k8s-helm/k8s-helm.component';
import { CanDeactivateGuard } from '../can-deactivate.guard';

// if this const gets too large, export it from a routs.ts file in this dir
export const editorRoutes: Routes = [
  {path: 'editor', component: EditorComponent, canDeactivate: [CanDeactivateGuard] },
  {path: 'editor/:id', component: EditorComponent, canDeactivate: [CanDeactivateGuard] },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(editorRoutes),
    ClarityModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DndModule.forRoot()
  ],
  declarations: [
    EditorComponent,
    CanvasComponent,
    SidebarComponent,
    SidebarGroupComponent,
    SidebarPanelComponent,

    // Nerdmode Components
    NerdmodeContainerComponent,
    NerdmodeViewerComponent,

    /* ************************* */
    /* k8s SUPPORTING COMPONENTS */
    /* ************************* */
    // app info
    K8sInfoContainerComponent,
    // container
    ContainerContainerComponent,
    ContainerEnvironmentVariablesComponent,
    ContainerPortsComponent,
    ContainerVolumesComponent,
    ContainerEmptyDirsComponent,
    ContainerHostPathsComponent,
    ContainerLivenessProbeComponent,
    ContainerReadinessProbeComponent,
    ContainerAdvancedComponent,
    // pod
    PodContainerComponent,
    PodLabelsComponent,
    PodExtraHostsComponent,
    StatefulSetComponent,
    // volume
    K8sVolumeContainerComponent,
    // service
    K8sServiceContainerComponent,
    K8sServiceContainerPortsComponent,
    K8sServiceServicePortsComponent,
    ServiceSelectorComponent,
    PodTopLabelsComponent,
    K8sSecretsComponent,
    K8sHelmComponent,
    K8sConfigmapComponent,
    ContainerSecretsComponent,
    ContainerConfigsComponent,
    StatefulSetComponent,
    DeploymentComponent,
    DaemonSetComponent,
    CronJobComponent,
    K8sEmptyDirComponent,
    K8sHostPathComponent,
    PodImagePullSecretsComponent,
    InitContainersComponent,
    AnnotationsComponent,
    // ingress
    K8sIngressContainerComponent,
    IngressLabelsComponent,
    IngressBackendComponent,
    IngressAnnotationsComponent,
    IngressTlsComponent,
    IngressRuleComponent,
    UnknownKindContainerComponent
  ],
  providers: [
    EditorService,
    EditorEventService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  exports: [
    DndModule
  ]
})
export class EditorModule { }
