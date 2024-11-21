import postFilterService from "./PostFilterService.js";
import apiCaller from "./ApiCaller.js";
import ButtonService from "./ButtonService.js"
// import modalService from "./ModalService.js";
import ModalService from "./ModalService.js";
import SessionService from "./SessionService.js";
import NavbarService from "./NavbarService.js";
import themeService from "./ThemeService.js";
import UploadImgService from "./UploadImgService.js";
import loadingSpinnerService from "./loadingSpinnerService.js";

const uploadImageService = new UploadImgService("drop-area", "drop-preview", "uploadImage");
const uploadBannerService = new UploadImgService("banner-drop-area", "banner-drop-preview", "uploadAdBannerInput");
const navbarService = new NavbarService();
const sessionService = new SessionService();
const buttonService = new ButtonService();
const modalService = new ModalService();

class EventService {
    constructor() {
        this.windowRefreshListener();
        this.currentEditPostId = null;
        this.currentPostId = null;
        this.currentPostAuthorId = null;
        this.currentRating = null;
        this.isScrollActive = true;
        this.firstScrollReached = false;
        this.isSubmitting = false;
        this.authorId = null;
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
        this.signUpListener();
        this.TagDropdownListener ();
        // this.SearchPostsListener ();


        this.warningAlert = 'warningAlert';
        this.successAlert = 'successAlert';
        // this.logoutListener(); 
        // this.addStarEventListeners();
    }
    get isSubmitting() {
        return this._isSubmitting;
    }
    
    set isSubmitting(value) {
        if (this._isSubmitting !== value) {
            const stackTrace = new Error().stack;
            console.log(`isSubmitting changed: ${this._isSubmitting} -> ${value}`);
            console.log(`Changed at: ${stackTrace}`);
        }
        this._isSubmitting = value;
    }
    signUpListener() {
        const form = document.querySelector("#signUpForm");
        form.addEventListener('submit', async(e) => {
            e.preventDefault();
            console.log("Attempting to sign up!");
            const signUpFirstNameElement = document.querySelector("#signUpFirstName");
            const signUpLastNameElement = document.querySelector("#signUpLastName");
            const signUpEmailElement = document.querySelector("#signUpEmail");
            const signUpPasswordElement = document.querySelector("#signUpPassword");
            const signUpPasswordCheckElement = document.querySelector("#signUpPasswordCheck");

            const signUpFirstName = signUpFirstNameElement.value;
            const signUpLastName = signUpLastNameElement.value;
            const signUpEmail = signUpEmailElement.value;
            const signUpPassword = signUpPasswordElement.value;
            const signUpPasswordCheck = signUpPasswordCheckElement.value;
            console.log(`${signUpFirstName}\n${signUpLastName}\n${signUpEmail}\n${signUpPassword}\n${signUpPasswordCheck}`);
            const body = {
                firstName: signUpFirstName,
                lastName: signUpLastName,
                email: signUpEmail, 
                password: signUpPassword,
                confirmPassword: signUpPasswordCheck
            }

            const result = await apiCaller.fetchFromDB(`https://localhost:7073/api/User/register`, 'POST', body);
            if(result.status === 200){
                this.alert(this.successAlert, 'You have successfully signed up the account!\nYou can now sign in.');
                signUpFirstNameElement.value = '';
                signUpLastNameElement.value = '';
                signUpEmailElement.value = '';
                signUpPasswordElement.value = '';
                signUpPasswordCheckElement.value = '';
                modalService.hideModal("signUpModal");
                modalService.showModal("loginModal");
                return;
            }
            this.alert(this.warningAlert, 'Something went wrong!');


        })
        buttonService.showSignUpBtn.addEventListener('click', (e) =>{
            e.preventDefault();

            modalService.hideModal("loginModal");
            modalService.showModal("signUpModal");
        });
        buttonService.closeSignUpModalBtn.addEventListener('click', (e) =>{
            e.preventDefault();
            
            modalService.hideModal("signUpModal");
        })
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
        
        try {

            console.log("starting to fetch next page");
            // console.log(postFilterService.filters);
            const filters = postFilterService.getFilters();
            // console.log(filters);
            
            if (postFilterService.filters.pageIndex < postFilterService.filters.totalPages) {
                postFilterService.updateFilter({ pageIndex: filters.pageIndex + 1 });
                
                const newPosts = await apiCaller.fetchFromDB(`https://localhost:7073/api/Posts`, "POST", filters);
    
                this.appendPostsToView(newPosts.posts);
                themeService.themeCheck();
            }
        } catch (error) {
            console.error(error);
        } finally {
            this.isSubmitting = false;
        }
    }

    windowRefreshListener(){
        window.addEventListener('load', async (e)=>{
            const user = sessionService.Get();
            if(!user) return;
            let isAdmin = sessionService.GetParsedToken();
            
            if(isAdmin.token.isAdmin === "True"){
                navbarService.adminNavbar();
            }else{
                navbarService.loggedInNavbar();                
            }
            buttonService.fetchAllButtons();
            this.newsLetterListener();
            this.logoutListener();        
            this.themeListener();
            this.createPostListener();
            // this.logoutListener();
            // this.createPostListener();
        })
    }

    appendPostsToView(posts) {
        const contentPart = document.querySelector("#contentPart");
        let resultHtml = "";
        posts.forEach(post => {
            const date = new Date(post.postingTime);
            post.postingTime = date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",  // Ex: Sep, Oct, Nov
                year: "numeric"
            });
        })
        posts.forEach(element => {
            element.tags = element.tags.map(x => `#${x}`).join(' ');
            let imgSrc = `data:image/png;base64,${element.image}`;
            resultHtml += 
            `
                <div class="card" style="width: 25vw" id="card-${element.id}">
                    <img class="card-img-top img-fluid imgLink" src="${imgSrc}" style="object-fit: fill; height: 20vw;" alt="Image should be here" value="${element.id}">
                    <div class="card-body title">
                        <a class="post-link" href="posts/${element.id}" data-link><h5 class="card-title">${element.title}</h5></a>
                        <h6>By ${element.user.fullname} - <small>${element.postingTime}</small></h6>
                        <p class="card-text">${element.description}</p>
                    </div>
                    <div class="card-body icons">
                        <div>
                            <p>${element.rating} <img src="/data/icons/star.svg" alt="Star Icon" class="starsIcon"> ${element.rating !== 0 ? `(${element.ratings !== 1 ? `${element.ratings} ratings` : `${element.ratings} rating`})` : ''}</p>
                        </div>
                        <div>
                            <p>${element.comments} <img src="/data/icons/chat-right.svg" alt="Comment Icon" class="commentsIcon"></p>
                        </div>
                        <br>
                        <div class="tags">
                            <button type="button" class="btn btn-secondary btn-sm disabled">${element.tags}</button>
                        </div>  
                    </div>
                </div>
                        `
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
            const url = `https://localhost:7073/api/NewsLetters/${subedEmail}`;
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
            const url = `https://localhost:7073/api/NewsLetters/${unsubedEmail}`;
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
            this.loginModalListener();   
            modalService.showModal("loginModal");
        });

    }
    // loginModalListener(){
    //     document.getElementById('loginForm').addEventListener('submit', async(e)=> {
    //         e.preventDefault();
    //         let loginEmail = document.getElementById("loginEmail").value;
    //         let loginPass = document.getElementById("loginPassword").value;
    //         let body = {
    //             email: loginEmail ,
    //             password: loginPass
    //         }
    //         const url = `https://localhost:7073/api/User/login`;
    //         let result = await apiCaller.fetchFromDB(url, "POST", body);
            
    //         if (result.token) {
    //             this.alert(this.successAlert, 'Successfully logged in!');
    //             sessionService.Set(result);
    //             let isAdmin = sessionService.GetParsedToken();
    //             if (isAdmin.token.isAdmin === "False") {
    //                 navbarService.loggedInNavbar();
    //                 buttonService.fetchAllButtons();
    //             } else {
    //                 navbarService.adminNavbar();
    //                 buttonService.fetchAllButtons();
    //             }
    //             // document.getElementById("newsletterBtn").addEventListener("click",() => {
    //             //     console.log("itworks");
                    
    //             // })
    //             this.newsLetterListener();
    //             this.logoutListener();        
    //             this.themeListener();
    //             this.createPostListener();
    //             modalService.hideModal("loginModal");
    //             return;
    //         }
    //         this.alert(this.warningAlert, 'Invalid credentials!');
    //     });
    //     buttonService.logginCloseBtn.addEventListener('click', ()=> {
    //         modalService.hideModal("loginModal");
    //     });
    // }

    loginModalListener() {
        document.getElementById("loginForm").addEventListener("submit", async (e) => {
            e.preventDefault();
    
            // Prevent duplicate submissions
            if (this.isSubmitting) return;
            this.isSubmitting = true;
    
            console.log("Attempting to log in...");
    
            // Gather input values
            const loginEmail = document.getElementById("loginEmail").value;
            const loginPass = document.getElementById("loginPassword").value;
            const body = { email: loginEmail, password: loginPass };
            const url = `https://localhost:7073/api/User/login`;
    
            try {
                // Call the API
                const result = await apiCaller.fetchFromDB(url, "POST", body);
    
                // Handle successful login
                if (result?.token) {
                    console.log("Login successful:", result);
                    this.alert(this.successAlert, "Successfully logged in!");
                    sessionService.Set(result);
    
                    // Check if user is admin
                    const isAdmin = sessionService.GetParsedToken();
                    if (isAdmin?.token?.isAdmin === "False") {
                        navbarService.loggedInNavbar();
                    } else {
                        navbarService.adminNavbar();
                    }
    
                    // Reinitialize necessary listeners
                    buttonService.fetchAllButtons();
                    this.newsLetterListener();
                    this.logoutListener();
                    this.themeListener();
                    this.createPostListener();
    
                    // Hide the login modal
                    modalService.hideModal("loginModal");
                } else {
                    // Invalid credentials
                    console.warn("Invalid login attempt.");
                    this.alert(this.warningAlert, "Invalid credentials!");
                }
            } catch (error) {
                console.error("Error during login:", error);
                this.alert(this.warningAlert, "An error occurred while logging in.");
            } finally {
                // Ensure the flag is always reset
                this.isSubmitting = false;
            }
        });
    
        // Event listener to close the login modal
        buttonService.logginCloseBtn.addEventListener("click", (e) => {
            e.preventDefault();
            modalService.hideModal("loginModal");
        });
    }
    

    logoutListener() {
        document.getElementById('logoutBtn').addEventListener('click', ()=> {           
            sessionService.Remove();
            navbarService.defaultNavbar();
            buttonService.fetchAllButtons();
            this.loginListener();
            this.loginModalListener();
            this.themeListener();
            this.newsLetterListener();

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
            this.ResetAllModals();
        })
    }

    createPostModalListener() {
        document.getElementById("newPostBtn").addEventListener("click", async (e) => {
            e.preventDefault();
    
            // Prevent duplicate submissions
            if (this.isSubmitting) return;
            this.isSubmitting = true;
    
            console.log("Creating a new post...");
    
            // Gather form values
            const newPostTitle = document.getElementById("newPostTitle").value;
            const newPostText = document.getElementById("newPostText").value;
            const newPostDescription = document.getElementById("newPostDescription").value;
            const postTags = Array.from(document.querySelectorAll(".custom-control-input:checked")).map(cb => cb.value);
            const imageNumber = document.getElementById("imgRange").value;
            const fetchedImage = uploadImageService.uploadedImage;
    
            // Validate inputs
            if (!newPostTitle || !newPostText || !newPostDescription || postTags.length === 0) {
                this.alert("warningAlert", "You must fill all fields and select at least one tag.");
                this.isSubmitting = false;
                return;
            }
    
            // Create the post object
            const post = fetchedImage
                ? {
                    title: newPostTitle,
                    text: newPostText,
                    description: newPostDescription,
                    tags: postTags,
                    ImageFile: fetchedImage,
                  }
                : {
                    title: newPostTitle,
                    text: newPostText,
                    description: newPostDescription,
                    tags: postTags,
                    imageId: imageNumber,
                  };
    
            console.log("Post object:", post);
    
            // Send API request
            try {
                const user = sessionService.Get();
                const url = `https://localhost:7073/api/posts/create`;
                const result = await apiCaller.fetchFromDB(url, "POST", post, user.token);
    
                console.log("API response:", result);
                this.alert(this.successAlert, "Successfully created post!");
                modalService.hideModal("createPostModal");
                this.ResetAllModals();
            } catch (error) {
                console.error("Error creating post:", error);
                this.alert(this.warningAlert, "Post wasn't created successfully!");
            } finally {
                this.isSubmitting = false;
            }
        });
    
        // Add listener for closing the modal
        buttonService.closeCreatePostModal.addEventListener("click", (e) => {
            e.preventDefault();
            modalService.hideModal("createPostModal");
            this.ResetAllModals();
        });
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
                this.ResetAllModals();
                return;
            }
            this.alert(this.warningAlert, "Post wasn't updated successfully!");
        })

        buttonService.closeEditPostModal.addEventListener('click', (e)=>{
            e.preventDefault();
            console.log("close clicked");
            
            modalService.hideModal("editPostModal");
            this.ResetAllModals();
        })
    }

    addStarEventListeners() {

        document.querySelectorAll('input[name="rating"]').forEach(star => {
            star.addEventListener('click', async (event) => {
                const rating = event.target.value;
                const user = sessionService.Get();
                if (user != undefined || user != null) {
                    //  check if the current user id is the same as the author's id in the current post and don't allow the rating to be applied
                    if(this.currentPostAuthorId === user.id){
                        this.alert(this.warningAlert, 'You can\'t rate your own post!');
                        this.clearStars();
                        return;
                    }
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
            if(this.isSubmitting) return;
            this.isSubmitting = true;
            e.preventDefault();
            const commentNameElement = document.getElementById("commentName");
            const commentTextElement = document.getElementById("commentText");

            const commentName = commentNameElement.value || "Anonymous";
            const commentText = commentTextElement.value;

            const user = sessionService.Get();
            if(!user){
                console.log("You must be logged in");
                modalService.showModal("loginModal");
                this.loginModalListener();
                this.isSubmitting = false;
                return;
            }
            if(commentText === null || commentText == ""){
                console.log("Invalid comment");
                this.alert(this.warningAlert, "Please ensure the comment has a body!");
                this.isSubmitting = false;
                return 
            }
            let url = "https://localhost:7073/api/Comment";
            let response = await apiCaller.fetchFromDB(url, "POST", {postId: this.currentPostId, name: commentName, text: commentText}, user.token);
            if(response.status !== 201){
                this.alert(this.warningAlert, "The comment wasn't created successfully!");
                return;
            }
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
            this.isSubmitting = false;
        });
    }

    editCommentListener() {
        
        const editButtons = document.getElementsByClassName("commentEdit");
        Array.from(editButtons).forEach(button => {
            button.addEventListener('click', async (e) => {
                e.preventDefault();
                
                try {
                    if (this.isSubmitting) return;
                    this.isSubmitting = true;
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
    
                    document.getElementById("commentEditForm").addEventListener("submit", async (e) => {
                        e.preventDefault();
    
                        try {
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
                            } else {
                                console.log('commentId:', commentId);
                                console.log('editing..');
                                await apiCaller.fetchFromDB('https://localhost:7073/api/Comment', "PUT", { userId: user.id, text: editedText, id: commentId }, user.token);
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
                        } catch (error) {
                            console.error('Error updating comment:', error);
                            // Handle any error that occurs during the fetch request
                        } finally {
                            this.isSubmitting = false;
                        }
                    });
                } catch (error) {
                    console.error('Error during comment editing process:', error);
                } finally {
                    this.isSubmitting = false;
                }
            });
        });
    }
    
    deleteCommentListener(){
        const deleteButtons = document.getElementsByClassName("commentDelete");
        Array.from(deleteButtons).forEach(button =>{
            button.addEventListener('click', async(e)=>{
                    if(this.isSubmitting) return;
                    this.isSubmitting
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
                this.ResetAllModals();
            });
        }
    }

    deletePostListener(){
        let deleteBtn = document.getElementById("deletePostBtn");
        console.log(deleteBtn);
        if(deleteBtn !== null){
            deleteBtn.addEventListener('click', async(e)=>{
                e.preventDefault();

                const user = sessionService.Get();
                if(!user){
                    console.log("YOu must be logged in");
                    modalService.showModal("loginModal");
                    this.loginModalListener();
                    return
                }

                const deleteButtonId = deleteBtn.value;
                console.log(deleteButtonId);

                const fetchedPost = await apiCaller.fetchFromDB(`https://localhost:7073/api/Posts/delete/${deleteButtonId}`, "DELETE", null, user.token);
                console.log(fetchedPost);

                if(fetchedPost.status === 200){
                    document.querySelector("#contentPart").innerHTML = `
                    <h1 style="text-align: center; margin-top: 30px;">This post is now deleted!</h1>
                  `;
                    this.alert(this.successAlert, `Successfully deleted post!`);
                    return;
                } 
                this.alert(this.warningAlert, `Post wasn't deleted successfully!`);
                
            })

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
            if (this.isSubmitting) return; // Prevents duplicate requests
            this.isSubmitting = true;
            e.preventDefault();
            try {
                modalService.hideModal("monthModal");
                this.ResetAllModals();
            } catch (error){
                console.log(error);
                
            } finally {

                this.isSubmitting = false;
            }
        });
        
        buttonService.monthModalCloseBtn.addEventListener("click", (e) =>{
            e.preventDefault();
            modalService.hideModal("monthModal");
        } )

    }

    TagDropdownListener (){
        buttonService.tagFilterDropdownBtn.addEventListener("click", function() {
            console.log("it worksz");
            var tagDropdown = document.getElementById('tagFilterDropdown');
            if (tagDropdown.style.display === 'none' || tagDropdown.style.display === '') {
                tagDropdown.style.display = 'block';
            } else {
                tagDropdown.style.display = 'none';
            }
        });
    }

    DeleteAccountListener(){
        document.getElementById("deleteUserBtn").addEventListener("click",  ()=>{
        console.log("your in brother");
        modalService.showModal("deleteUserModal");            
    });
        document.getElementById("confirmDeleteUserBtn").addEventListener("click",async (e)=>{
            e.preventDefault();

            let user = sessionService.Get()
            if(user){
                let response = await apiCaller.fetchFromDB(`https://localhost:7073/api/User/${user.id}`, "DELETE",null, user.token);
                console.log(response);
            }
            if (response){}

        });
        document.getElementById("cancelDeleteUserBtn").addEventListener("click", ()=>{
            modalService.hideModal("deleteUserModal");
        });
        document.getElementById("deleteUserClose").addEventListener("click",(e)=>{
            e.preventDefault();
            modalService.hideModal("deleteUserModal");
        });
    }

    DeleteUsersListener(){
        const deleteUserBtns = document.getElementsByClassName("delete-users");

        Array.from(deleteUserBtns).forEach(button => {
            button.addEventListener('click', async(e) =>{
                e.preventDefault();

                const user = sessionService.Get();
                if(!user){
                    console.log("You must be logged in");
                    modalService.showModal("loginModal");
                    this.loginModalListener();
                    return;
                }
                
                const userToBeDeleted = button.closest('.user');
                const userId = button.value;
                console.log(userId, userToBeDeleted);
                
                
                console.log('Deleting user');
                
                const result = await apiCaller.fetchFromDB(`https://localhost:7073/api/User/${userId}`, 'DELETE', null, user.token);
                console.log(result);
                if(result.status === 200){
                    userToBeDeleted.remove();
                    this.alert(this.successAlert, `Successfully deleted user!`);
                    return;
                } 
                this.alert(this.warningAlert, `User wasn't deleted successfully!`);
            })
        })
    }

    SubscribeAuthorListener () {
        document.getElementById("subscribeAuthor").addEventListener("click", async (e)=> {
            e.preventDefault();
            const user = sessionService.Get();
                if(!user){
                    this.alert(this.warningAlert,`You must be logged in first`)
                    modalService.showModal("loginModal");
                    this.loginModalListener();
                    return;
                }
                const foundDetailedUser = await apiCaller.fetchFromDB(`https://localhost:7073/api/User/usernewsletter`, "GET", null, user.token);
                if(!foundDetailedUser.isSubscribed){
                    this.alert(this.warningAlert,`You must be subscribed to our newsletter first`)
                    modalService.showModal("subscribeModal");
                    this.newsLetterSubListener();
                    return
                }
                let authorId = this.currentPostAuthorId;
                let result =  await apiCaller.fetchFromDB(`https://localhost:7073/api/NewsLetters`, "PUT", {email: user.email,tag:"", authorID: authorId});
                if(result.status === 200){
                    this.alert(this.successAlert, `Successfully subscribed to author!`);
                    let btn = document.querySelector(".subButton")
                    btn.innerText = 'Subscribed';
                    btn.disabled = true;
                    return;                
                }
                this.alert(this.warningAlert, `You didnt successfully subscribe`);
        });
    }

    UploadAdBannerModalListener(){
        document.querySelector("#uploadAdminBannerModalBtn").addEventListener('click', (e) => {
            e.preventDefault();
            modalService.showModal("uploadAdBanner");
        })
        document.querySelector("#closeUploadAdBanner").addEventListener('click', (e)=>{
            e.preventDefault();
            modalService.hideModal("uploadAdBanner");
        })
        this.UploadAdBannerListener();
    }
    UploadAdBannerListener(){
        document.querySelector("#uploadAdBannerBtn").addEventListener('click', async (e) => {
            e.preventDefault();
            if(this.isSubmitting) return;
            this.isSubmitting = true;
            console.log("Ad banner submit button clicked!");
            const user = sessionService.Get();
            if(!user){
                this.alert(this.warningAlert,`You must be logged in first`)
                modalService.showModal("loginModal");
                this.loginModalListener();
                this.isSubmitting = false;
                return;
            }
            const fetchedImage = uploadBannerService.uploadedImage;
            if(!fetchedImage){
                this.alert(this.warningAlert, 'Please provide an image first!');
                this.isSubmitting = false;
                return;
            }
            try{
                console.log(fetchedImage);
                const url = `https://localhost:7073/api/Image`;
                const body = {
                    userId: user.id,
                    imageFile: fetchedImage
                }
                const result = await apiCaller.fetchFromDB(url, "POST", body, user.token);
                if(result.status === 201){
                    const temporaryDataHolder = result.data;
                    const ImgSrc = `data:image/png;base64,${temporaryDataHolder}`;
                    document.querySelector("#adBannersContainer").innerHTML += `
                    <div class="card" style="width: 25vw" id="${result.id}">
                    <img class="card-img-top img-fluid imgLink" src="${ImgSrc}" style="object-fit: fill; height: 20vw;" alt="Image should be here">
                    <div class="card-body icons">
                    <button class="btn btn-outline-danger deleteBannerBtn">DELETE</button>
                    </div>
                    </div>
                    `
                    this.alert(this.successAlert, "The image was successfully uploaded!");
                    this.DeleteAdBannerListener();
                    modalService.hideModal("uploadAdBanner");
                    this.ResetAllModals();
                    return;
                }
                this.alert(this.warningAlert, "The image wasn't successfully uploaded!");
            }catch(error){
                console.error(error);
            }finally{
                this.isSubmitting = false;
            }
            
        })
    }
    DeleteAdBannerListener(){
        const deleteAdBannerBtns = document.getElementsByClassName("deleteBannerBtn");
        if(deleteAdBannerBtns && deleteAdBannerBtns.length > 0){

            Array.from(deleteAdBannerBtns).forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    if(this.isSubmitting) return;
                    this.isSubmitting = true;

                    let card = btn.closest('.card');
                    let id = card.id;
                    console.log(`Delete button with id ${id} was clicked!`);
                    
                    const user = sessionService.Get();
                    if(!user){
                        this.alert(this.warningAlert,`You must be logged in first`)
                        modalService.showModal("loginModal");
                        this.loginModalListener();
                        this.isSubmitting = false;
                        return;
                    }
                    try{
                        const url = `https://localhost:7073/api/Image/${id}`;
                        let result = await apiCaller.fetchFromDB(url, "DELETE", null, user.token);
                        if(result.status === 200){
                            card.remove();
                            this.alert(this.successAlert, "Successfully deleted the banner!");
                            this.ResetAllModals();
                            return;
                        }
                        this.alert(this.warningAlert, "The banner wasn't deleted successfully!");
                    }catch(error){
                        console.error(error);
                    } finally{
                        this.isSubmitting = false;
                    }
                })
            })
        }
    }

    ResetAllModals(){
        const modals = document.querySelectorAll('.modal');
    
        modals.forEach(modal => {
            const inputs = modal.querySelectorAll('input');
            
            inputs.forEach(input => {
                if (input.type === 'checkbox' || input.type === 'radio') {
                    input.checked = false;
                } else {
                    input.value = '';
                }
            });
    
            const textareas = modal.querySelectorAll('textarea');
            textareas.forEach(textarea => textarea.value = '');
        });
    
        const dropPreview = document.getElementById('drop-preview');
        if (dropPreview) {
            dropPreview.innerHTML = '';
        }
    }
}

const eventService = new EventService();
export default eventService;