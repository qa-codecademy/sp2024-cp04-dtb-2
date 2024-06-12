import { User } from "./user.js";

export class Users {
    constructor(){
        this.storage = [];
    }
    newUser(firstName, lastName, email, password, isSubscribed) {
        let userId;
        this.storage.length < 1 ? userId = 1 
                                : userId = this.storage[this.storage.length - 1].id + 1;
        let newUser = new User(userId, firstName, lastName, email, password, isSubscribed);
        return !newUser ? "Invalid entries" : this.storage.push(newUser);
        
    }
    printUsers = () => this.storage.forEach(x => console.log(`id: ${x.id}\nname:${x.fullName()}\nemail: ${x.email}\npassword: ${x.password}\nisSubscribed: ${x.isSubscribed}`));
    writeUsers = (userData) => {
        for (const item of userData) {
        this.newUser(item.first_name, item.last_name, item.email, item.password);
    }}
}