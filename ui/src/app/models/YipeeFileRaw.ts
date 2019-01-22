/**

  Definition of the YipeeFile which is the server side representation
  of the yipeeFile, is is always wrapped by the YipeeFileMetadata metadata when
  communicating with the server.

*/

export interface AppInfoRaw {
  id: string;
  name: string;
  description: string;
  ui?: AnnotationsRaw;
  readme?: string;
  [others: string]: any;
}

export interface NameValuePairRaw {
  name: string;
  value: any;
}

export interface NetworkRaw {
  id: string;
  name: string;
  public?: boolean;
  driver?: string;
  annotations?: AnnotationsRaw;
  [others: string]: any;
}

export interface VolumeRaw {
  id: string;
  driver?: string;
  name: string;
  driver_opts?: NameValuePairRaw[];
  annotations?: AnnotationsRaw;
  [others: string]: any;
}

export interface ServicePathMappingRaw {
  host: string;
  container: string;
}

export interface ServiceNetworkRaw {
  aliases?: string[];
  name: string;
  [others: string]: any;
}

export interface ServiceSecretRaw {
  gid: string;
  uid: string;
  mode: string;
  source: string;
  target: string;
  [others: string]: any;
}

export interface LoggingRaw {
  driver: string;
  options: NameValuePairRaw[];
  [others: string]: any;
}

export interface DeployRaw {
  count?: number;
  mode: string;
  [others: string]: any;
}

export interface HealthcheckRaw {
  interval: number;
  retries: number;
  timeout: number;
  healthcmd: string[];
  [others: string]: any;
}

export interface ServiceRaw {
  id: string;
  name: string;
  networks?: ServiceNetworkRaw[];
  volumes?: string[];
  path_mappings?: any[];
  image: string;
  annotations: AnnotationsRaw;
  command?: any;
  depends_on?: string[];
  entrypoint?: any;
  labels?: any;
  restart?: string;
  logging?: LoggingRaw;
  deploy?: DeployRaw;
  ports?: any;
  build?: string;
  environment?: string[];
  healthcheck?: HealthcheckRaw;
  secrets?: ServiceSecretRaw[];
  [others: string]: any;
}

export interface AnnotationsRaw {
  [others: string]: any;
}

export interface DevelopmentConfigRaw {
  id: string;
  image: string;
  repository: string;
  tag: string;
}

export interface ExternalConfigRaw {
  id: string;
  image: string;
  proxy_type: string;
  server: string;
  ports: any;
}

export interface SecretRaw {
  id: string;
  name: string;
  annotations?: AnnotationsRaw;
  [others: string]: any;
}

export interface YipeeFileRaw {
  appinfo: AppInfoRaw;
  networks?: NetworkRaw[];
  volumes?: VolumeRaw[];
  services?: ServiceRaw[];
  secrets?: SecretRaw[];
  [others: string]: any;
}

export interface NamespaceRaw {
  name: string;
  dateCreated: string;
  containerCount?: number;
  podCount?: number;
  phase?: string;
  status?: string;
}
