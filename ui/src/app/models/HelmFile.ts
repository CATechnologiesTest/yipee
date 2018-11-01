/**

  Definition of the HelmFile with metadata returned from the /kubernetesfile
  API call.

*/

export interface HelmFile {
    helmFile: string;
    name: string;
    version: number;
}
