/* as far as i can tell this type isnt being used right now,
the last place it was used was in the api.service file */
export interface LogoutResponse {
    ok: boolean;
    status: number;
    statusText: string;
    type: number;
    url: string;
}
