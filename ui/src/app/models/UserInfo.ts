export interface UserInfo {
    activatedOn: string;
    avatarURL: string;
    githubUsername: string;
    intercomHash?: string;
}

export interface Permissions {
    downloadKubernetesFiles: boolean;
    id: string;
    paidUser: boolean;
    terms: boolean;
    userId: string;
    viewYipeeCatalog: boolean;
    yipeeTeamMember: boolean;
}

export interface UserInfoResponse {
    loggedIn: boolean;
    permissions: Permissions;
    userInfo: UserInfo;
}
