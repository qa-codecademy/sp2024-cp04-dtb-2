 export default class ButtonService{
    constructor() {
        this.loadMoreBtn = document.querySelector("#loadMoreBtn");
        this.newsLetterBtn = document.querySelector("#newsletterBtn");
        this.newsLetterModalSubBtn = document.querySelector('#subscribeToNewsBtn');
        this.showUnsubBtn = document.querySelector("#showUnsubscribeBtn");
        this.newsLetterSubCloseBtn = document.querySelector("#subClose");
        this.newsLetterUnsubCloseBtn = document.querySelector("#unsubClose");
        this.filterBtn = document.querySelector("#filterDiv");
        this.loginBtn = document.querySelector('#loginBtn');
        this.logginCloseBtn = document.querySelector('#logginClose');
        this.logoutBtn = document.getElementById('logoutBtn');
        this.closeCreatePostModal = document.getElementById("closeCreatePostModal");
        this.closeEditPostModal = document.getElementById("closeEditPostModal");
        this.editPostSaveBtn = document.getElementById("editPostSaveBtn");
        this.monthFilter = document.querySelector('#monthFilter');
        this.monthModalCloseBtn = document.querySelector('#monthModalCloseBtn');
        this.monthmodalSubmitBtn = document.querySelector('#monthModalSubmitBtn');
        this.showSignUpBtn = document.querySelector("#showSignUpBtn");
        this.closeSignUpModalBtn = document.querySelector("#closeSignUpModal");
        this.tagFilterDropdownBtn = document.getElementById("tagFilter");
        this.imageModalBtn = document.getElementById("imageModalBtn");
    }
    fetchAllButtons(){
        this.loadMoreBtn = document.querySelector("#loadMoreBtn");
        this.newsLetterBtn = document.querySelector("#newsletterBtn");
        this.newsLetterModalSubBtn = document.querySelector('#subscribeToNewsBtn');
        this.showUnsubBtn = document.querySelector("#showUnsubscribeBtn");
        this.newsLetterSubCloseBtn = document.querySelector("#subClose");
        this.newsLetterUnsubCloseBtn = document.querySelector("#unsubClose");
        this.filterBtn = document.querySelector("#filterDiv");
        this.loginBtn = document.querySelector('#loginBtn');
        this.logginCloseBtn = document.querySelector('#logginClose');
        this.logoutBtn = document.getElementById('logoutBtn');
        this.closeCreatePostModal = document.getElementById("closeCreatePostModal");
        this.closeEditPostModal = document.getElementById("closeEditPostModal");
        this.editPostSaveBtn = document.getElementById("editPostSaveBtn");
        this.monthFilter = document.querySelector('#monthFilter');
        this.monthModalCloseBtn = document.querySelector('#monthModalCloseBtn');
        this.monthmodalSubmitBtn = document.querySelector('#monthModalSubmitBtn');
        this.showSignUpBtn = document.querySelector("#showSignUpBtn");
        this.closeSignUpModalBtn = document.querySelector("#closeSignUpModal");
        this.tagFilterDropdownBtn = document.getElementById("tagFilter");
        this.imageModalBtn = document.getElementById("imageModalBtn");
    }
}
