export default class ModalService{
    
    constructor() {
        
    }
    
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal !== null){
            
            modal.style.display = 'block';
            setTimeout(() => modal.classList.add('show'), 10);
        }
    }
       
    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if(modal !== null){
            
            modal.classList.remove('show');
            
            setTimeout(() => modal.style.display = 'none', 500);
        }       
    }
}

// const modalService = new ModalService ();

// export default modalService;