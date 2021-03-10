import { BaseResponse } from "./service.model";

export class LoginModel {
    EmailAddress: string;
    Password: number;
}

export class LoginRequest {
    UserName: string;
    Password: string;
}

export class LoginResponse extends BaseResponse {
    authenticated: boolean;
    missingActivityCount: number;
    fullName: string;
}
