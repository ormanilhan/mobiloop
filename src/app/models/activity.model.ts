export class GetSubProjectRequest {
    key: string;
}
export class MissingDaysResponse {
    days: string[];
}

export class KeyValuePairResponse {
    keyValuePairs: KeyValuePair[];
}

export class KeyValuePair {
    key: string;
    value: string;
    req?: string;
}

export class SubProjectList {
    [projectKey: string]: KeyValuePair[];
}

export class Activities {
    [day: string]: Activity[];
}

export class Activity {
    public ActivityDay: string;
    public ActivityProject: string;
    public ActivityProjectSub: string;
    public ActivityType: string;
    public ActivityCustomer: string;
    public ActivityDescription: string;
    public Hour: string;
    public IsValid?: boolean;

    constructor(activityDay: string) {
        this.ActivityDay = activityDay;
    }
}
