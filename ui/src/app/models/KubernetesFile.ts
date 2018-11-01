/**

  Definition of the KubernetesFile with metadata returned from the /kubernetesfile
  API call.

*/

export interface KubernetesFile {
    kubernetesFile: string;
    name: string;
    version: number;
}
