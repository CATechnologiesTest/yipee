import { YipeeFileMetadataRaw } from './YipeeFileMetadataRaw';

/**

  Definition of the body of a put or post request to the server for any
  /yipeefiles API call.

*/

export interface YipeeFileResponse {
  success: boolean;
  total: number;
  data: YipeeFileMetadataRaw[];
}

export interface YipeeFileErrorResponse {
  success: boolean;
  total: number;
  data: string[];
}
