import { Injectable } from "@angular/core";
import { HttpHeaderParameters } from "../constants/service.constants";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../environments/environment";
import { ToastyService } from "./toasty.service";
import { MethodType } from "../models/service.model";
import { Observable } from "rxjs";
import * as _ from "lodash";
@Injectable()
export class HttpCallService {
    constructor(
        private httpClient: HttpClient,
        private toastyService: ToastyService
    ) {}

    private hasActiveServiceCall: boolean = false;

    private _isBusy: boolean = false;

    set isBusy(val: boolean) {
        this._isBusy = val;
    }

    get isBusy(): boolean {
        return this._isBusy || this.hasActiveServiceCall;
    }

    private _httpOptions = {
        headers: new HttpHeaders(HttpHeaderParameters),
        withCredentials: true,
    };

    get HttpOptions() {
        return this._httpOptions;
    }

    callService(
        serviceSuffix: string,
        methodType: MethodType,
        requestObject?: any
    ): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.hasActiveServiceCall = true;
            const serviceURL: string = `${environment.baseServiceURL}${serviceSuffix}`;
            let observable: Observable<Object>;
            if (methodType == "GET") {
                observable = this.get(serviceURL);
            } else if (methodType == "POST") {
                observable = this.post(serviceURL, requestObject);
            }
            observable.subscribe(
                (response: any) => {
                    this.hasActiveServiceCall = false;
                    if (
                        !_.isNil(response) &&
                        ((!_.isEmpty(response.hasError) &&
                            response.hasError == false) ||
                            _.isEmpty(response.hasError))
                    ) {
                        resolve(response);
                    } else {
                        reject();
                    }
                },
                (error) => {
                    this.hasActiveServiceCall = false;
                    this.handleError(error, serviceURL);
                    reject();
                }
            );
        });
    }

    public get(serviceURL: string) {
        return this.httpClient.get(serviceURL, this.HttpOptions);
    }

    public post(serviceURL: string, requestObject: any) {
        return this.httpClient.post(
            serviceURL,
            requestObject,
            this.HttpOptions
        );
    }

    private handleError(error: any, serviceURL: string) {
        console.log(
            `Error Occurred! Service URL: ${serviceURL}. Error Object: ${error}`
        );
    }
}
