import type { Organization } from "./User";

export interface Job {
    id: string;
    org: Organization;
    title: string;
    pay: string;
    description: string;
}
