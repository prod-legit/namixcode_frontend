import type { Job } from "./Job";
import type { Person } from "./User";

export interface Application {
    job: Job;
    user: Person;
    date: string;
}
