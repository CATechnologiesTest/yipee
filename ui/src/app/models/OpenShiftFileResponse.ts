import { OpenShiftFile } from './OpenShiftFile';

/**

  Definition of the body of a openshift request to the server for any
  /openshift API call.

*/

export interface OpenShiftFileResponse {
    success: boolean;
    total: number;
    data: OpenShiftFile[];
  }
