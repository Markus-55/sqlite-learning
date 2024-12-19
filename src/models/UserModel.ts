import { hashPassword } from "../utils/security.js";

// export default class User {
//   constructor(producerID, company, role, fullName, email, password) {
//     this.producerID = producerID ?? null; // null by default for buyers
//     this.company = company;
//     this.role = role;
//     this.fullName = fullName;
//     this.email = email;
//     this.password = hashPassword(password);
//   }
// }

export type User = {
    readonly userID?: number;
    readonly producerID?: number; // null by default for buyers
    company: string;
    role: string;
    fullName: string;
    email: string;
    password: string;
}