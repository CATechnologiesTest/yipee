import { Injectable } from '@angular/core';

import { DeploymentStatus } from '../../models/common/DeploymentStatus';
import { K8sFile } from '../../models/k8s/K8sFile';
import { YipeeFileMetadata } from '../../models/YipeeFileMetadata';
import { YipeeFileService } from './yipee-file.service';

declare var Primus: any;

@Injectable()
export class UpdateService {

  private k8sFile: K8sFile;
  private namespace: string;
  private metadata: YipeeFileMetadata[];
  private primus: any;
  private storeInfo: any;

  constructor(
    private yipeeFileService: YipeeFileService
  ) {
    this.primus = new Primus();
    this.primus.on('data', function (data) {
      this.handlePushUpdate(data);
    }, this);

  }

  handlePushUpdate(event: any): void {
    console.log('update', event);
    if (event['update'] !== undefined) {
      const update = event['update'];
      if (update['type'] === DeploymentStatus.OBJECT_NAME && this.k8sFile !== undefined) {
        const cgroup = this.k8sFile.containerGroups.find((cg) => cg.id === update['cgroup']);
        if (cgroup !== undefined) {
          cgroup.deployment_status.fromFlat(update);
        } else {
          console.error('cannot find cgroup ', update['cgroup']);
        }
      }
    } else if (event['namespaceUpdate'] !== undefined) {
      const namespace = event['namespace'];
      const status = event['status'];
      if (status !== undefined && this.metadata !== undefined) {
        const metadata = this.metadata.find((m) => m.name === namespace);
        if (metadata) {
          metadata.fromRaw(status);
        } else {
          console.error('unknown namespace for update', event);
        }
      }
    } else {
      console.error('unknown event', event);
    }
  }

  subscribeToK8sFile(k8sFile: K8sFile, namespace: string): void {
    console.log('subscribe');
    if (this.k8sFile !== undefined) {
      this.unsubscribeFromK8sFile(this.k8sFile, this.namespace);
    }
    this.k8sFile = k8sFile;
    this.namespace = namespace;
    this.storeInfo = null;
    this.primus.write({
      msg: 'subscribe',
      namespace: namespace
    });
  }

  unsubscribeFromK8sFile(k8sFile: K8sFile, namespace: string): void {
    this.primus.write({
      msg: 'unsubscribe',
      namespace: namespace
    });
    this.k8sFile = undefined;
    this.namespace = undefined;
  }

  watchMetadata(metadata: YipeeFileMetadata[]): void {
    this.metadata = metadata;
  }

}
