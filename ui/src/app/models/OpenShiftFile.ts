/**

  Definition of the openShiftFile with metadata returned from the /openshiftfile
  API call.

*/

export interface OpenShiftFile {
    openShiftFile?: string; // download returns this
    openshiftFile?: string; // live download returns this
    name: string;
    version: number;
}
