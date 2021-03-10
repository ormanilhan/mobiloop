import { Injectable } from "@angular/core";
import { ServiceUrls } from "../constants/service.constants";
import { MessageConstants } from "../constants/message.constants";
import {
    HourSelections,
    SuccessfulActivitySaveMessage,
} from "../constants/activity.constants";
import { HttpCallService } from "./http-call.service";
import {
    Activities,
    Activity,
    GetSubProjectRequest,
    KeyValuePair,
    KeyValuePairResponse,
    MissingDaysResponse,
    SubProjectList,
} from "../models/activity.model";
import * as _ from "lodash";
import { ValueItem, ValueList } from "nativescript-drop-down";
@Injectable()
export class ActivityService {
    constructor(private httpCallService: HttpCallService) {}

    activies: Activities = {};

    hourSelections: string[] = HourSelections;

    subProjectList: SubProjectList = {};

    projectList: ValueList<string>;
    activityTypeList: ValueList<string>;
    customerTypeList: ValueList<string>;
    activityTypes: KeyValuePair[];

    missingDaysList: string[];
    hasMissingDay: boolean = false;

    getMissingDays() {
        return new Promise<any>((resolve, reject) => {
            this.httpCallService
                .callService(ServiceUrls.MissingDays, "GET")
                .then(
                    (missingDaysResponse: MissingDaysResponse) => {
                        if (
                            missingDaysResponse.days != null &&
                            missingDaysResponse.days.length > 0
                        ) {
                            this.missingDaysList = missingDaysResponse.days;
                            this.hasMissingDay = true;
                            resolve(true);
                        } else {
                            this.hasMissingDay = false;
                            resolve(false);
                        }
                    },
                    (error) => {
                        this.hasMissingDay = false;
                        reject(error);
                    }
                );
        });
    }
    saveActivities(activities: Activity[]) {
        return new Promise<any>((resolve, reject) => {
            this.httpCallService
                .callService(ServiceUrls.SaveActivity, "POST", activities)
                .then(
                    (response) => {
                        if (
                            !_.isNil(response) &&
                            response.value == SuccessfulActivitySaveMessage
                        ) {
                            resolve(response);
                        } else {
                            reject(response.value);
                        }
                    },
                    (error) => {
                        console.log(error);
                        reject(MessageConstants.CheckYourActivities);
                    }
                );
        });
    }

    public getActivityTypes() {
        return new Promise<any>((resolve, reject) => {
            if (_.isEmpty(this.activityTypeList)) {
                this.getSelectionList(ServiceUrls.GetActivityTypes).then(
                    (activityTypeList: KeyValuePair[]) => {
                        this.activityTypes = activityTypeList;
                        this.activityTypeList = this.getValueList(
                            activityTypeList
                        );
                        resolve(true);
                    },
                    () => {
                        reject();
                    }
                );
            } else {
                resolve(true);
            }
        });
    }

    public getCustomers() {
        return new Promise<any>((resolve, reject) => {
            if (_.isEmpty(this.customerTypeList)) {
                this.getSelectionList(ServiceUrls.GetCustomers).then(
                    (customerTypeList: KeyValuePair[]) => {
                        this.customerTypeList = this.getValueList(
                            customerTypeList
                        );
                        resolve(true);
                    },
                    () => {
                        reject();
                    }
                );
            } else {
                resolve(true);
            }
        });
    }

    public getProjects() {
        return new Promise<any>((resolve, reject) => {
            if (_.isEmpty(this.projectList)) {
                this.getSelectionList(ServiceUrls.GetProjects).then(
                    (projects: KeyValuePair[]) => {
                        this.projectList = this.getValueList(projects);
                        resolve(true);
                    },
                    () => {
                        reject();
                    }
                );
            } else {
                resolve(true);
            }
        });
    }

    public getRelatedSubProject(projectKey: string) {
        return new Promise<any>((resolve, reject) => {
            if (
                this.subProjectList == null ||
                this.subProjectList[projectKey] == null
            ) {
                const subProjectRequest: GetSubProjectRequest = {
                    key: projectKey,
                };

                this.httpCallService
                    .callService(
                        ServiceUrls.GetSubProjects,
                        "POST",
                        subProjectRequest
                    )
                    .then(
                        (subProjectsResponse: KeyValuePairResponse) => {
                            if (
                                !_.isNil(subProjectsResponse) &&
                                !_.isEmpty(subProjectsResponse.keyValuePairs)
                            ) {
                                this.subProjectList[projectKey] =
                                    subProjectsResponse.keyValuePairs;
                                resolve(
                                    this.getValueList(
                                        this.subProjectList[projectKey]
                                    )
                                );
                            } else {
                                this.subProjectList[projectKey] = [];
                                reject();
                            }
                        },
                        (error) => {
                            this.subProjectList[projectKey] = [];
                            reject();
                        }
                    );
            } else {
                if (!_.isEmpty(this.subProjectList[projectKey])) {
                    resolve(this.getValueList(this.subProjectList[projectKey]));
                } else {
                    reject();
                }
            }
        });
    }

    private getSelectionList(serviceUrl: string) {
        return new Promise<any>((resolve, reject) => {
            this.httpCallService.callService(serviceUrl, "GET").then(
                (response: KeyValuePairResponse) => {
                    if (
                        !_.isNil(response) &&
                        !_.isEmpty(response.keyValuePairs)
                    ) {
                        resolve(response.keyValuePairs);
                    } else {
                        reject();
                    }
                },
                () => {
                    reject();
                }
            );
        });
    }

    private getValueList(keyValuePairList: KeyValuePair[]): ValueList<string> {
        return new ValueList<string>(
            keyValuePairList.map(
                (val) =>
                    <ValueItem<string>>{ display: val.value, value: val.key }
            )
        );
    }
}
