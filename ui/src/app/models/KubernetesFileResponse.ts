import { KubernetesFile } from './KubernetesFile';

/**

  Definition of the body of a kubernetes request to the server for any
  /kubernetes API call.

*/

export interface KubernetesFileResponse {
    success: boolean;
    total: number;
    data: KubernetesFile[];
  }
