import { Injectable } from "@angular/core";
import { ServiceUrls } from "../constants/service.constants";
import { HttpCallService } from "./http-call.service";
import { LoginRequest, LoginResponse } from "../models/login.model";
import { ApplicationSettings } from "@nativescript/core";
import { UserConstants } from "../constants/user.constants";
import { ToastyService } from "./toasty.service";
import { MessageConstants } from "../constants/message.constants";
@Injectable()
export class UserService {
    constructor(
        private httpCallService: HttpCallService,
        private toastyService: ToastyService
    ) {}

    fullName: string;
    isLoggedIn: boolean = false;

    login(
        userName: string,
        password: string,
        rememberMe: boolean
    ): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const loginRequest: LoginRequest = {
                UserName: userName,
                Password: password,
            };
            this.httpCallService
                .callService(ServiceUrls.Login, "POST", loginRequest)
                .then(
                    (response: LoginResponse) => {
                        if (rememberMe) {
                            ApplicationSettings.setString(
                                UserConstants.EmailAddress,
                                userName
                            );
                        } else {
                            if (
                                ApplicationSettings.hasKey(
                                    UserConstants.EmailAddress
                                )
                            ) {
                                ApplicationSettings.remove(
                                    UserConstants.EmailAddress
                                );
                            }
                        }
                        if (response.authenticated) {
                            this.fullName = response.fullName;
                            this.isLoggedIn = true;
                            this.toastyService.openToasty(
                                `${response.fullName} ${MessageConstants.LoggedIn}`,
                                "success"
                            );
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    },
                    (error) => {
                        reject(error);
                    }
                );
        });
    }
}
