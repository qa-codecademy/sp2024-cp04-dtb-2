import { Users } from "./users.js";
const users = new Users();
export class ModalService {
    constructor(){
        this.currentUser = this.removeSession();
    }
    
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.style.display = 'block';
        setTimeout(() => modal.classList.add('show'), 10);
    }
       
    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = 'none', 500);
    }

    emptySession(){
        let user = users.emptyUser();
        const {firstName, lastName, email, password, isSubscribed} = user;
        console.log(`Current session user:
            \nfirst name:${firstName}
            \nlast name: ${lastName}
            \nemail: ${email}
        \npassword: ${password}
        \nisSubscribed: ${isSubscribed}`);
        return user;
    }
    removeSession = () => this.currentUser = this.emptySession();
}