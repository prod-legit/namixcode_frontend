import type { Job } from "./Job";
import type { Person } from "./User";

export interface Application {
    id: string;
    job: Job;
    user: Person;
    date: string;
}
