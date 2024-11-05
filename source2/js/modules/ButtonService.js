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
        }
}
