export interface Organization {
    utype: "org";
    id: string;
    email: string;
    name: string;
    description: string;
    location: string;
    logo: string;
    foundation_year: number;
    scope: string;
}

export interface Person {
    utype: "user";
    id: string;
    name: string;
    phone: string;
    sex: "male" | "female";
    birthdate: string;
    email: string;
    experience: number;
    professions: string[];
    interests: string[];
}

export type User = Organization | Person;
