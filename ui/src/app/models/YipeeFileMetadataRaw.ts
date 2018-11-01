import { YipeeFileRaw } from './YipeeFileRaw';
/**
  Definition of the yipee file metadata returned from the /yipeefiles and /myapps
  API call.
*/
export interface YipeeFileMetadataRaw {
  name: string;
  author?: string;
  username?: string;
  containers?: string[];
  downloads?: number;
  likes?: number;
  canvasdata?: string;
  revcount?: number;
  ownerorg?: string;
  fullname?: string;
  orgname?: string;
  isPrivate?: boolean;
  dateCreated?: string;
  dateModified?: string;
  id?: string;
  isFlat?: boolean;
  hasLogo?: boolean;
  storeFromUIFile?: boolean;
  storeFromFlatFile?: boolean;
  uiFile?: YipeeFileRaw;
  flatFile?: any;
  [others: string]: any;
}
