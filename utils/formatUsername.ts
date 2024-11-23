import type { User } from "~/types/User";

export default (user: User) =>
    user.utype === "user"
        ? user.name?.split(" ")[1] ?? user.name ?? "соискатель"
        : user.name;
