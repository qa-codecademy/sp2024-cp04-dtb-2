import{ModalService} from "./ModalService.js";
const modalService = new ModalService();
export class Newsletter{
    constructor(){
        this.storage = [];
    }
    addNewSubscriber (email){
        if(this.storage.includes(email)) {
            document.getElementById('subscibeModalInfo').style.color= 'red';
            document.getElementById('subscibeModalInfo').innerHTML = "Email already subscribed!"
            document.getElementById('newsletterEmail').style.visibility = 'visible';

        }
        else {
            this.storage.push(email)
            document.getElementById('newsletterEmail').style.visibility = 'hidden';
            document.getElementById('subscibeModalInfo').style.color= 'green';
            document.getElementById('subscibeModalInfo').innerHTML = "Successfully subscribed!"
        };
    }
    removeSubscriber (email){
        const indexOfEmail = this.storage.indexOf(email);
        if (indexOfEmail !== -1) {
            this.storage.splice(indexOfEmail, 1);
        document.getElementById('unsubscibeModalInfo').style.color= 'green';
        document.getElementById('unsubscibeModalInfo').innerHTML = `Successfully removed ${email}!`;
        }
        else{
        document.getElementById('unsubNewsletterEmail').style.visibility = 'visible';    
        document.getElementById('unsubscibeModalInfo').style.color= 'orange';
        document.getElementById('unsubscibeModalInfo').innerHTML = `Email [${email}] not found!`;
        }
    }
    subscribeLoggedUser (){
        let currentUserEmail = modalService.currentUser.email;
        document.getElementById('showUnsubscribeText').style.visibility = 'hidden';
        document.getElementById('newsletterEmail').value = currentUserEmail;
        document.getElementById('newsletterEmail').disabled = true;
        
    }
    unsubscribeLoggedUser(){
        let currentUserEmail = modalService.currentUser.email;
        document.getElementById('unsubNewsletterEmail').value = currentUserEmail;
        document.getElementById('unsubNewsletterEmail').disabled = true;

    }


}