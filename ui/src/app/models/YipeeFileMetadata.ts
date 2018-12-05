import { YipeeFileMetadataRaw } from './YipeeFileMetadataRaw';
import { K8sFile } from './k8s/K8sFile';

/**
  Definition of the internal yipee file metadata returned from the /yipeefiles and /myapps
  API call.
*/
export class YipeeFileMetadata {
  _id: string;
  name: string;
  author: string;
  username: string;
  containers: string[];
  downloads: number;
  likes: number;
  canvasdata: string;
  revcount: number;
  ownerorg: string;
  loadFailure: boolean;
  fullname: string;
  orgname: string;
  isPrivate: boolean;
  dateCreated: Date;
  dateModified: Date;
  id: string;
  isFlat: boolean;
  flatFile: K8sFile;
  raw: YipeeFileMetadataRaw;
  file_type: string;

  constructor(raw?: YipeeFileMetadataRaw) {
    if (raw) {
      this.fromRaw(raw);
    } else {
      const r: YipeeFileMetadataRaw = {
        name: '',
        isPrivate: true,
        flatFile: []
      };
      this.fromRaw(r);
    }
  }

  get readme(): string {
    return (this.flatFile.appInfo ? this.flatFile.appInfo.readme : '');
  }

  set readme(value: string) {
    this.flatFile.appInfo.readme = value;
  }

  public fromRaw(raw: YipeeFileMetadataRaw): void {
    this.name = raw.name;
    this.isFlat = true;
    this.flatFile = new K8sFile();
    this.flatFile.fromFlat(raw.flatFile);
    this.file_type = 'Kubernetes';
    this.raw = raw;
  }

  public toRaw(): YipeeFileMetadataRaw {
    this.raw.name = this.name;
    this.raw.id = this.id;
    this.raw.isFlat = this.isFlat;
    this.raw.storeFromFlatFile = true;
    this.raw.storeFromUIFile = false;
    this.raw.flatFile = this.flatFile.toFlat();
    return this.raw;
  }

}
