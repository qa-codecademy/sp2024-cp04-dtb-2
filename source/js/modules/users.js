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
    emptyUser(){
        let empty = {
            firstName: null,
            lastName: null,
            email: null,
            password: null,
            isSubscribed: false
        };
        return empty;
    }
    printUsers = () => this.storage.forEach(x => console.log(`id: ${x.id}\nname:${x.fullName()}\nemail: ${x.email}\npassword: ${x.password}\nisSubscribed: ${x.isSubscribed}`));
    writeUsers = (userData) => {
        for (const item of userData) {
        this.newUser(item.first_name, item.last_name, item.email, item.password);
    }}
    alert(alertId,message){
        document.getElementById(alertId).innerText = message;
        document.getElementById(alertId).style.display = 'block';
        setTimeout(() => {
            document.getElementById(alertId).style.display = 'none';
        }, 3500);
    }

}