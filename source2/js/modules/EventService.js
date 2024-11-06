import postFilterService from "./PostFilterService.js";
import apiCaller from "./ApiCaller.js";
import ButtonService from "./ButtonService.js"
// import modalService from "./ModalService.js";
import ModalService from "./ModalService.js";
import SessionService from "./SessionService.js";
import NavbarService from "./NavbarService.js";
import themeService from "./ThemeService.js";
import uploadImageService from "./UploadImgService.js";
import loadingSpinnerService from "./loadingSpinnerService.js";

const navbarService = new NavbarService();
const sessionService = new SessionService();
const buttonService = new ButtonService();
const modalService = new ModalService();

class EventService {
    constructor() {
        this.currentEditPostId = null;
        this.windowRefreshListener();
        this.currentPostId = null;
        this.currentRating = null;
        this.isScrollActive = true;
        this.firstScrollReached = false;
        this.isSubmitting = false;
        this.initScrollListener();
        this.newsLetterListener();
        this.newsLetterSubListener();
        this.buttonClickListener();
        this.newsLetterUnsubListener();
        this.loginListener();
        this.loginModalListener();
        this.themeListener();
        this.createPostListener();
        this.editPostModalListener();
        this.MonthFilterListener ();
        this.MonthModalListener();

        this.warningAlert = 'warningAlert';
        this.successAlert = 'successAlert';
        // this.logoutListener(); 
        // this.addStarEventListeners();
    }

    alert(alertId,message){
        document.getElementById(alertId).innerText = message;
        document.getElementById(alertId).style.display = 'block';
        setTimeout(() => {
            document.getElementById(alertId).style.display = 'none';
        }, 3500);
    }

    updateCurrentRating (number){
        this.currentRating = number;
    }

    canFetchNextPage() {
        const { pageIndex, totalPages } = postFilterService.getFilters();
        return pageIndex < totalPages;  
    }

    async fetchNextPage() {
        if(this.isSubmitting) return;
        this.isSubmitting = true;


        console.log("starting to fetch next page");
        // console.log(postFilterService.filters);
        const filters = postFilterService.getFilters();
        // console.log(filters);
        
        if (postFilterService.filters.pageIndex < postFilterService.filters.totalPages) {
            postFilterService.updateFilter({ pageIndex: filters.pageIndex + 1 });
            
            const newPosts = await apiCaller.fetchFromDB(`https://localhost:7073/api/Posts`, "POST", filters);

            this.appendPostsToView(newPosts.posts);
        }
        this.isSubmitting = false;
    }

    windowRefreshListener(){
        window.addEventListener('load', async (e)=>{
            const user = sessionService.Get();
            if(!user) return;

            // this.logoutListener();
            // this.createPostListener();
            navbarService.loggedInNavbar();
        })
    }

    appendPostsToView(posts) {
        const contentPart = document.querySelector("#contentPart");
        let resultHtml = "";
        
        posts.forEach(element => {
            element.tags = element.tags.map(x => `[ ${x} ]`).join(' ');
            let imgSrc = `data:image/png;base64,${element.image}`;
            resultHtml += `
                <div class="card" style="width: 25vw" id="card-${element.id}">
                    <img class="card-img-top img-fluid imgLink" src="${imgSrc}" style="object-fit: fill; height: 20vw;" alt="Image should be here" value="${element.id}">
                    <div class="card-body title">
                        <a class="post-link" href="posts/${element.id}" data-link><h5 class="card-title">${element.title}</h5></a>
                        <p class="card-text">${element.description}</p>
                    </div>
                    <div class="card-body icons">
                        <div> 
                            <img src="/data/icons/star.svg" alt="Star Icon" class="starsIcon">
                            <p>${element.rating} Stars</p>
                        </div>
                        <div>
                            <img src="/data/icons/chat-right.svg" alt="Comment Icon" class="commentsIcon">
                            <p>${element.comments} Comments</p>
                        </div>
                        <br>
                        <div class="tags">
                            <button type="button" class="btn btn-secondary btn-sm disabled">${element.tags}</button>
                        </div>  
                    </div>
                </div>
            `;
        });

        contentPart.insertAdjacentHTML('beforeend', resultHtml);
    }


    // && this.canFetchNextPage()   - removed from if 1
    initScrollListener() {
        window.addEventListener('scroll', async () => {
            if (this.isScrollActive && !this.isSinglePostView()) {
                if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 0.9) {
                    if (!this.firstScrollReached) {
                        this.firstScrollReached = true;
                    } else {
                        this.firstScrollReached = false;
                        await this.fetchNextPage();
                    }
                }
            }
        });
    }

    buttonClickListener() {
        buttonService.loadMoreBtn.addEventListener('click', async () => {
            console.log("loadmore button")
            await this.fetchNextPage();
        });
    }

    toggleScroll() {
        this.isScrollActive = !this.isScrollActive;
    }

    isSinglePostView() {
        return location.pathname.startsWith("/posts/"); // or another condition if necessary
    }

    newsLetterListener () {

        buttonService.newsLetterBtn.addEventListener('click', () => {
            modalService.showModal("subscribeModal");
        });
        buttonService.showUnsubBtn.addEventListener('click', () => {
            modalService.hideModal("subscribeModal");
            modalService.showModal("unsubscribeModal");
        } )
    }
    newsLetterSubListener (){
        document.getElementById('newsletterForm').addEventListener('submit', async(e) => {
            e.preventDefault();
            let subedEmail = document.getElementById("newsletterEmail").value;
            const url = `https://localhost:7073/api/NewsLetters?email=${subedEmail}`;
            console.log(subedEmail);
            
            let result = await apiCaller.fetchFromDB(url, "POST");
            if(result.status === 201){
                this.alert(this.successAlert, 'Successfully subscribed!');
                modalService.hideModal("subscribeModal");
                return;
            }
            this.alert(this.warningAlert, `Couldn't subscribe successfully!`);
        });
        buttonService.newsLetterSubCloseBtn.addEventListener('click', () => {
            modalService.hideModal("subscribeModal");
        } );
    }
    newsLetterUnsubListener (){
        document.getElementById('newsletterUnsubscribeForm').addEventListener('submit', async(e)=> {
            e.preventDefault();
            let unsubedEmail = document.getElementById("unsubNewsletterEmail").value;
            const url = `https://localhost:7073/api/NewsLetters?email=${unsubedEmail}`;
            let result = await apiCaller.fetchFromDB(url, "DELETE");
            if(result.status === 200){
                this.alert(this.successAlert, 'Successfully unsubscribed!');
                modalService.hideModal("unsubscribeModal");
                return;
            } 
            this.alert(this.warningAlert, `Couldn't unsubscribe!`);
        });
        buttonService.newsLetterUnsubCloseBtn.addEventListener('click', ()=> {
            modalService.hideModal("unsubscribeModal");
        });
 
    }
    loginListener(){
        document.getElementById("loginBtn").addEventListener('click', ()=>{            
            modalService.showModal("loginModal");
        });

    }
    loginModalListener(){
        document.getElementById('loginForm').addEventListener('submit', async(e)=> {
            e.preventDefault();
            let loginEmail = document.getElementById("loginEmail").value;
            let loginPass = document.getElementById("loginPassword").value;
            let body = {
                email: loginEmail ,
                password: loginPass
            }
            const url = `https://localhost:7073/api/User/login`;
            let result = await apiCaller.fetchFromDB(url, "POST", body);
            
            if (result.token) {
                this.alert(this.successAlert, 'Successfully logged in!');
                sessionService.Set(result);
                let isAdmin = sessionService.GetParsedToken();
                if (isAdmin.token.isAdmin === "False") {
                    navbarService.loggedInNavbar();
                    
                } else {
                    navbarService.adminNavbar();
                }
                this.logoutListener();        
                this.themeListener();
                this.createPostListener();
                modalService.hideModal("loginModal");
                return;
            }
            this.alert(this.warningAlert, 'Invalid credentials!');
        });
        buttonService.logginCloseBtn.addEventListener('click', ()=> {
            modalService.hideModal("loginModal");
        });
    }
    logoutListener() {
        document.getElementById('logoutBtn').addEventListener('click', ()=> {           
            sessionService.Remove();
            navbarService.defaultNavbar();
            this.loginListener();
            this.loginModalListener();
            this.themeListener();
        });
    }
    themeListener (){
        document.getElementById("lightDarkToggle").addEventListener('click',()=>{
            themeService.lightDarkChek();
        })
    }

    createPostListener() {
        document.getElementById("createPostBtn").addEventListener('click', ()=> {
            modalService.showModal("createPostModal");
        });
        this.closeCreatePostListener();
        this.createPostModalListener();

    }
    closeCreatePostListener() {
        document.getElementById("closeCreatePostModal").addEventListener('click', async(e) =>{
            e.preventDefault();
            modalService.hideModal("createPostModal");
        })
    }
    createPostModalListener () {
        document.getElementById("newPostBtn").addEventListener('click', async (e)=>{
            if (this.isSubmitting) return; // Prevents duplicate requests
            this.isSubmitting = true;
            e.preventDefault();
            console.log("btn clicked");
            const newPostTitle = document.getElementById("newPostTitle").value;
            const newPostText = document.getElementById("newPostText").value;
            const postTags = Array.from(document.querySelectorAll('.custom-control-input:checked')).map(cb => cb.value);
            const imageNumber = document.getElementById('imgRange').value ;
            const newPostDescription = document.getElementById("newPostDescription").value;

            const fetchedImage = uploadImageService.uploadedImage;
            // const fetchedImageSrc = fetchedImage.children[0].currentSrc.slice(fetchedImage.children[0].currentSrc.indexOf(',') + 1, fetchedImage.children[0].currentSrc.length - 1);

            if(postTags.length == 0 || newPostText == '' || newPostTitle == '' || newPostDescription == ''){
                users.alert('warningAlert',"You must fill the fields and select 1 tag");
                return;
            }

            let post = {};
            const url = `https://localhost:7073/api/posts/create`;
            if (fetchedImage) {
              post = {
                title: newPostTitle,
                text: newPostText,
                description: newPostDescription,
                tags: postTags,
                ImageFile: fetchedImage,
              };
            } else {
              post = {
                title: newPostTitle,
                text: newPostText,
                tags: postTags,
                imageId: imageNumber,
                description: newPostDescription,
              };
            }

            console.log(post);
            var user = sessionService.Get();

            try {
                let result = await apiCaller.fetchFromDB(url, "POST", post, user.token);
                console.log(result);
                this.alert(this.successAlert, 'Successfully created post!');
                setTimeout(() => modalService.hideModal("createPostModal"), 100);
            } catch (error) {
                this.alert(this.warningAlert, `Post wasn't created successfully!`);
            } finally {
                this.isSubmitting = false;
            }

            setTimeout(() => modalService.hideModal("createPostModal"), 100);
        });
        buttonService.closeCreatePostModal.addEventListener('click', (e)=> {
            e.preventDefault();
            modalService.hideModal("createPostModal");
        })
    }

    editPostModalListener(){

        buttonService.editPostSaveBtn.addEventListener('click', async (e)=>{
            e.preventDefault();
            console.log("save clicked");
            let modal = document.querySelector("#editPostModal");
            let titleValue = modal.querySelector('#editPostTitle').value;
            let textValue = modal.querySelector('#editPostText').value;
            let descriptionValue = modal.querySelector('#editPostDescription').value;

            const user = sessionService.Get();
            if(!user){
                console.log("YOu must be logged in");
                modalService.showModal("loginModal");
                this.loginModalListener();
                return;
            }

            if(!titleValue || !textValue || !descriptionValue){
                this.alert(this.warningAlert,`Please don't leave any empty fields!`);
                return;
            }
            const body = {
                title: titleValue,
                description: descriptionValue,
                text: textValue,
                id: this.currentEditPostId
            }
            const result = await apiCaller.fetchFromDB('https://localhost:7073/api/Posts/update', "PUT", body, user.token);
            if(result.status === 200){
                this.alert(this.successAlert, "Successfully updated the post!");
                document.querySelector('.card-title').innerText = titleValue;
                document.querySelector('.singleCard-text').innerText = textValue;
                modalService.hideModal('editPostModal');
                return;
            }
            this.alert(this.warningAlert, "Post wasn't updated successfully!");
        })

        buttonService.closeEditPostModal.addEventListener('click', (e)=>{
            e.preventDefault();
            console.log("close clicked");
            
            modalService.hideModal("editPostModal");
        })
    }

    addStarEventListeners() {

        document.querySelectorAll('input[name="rating"]').forEach(star => {
            star.addEventListener('click', async (event) => {
                const rating = event.target.value;
                let user = sessionService.Get();
                if (user != undefined || user != null) {
                    if ((this.currentRating == 0 || this.currentRating == null) && rating != this.currentRating) {
                        await apiCaller.fetchFromDB("https://localhost:7073/api/Stars/AddRating", "POST", {userId: user.id, postId: this.currentPostId, rating: rating}, user.token);
                        this.paintStars(rating);
                        this.currentRating = rating;
                        this.alert(this.successAlert, 'Successfully added rating!');
                        return
                    }
                    if (this.currentRating == rating) {

                        await apiCaller.fetchFromDB("https://localhost:7073/api/Stars/RemoveRating", "DELETE", { userId: user.id, postId: this.currentPostId }, user.token);
                        this.clearStars();
                        this.currentRating = rating;
                        this.alert(this.successAlert, 'Successfully removed rating!');
                        // event.target.checked = false;
                        // this.currentRating = null;
                        // console.log("Rating cleared");
                    } else {
                        // this.currentRating = rating;
                        console.log(`User selected ${rating} star(s)`);
                        await apiCaller.fetchFromDB("https://localhost:7073/api/Stars", "PUT", { userId: user.id, postId: this.currentPostId, rating: rating }, user.token);
                        this.paintStars(rating);
                        this.currentRating = rating;
                        this.alert(this.successAlert, 'Successfully updated rating!');
                    }
                } else {
                    modalService.showModal("loginModal");
                    this.loginModalListener();
                    this.clearStars();
                };
            });
        });

    }

    paintStars(number){
        let stars = Array.from(document.querySelectorAll('input[name="rating"]'));
                let sortedStars = stars.sort((a,b) => a.value - b.value);
                sortedStars.forEach(star => {
                if (star.value <= number){
                    star.checked = true;
                } else {
                    return
                }
            });
    }

    clearStars() {
        let stars = Array.from(document.querySelectorAll('input[name="rating"]'));
        stars.forEach(star => {
            star.checked = false;
        })
    }

    updateCurrentPostId(id){
        this.currentPostId = id;
    }

    commentListener(){
        document.getElementById('commentForm').addEventListener('submit', async(e)=>{
            e.preventDefault();
            const commentNameElement = document.getElementById("commentName");
            const commentTextElement = document.getElementById("commentText");

            const commentName = commentNameElement.value || "Anonymous";
            const commentText = commentTextElement.value;

            const user = sessionService.Get();
            if(!user){
                console.log("YOu must be logged in");
                modalService.showModal("loginModal");
                this.loginModalListener();
                return
            }
            if(commentText === null || commentText == ""){
                console.log("Invalid comment");
                
                return 
            }
            let url = "https://localhost:7073/api/Comment";
            let response = await apiCaller.fetchFromDB(url, "POST", {postId: this.currentPostId, name: commentName, text: commentText}, user.token);
            let commentContainer = document.getElementById("addedComments");
            let comment = document.createElement("div");
            comment.innerHTML = `
                <div class="comment" data-id="${response.id}">
                    <span class="user">${commentName}</span>
                    <span class="date">${new Date().toLocaleString()}</span>
                    <p class="text">${commentText}</p>
                    <button class ="btn btn-danger commentDelete">Delete</button>
                    <button class ="btn btn-warning commentEdit">Edit</button>
                </div>
        
            `;

            commentNameElement.value = '';
            commentTextElement.value = '';
            commentContainer.insertAdjacentElement("afterbegin", comment);
            this.alert(this.successAlert, 'Successfully added comment!');
            this.editCommentListener();
            this.deleteCommentListener();
        });
    }

    editCommentListener(){
        const editButtons = document.getElementsByClassName("commentEdit");
        Array.from(editButtons).forEach(button => {
            button.addEventListener('click', async (e) => {
                e.preventDefault();
    
                const user = sessionService.Get();
                if (!user) {
                    console.log("You must be logged in");
                    modalService.showModal("loginModal");
                    this.loginModalListener();
                    return;
                }
    
                const commentElement = button.closest(".comment");
    
                const commentId = commentElement.dataset.id;
                const elements = commentElement.children;
                const commentName = elements[0].innerHTML;
                const commentDate = elements[1].innerHTML;
                const commentText = elements[2].innerHTML;  
    
                commentElement.innerHTML = `
                    <form id="commentEditForm" data-id="${commentId}">
                        <label for="editCommentText">Edit text</label>
                        <textarea id="editCommentText" name="commentText" placeholder="Type your comment here..." required>${commentText}</textarea>
                        <button type="submit" class="btn btn-success" id="editCommentPostBtn">Done</button>
                    </form>
                `;
    
                document.getElementById("commentEditForm").addEventListener("submit", async(e) => {
                    e.preventDefault();
    
                    const user = sessionService.Get();
                    if (!user) {
                        console.log("You must be logged in");
                        modalService.showModal("loginModal");
                        this.loginModalListener();
                        return;
                    }
    
                    let editedText = document.getElementById("editCommentText").value;
    
                    if (editedText === '') {
                        editedText = commentText;
                    } else{
                        console.log('commentId:', commentId);
                        console.log('editing..');
                        await apiCaller.fetchFromDB('https://localhost:7073/api/Comment', "PUT", {userId: user.id, text: editedText, id: commentId}, user.token);
                        this.alert(this.successAlert, 'Successfully updated comment!');
                    }
    
                    commentElement.innerHTML = `
                        <span class="user">${commentName}</span>
                        <span class="date">${commentDate}</span>
                        <p>${editedText}</p>
                        <button class="btn btn-danger commentDelete">Delete</button>
                        <button class="btn btn-warning commentEdit">Edit</button>
                    `;
    
                    this.editCommentListener();
                    this.deleteCommentListener();
                });
            });
        });
    }

    deleteCommentListener(){
        const deleteButtons = document.getElementsByClassName("commentDelete");
        Array.from(deleteButtons).forEach(button =>{
            button.addEventListener('click', async(e)=>{
                    e.preventDefault();
            
                        const user = sessionService.Get();
                        if (!user) {
                            console.log("You must be logged in");
                            modalService.showModal("loginModal");
                            this.loginModalListener();
                            return;
                        }
        
                        const comment = (button.closest(".comment"));
                        const commentId = comment.dataset.id;

                        console.log("deleting comment...");
        
                        let result = await apiCaller.fetchFromDB('https://localhost:7073/api/Comment', 'DELETE', {id: commentId, userId: user.id }, user.token);
                        if (result.status !== 200){
                            this.alert(this.warningAlert, `Comment wasn't deleted successfully!`);
                            return;
                        }
                        this.alert(this.successAlert, 'Successfully deleted comment!');
                        comment.remove();
            })
        })
    }
    loggedInNavBarListeners(){
        this.createPostListener();
        this.logoutListener();
        this.newsLetterListener();
    }

    editUser(){

    }

    changeToSaveBtn(btn, id){
        btn.id = id;
        btn.classList.remove("btn-outline-warning");
        btn.classList.add("btn-outline-success");
        btn.innerHTML = "Save";
        console.log(btn);
    }
    changeToEditBtn(btn, id){
        btn.id = id;
        btn.classList.remove("btn-outline-success");
        btn.classList.add("btn-outline-warning");
        btn.innerHTML = "Edit";
        console.log(btn);
        return btn;
    }

    saveUserSettings = async(data) =>{
        const found = sessionService.Get();
        if(found){
            found.firstName = data.firstName;
            found.lastName = data.lastName;
            found.email = data.email;
            sessionService.Set(found);

            document.getElementById("settingsWelcomeMessage").innerHTML = `Hi ${found.firstName} ${found.lastName}!`;
            
            const response = await apiCaller.fetchFromDB("https://localhost:7073/api/user", "PUT", data, found.token);
            this.alert(this.successAlert, 'Successfully updated!');
            console.log(response);
        }
    }

    settingsListener() {
        const editFirstNameBtn = document.getElementById("firstNameSettingsBtn");
        const editLastNameBtn = document.getElementById("lastNameSettingsBtn");
        const editEmailBtn = document.getElementById("emailSettingsBtn");
    
        const firstNameSettings = document.getElementById("firstNameSettings");
        const lastNameSettings = document.getElementById("lastNameSettings");
        const emailSettings = document.getElementById("emailSettings");
    
        const toggleEditSave = (btn, input, editId, saveId) => {
            if (input.disabled) {
                input.disabled = false;
                this.changeToSaveBtn(btn, saveId);
            } else {
                input.disabled = true;
                this.changeToEditBtn(btn, editId);
    
                const updatedData = {
                    firstName: firstNameSettings.value,
                    lastName: lastNameSettings.value,
                    email: emailSettings.value
                };
    
                this.saveUserSettings(updatedData);
            }
        };
    
        editFirstNameBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleEditSave(editFirstNameBtn, firstNameSettings, "firstNameSettingsBtn", "saveFirstNameBtn");
        });
    
        editLastNameBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleEditSave(editLastNameBtn, lastNameSettings, "lastNameSettingsBtn", "saveLastNameBtn");
        });
    
        editEmailBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleEditSave(editEmailBtn, emailSettings, "emailSettingsBtn", "saveEmailBtn");
        });
    }

    editPostListener() {
        let editBtn = document.getElementById("editPostBtn");
        if (editBtn) {
            const editPostId = editBtn.value;
            this.currentEditPostId = editPostId;
            console.log(editPostId);
            
            editBtn.addEventListener('click', async(e) => {
                e.preventDefault();

                const user = sessionService.Get();
                if(!user){
                    console.log("YOu must be logged in");
                    modalService.showModal("loginModal");
                    this.loginModalListener();
                    return
                }
    
                const fetchedPost = await apiCaller.fetchFromDB(`https://localhost:7073/api/Posts/${editPostId}`, "GET");
                console.log(fetchedPost);
                
                let modal = document.querySelector("#editPostModal");
                modal.querySelector('#editPostTitle').value = fetchedPost.title;
                modal.querySelector('#editPostText').value = fetchedPost.text;
                modal.querySelector('#editPostDescription').value = fetchedPost.description;

                modalService.showModal("editPostModal");
            });
        }
    }
    MyPostsListener(){
        const deleteButtons = document.getElementsByClassName("deletePost");
        Array.from(deleteButtons).forEach(button => {
            button.addEventListener('click', async(e) =>{
                e.preventDefault();

                const user = sessionService.Get();
                if(!user){
                    console.log("You must be logged in");
                    modalService.showModal("loginModal");
                    this.loginModalListener();
                    return;
                }
                
                const postToBeDeleted = button.closest('.card');
                const postId = button.value;
                
                console.log('Deleting post...');
                
                const result = await apiCaller.fetchFromDB(`https://localhost:7073/api/posts/delete/${postId}`, 'DELETE', null, user.token);
                console.log(result);
                if(result.status === 200){
                    postToBeDeleted.remove();
                    this.alert(this.successAlert, `Successfully deleted post!`);
                    return;
                } 
                this.alert(this.warningAlert, `Post wasn't deleted successfully!`);
            })
        })
    }

    MonthFilterListener () {
        buttonService.monthFilter.addEventListener("click", (e) => {
            e.preventDefault();
            modalService.showModal("monthModal");

        });
        this.MonthModalListener();
    }
    MonthModalListener () {
        buttonService.monthmodalSubmitBtn.addEventListener("click", async (e)  => {
            e.preventDefault();
            let dateValue = document.getElementById("dateValue").value;
            console.log(dateValue);
            let splitValues = dateValue.split("-");
            console.log(splitValues);
            let year = splitValues[0];
            let month = splitValues[1];
            
            postFilterService.updateFilter({undefined, undefined, undefined, tags: [""] , year, month});
            let filters = postFilterService.getFilters();
            let response = await apiCaller.fetchFromDB(`https://localhost:7073/api/Posts`, "POST", filters);
            console.log(response);
            
            modalService.hideModal("monthModal");
        });
        
        buttonService.closeCreatePostModal.addEventListener("click", (e) =>{
            e.preventDefault();
            modalService.hideModal("monthModal");
        } )

    }
    
    
    
}

const eventService = new EventService();
export default eventService;