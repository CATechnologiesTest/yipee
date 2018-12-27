import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { AngularDraggableModule } from 'angular2-draggable';

import { UserService } from './services/user.service';
import { ApiService } from './services/api.service';
import { DownloadService } from './services/download.service';
import { ImportAppService } from './services/import-app.service';
import { YipeeFileService } from './services/yipee-file.service';

import { BulkNameValueEditComponent } from './modals/bulk-name-value-edit/bulk-name-value-edit.component';
import { CloseAppModalComponent } from './modals/close-app-modal/close-app-modal.component';
import { ConfirmDeleteModalComponent } from './modals/confirm-delete-modal/confirm-delete-modal.component';
import { ContainerSearchService } from './services/container-search.service';
import { DisclaimerModalComponent } from './modals/disclaimer-modal/disclaimer-modal.component';
import { EnvBulkAddModalComponent } from './modals/env-bulk-add-modal/env-bulk-add-modal.component';
import { ImportAppModalComponent } from './modals/import-app-modal/import-app-modal.component';
import { LeftOfForwardSlashPipe } from './pipes/left-of-forward-slash.pipe';
import { NewAppModalComponent } from './modals/new-app-modal/new-app-modal.component';
import { NewK8sContainerModalComponent } from './modals/new-k8s-container-modal/new-k8s-container-modal.component';
import { NewK8sDeploymentModalComponent } from './modals/new-k8s-deployment-modal/new-k8s-deployment-modal.component';
import { NewK8sEmptyDirModalComponent } from './modals/new-k8s-emptydir-modal/new-k8s-emptydir-modal.component';
import { NewK8sHostPathModalComponent } from './modals/new-k8s-hostpath-modal/new-k8s-hostpath-modal.component';
import { NewK8sServiceModalComponent } from './modals/new-k8s-service-modal/new-k8s-service-modal.component';
import { NewK8sStatefulSetModalComponent } from './modals/new-k8s-statefulset-modal/new-k8s-statefulset-modal.component';
import { NewK8sVolumeModalComponent } from './modals/new-k8s-volume-modal/new-k8s-volume-modal.component';
import { RightOfForwardSlashPipe } from './pipes/right-of-forward-slash.pipe';
import { NewK8sDaemonSetModalComponent } from './modals/new-k8s-daemon-set-modal/new-k8s-daemon-set-modal.component';
import { NewK8sCronJobModalComponent } from './modals/new-k8s-cron-job-modal/new-k8s-cron-job-modal.component';
import { NewK8sInitContainerModalComponent } from './modals/new-k8s-init-container-modal/new-k8s-init-container-modal.component';
import { NewK8sIngressModalComponent } from './modals/new-k8s-ingress-modal/new-k8s-ingress-modal.component';
import { WarnChangesModalComponent } from './modals/warn-changes-modal/warn-changes-modal.component';

// removed components
// import { SaveAppModalComponent } from './modals/save-app-modal/save-app-modal.component';
// import { SaveAppModalForkComponent } from './modals/save-app-modal-fork/save-app-modal-fork.component';
// import { SettingsModalComponent } from './modals/settings-modal/settings-modal.component';
// import { TimeoutService } from './services/timeout.service';
// import { NewTeamModalComponent } from './modals/new-team-modal/new-team-modal.component';
// import { MakePublicModalComponent } from './modals/make-public-modal/make-public-modal.component';
// import { ForkAppModalComponent } from './modals/fork-app-modal/fork-app-modal.component';
// import { DeleteAppModalComponent } from './modals/delete-app-modal/delete-app-modal.component';
// import { ProgressComponent } from './header/progress/progress.component';


@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AngularDraggableModule
  ],
  declarations: [
    BulkNameValueEditComponent,
    CloseAppModalComponent,
    ConfirmDeleteModalComponent,
    DisclaimerModalComponent,
    EnvBulkAddModalComponent,
    FooterComponent,
    HeaderComponent,
    ImportAppModalComponent,
    LeftOfForwardSlashPipe,
    NewAppModalComponent,
    NewK8sContainerModalComponent,
    NewK8sIngressModalComponent,
    NewK8sInitContainerModalComponent,
    NewK8sDeploymentModalComponent,
    NewK8sEmptyDirModalComponent,
    NewK8sHostPathModalComponent,
    NewK8sServiceModalComponent,
    NewK8sStatefulSetModalComponent,
    NewK8sVolumeModalComponent,
    RightOfForwardSlashPipe,
    ToolbarComponent,
    NewK8sDaemonSetModalComponent,
    NewK8sCronJobModalComponent,
    NewK8sInitContainerModalComponent,
    WarnChangesModalComponent
  ],
  providers: [ /* leave empty, read notes below */ ContainerSearchService],
  exports: [
    BulkNameValueEditComponent,
    CloseAppModalComponent,
    ConfirmDeleteModalComponent,
    EnvBulkAddModalComponent,
    FooterComponent,
    HeaderComponent,
    ImportAppModalComponent,
    LeftOfForwardSlashPipe,
    NewAppModalComponent,
    NewK8sContainerModalComponent,
    NewK8sIngressModalComponent,
    NewK8sInitContainerModalComponent,
    NewK8sDeploymentModalComponent,
    NewK8sEmptyDirModalComponent,
    NewK8sHostPathModalComponent,
    NewK8sServiceModalComponent,
    NewK8sStatefulSetModalComponent,
    NewK8sVolumeModalComponent,
    RightOfForwardSlashPipe,
    ToolbarComponent,
    NewK8sDaemonSetModalComponent,
    NewK8sCronJobModalComponent,
    WarnChangesModalComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class SharedModule {

  /* we export our shared services/providers like this in order
  to keep them singletons, if it doesn't need to be a singleton,
  maybe you should rethink it living in the shared folder... */
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [  UserService,
                    ApiService,
                    DownloadService,
                    ImportAppService,
                    YipeeFileService
                  ]
    };
  }

}
