import { Base } from "./base.js";

export class User extends Base{
    constructor(id, firstName, lastName, email, password, isSubscribed = false ){
        super(id)
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.isSubscribed = isSubscribed
    }

    fullName = () => `${this.firstName} ${this.lastName}`;
}