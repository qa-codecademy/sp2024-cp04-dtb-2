import { Posts } from "./modules/posts.js";
import { Post } from "./modules/post.js";
import { Users } from "./modules/users.js";
import { getDataFromJson } from "./modules/dataService.js";
import { Newsletter } from "./modules/newsletterService.js";
import { mostPopularPostsLoader, newPostsLoader, oldPostsLoader, showTagPosts, taggedPosts, mostPopularPosts, oldPosts, newestPosts, searchPostsLoader, filteredPosts, authorPostsLoader, postsByAuthor, monthYear } from "./modules/filter.js";
import { aboutUsPageLoader } from "./modules/aboutUs.js";   
import { lightDarkChek } from "./modules/themeToggle.js";
import {apiCall} from "./modules/apiCall.js";
import { PostFilter } from "./modules/PostFilter.js";
import { ModalService } from "./modules/ModalService.js";

let apiCallz = new apiCall();

class PostService {
    constructor(){
        this.logoBtn = document.getElementById('logoBtn');
        this.homeBtn = document.getElementById('homeBtn');
        this.aboutBtn = document.getElementById('aboutBtn');
        this.logInBtn = document.getElementById('logInBtn');
        this.searchBtn = document.getElementById('searchBtn');
        this.darkModeBtn = document.getElementById('darkModeBtn');
        this.result = document.getElementById('contentPart');
        this.loadingIndicator = document.getElementById('loadIndicator');
        this.loadMoreBtn = document.getElementById("loadMoreBtn");
        this.firstScrollReached = false;
        this.filterDiv = document.getElementById("filterDiv");
        this.backBtn = document.getElementById("backBtn");
        this.logoImg = document.getElementById('logoImg');
        this.isDarkTheme = false;
        // this.
        


        aboutBtn.addEventListener("click", function (){
            aboutUsPageLoader();
            lightDarkChek();
        });
        logoImg.addEventListener('click',()=>{
            newPostsLoader(posts.storage);
            this.loadMoreBtn.style.display = 'block';
            this.filterDiv.style.display = "block";
            this.backBtn.style.display = "none";
            lightDarkChek();
        });
        homeBtn.addEventListener('click',()=>{
            postService.loadMoreBtn.style.display = "block";
            postService.filterDiv.style.display = "block";
            postService.backBtn.style.display = "none";
            this.result.setAttribute("style","max-width: min-content; max height: min-content; display: grid");
            newPostsLoader(posts.storage,posts.selectedFilter);
            this.loadMoreBtn.style.display = 'block';
            lightDarkChek();
        });
        
        backBtn.addEventListener("click", function(){
            function hasDuplicates(array) { //obsolite
                // Sort the array
                const sortedArray = array.slice().sort();
            
                // Check for duplicates by comparing adjacent elements
                for (let i = 0; i < sortedArray.length - 1; i++) {
                    if (sortedArray[i] === sortedArray[i + 1]) {
                        return true; // Duplicate found
                    }
                }
                return false; // No duplicates found
            }
            
            
            
            // } else {
                postService.lastPageLoaded.pop()
            
            // }

            
            postService.result.innerHTML = "";
            // if (postService.lastPageLoaded.length<2){}
            if (postService.lastPageLoaded[postService.lastPageLoaded.length-1] ==="about") {
                console.log("it is logged");
                aboutUsPageLoader();
            } else if (postService.lastPageLoaded[postService.lastPageLoaded.length-1] === "cards") { 
                postService.loadMoreBtn.style.display = "block";
                postService.filterDiv.style.display = "block";
                postService.backBtn.style.display = "none";
                // postService.result.setAttribute("style","max-width: min-content; max height: min-content; display: grid");
                console.log("cards");
                postService.renderPosts(postService.loadedPosts);
            } else if (postService.lastPageLoaded[postService.lastPageLoaded.length-1] === "post") {
                console.log(postService.lastPageLoaded)
                console.log("post");
                console.log(postService.openedPostId);
                postService.openPost(postService.openedPostId[postService.openedPostId.length-1]);
                console.log(postService.openedPostId);
                postService.openedPostId.pop();
                // if(hasDuplicates(postService.lastPageLoaded)) {
                //     postService.lastPageLoaded.pop();
                    postService.lastPageLoaded.pop();
                // }
            } else if (postService.lastPageLoaded[postService.lastPageLoaded.length-1] === "author"){
                console.log("author")
                authorPostsLoader(posts.storage, postService.lastAuthor);;
                // if(hasDuplicates(postService.lastPageLoaded)) {
                //     postService.lastPageLoaded.pop()
                //     postService.lastPageLoaded.pop()
                // }
            }
            // } else {console.log("doesnt work")
            //     postService.loadMoreBtn.style.display = "block";
            //     postService.filterDiv.style.display = "block";
            //     postService.backBtn.style.display = "none";
            //     postService.renderPosts(postService.loadedPosts);
            // }
        })


        window.addEventListener('scroll', function() {
            if(postService.selectedFilter == null){
                return;
            } else if(typeof postService.selectedFilter === 'string'){
                // Check if the user has scrolled to the bottom
                if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 0.9) {
                    if (!this.firstScrollReached) {
                        // First scroll to the bottom
                        this.firstScrollReached = true;
                    } else {
                        // Second scroll to the bottom
                        this.firstScrollReached = false; // Reset for future double scroll detection
        
                        // Show loading indicator
                        setTimeout(() => postService.loadingIndicator.style.visibility = 'visible', 200);
        
                        // Load more posts
                        setTimeout(() => {
                            postService.loadingIndicator.style.visibility = 'hidden';
                            switch (postService.selectedFilter) {
                                case "newPostsLoader":
                                    postService.loadMore(newestPosts);
                                    break;
                                case "oldPostsLoader":
                                    postService.loadMore(oldPosts);
                                    break;
                                case "mostPopularPostsLoader":
                                    postService.loadMore(mostPopularPosts);
                                    break;
                                case "showTagPosts":
                                    postService.loadMore(taggedPosts);
                                    break;
                                case "searchedPosts":
                                    postService.loadMore(filteredPosts);
                                    break;
                                case "authorPosts":
                                    postService.loadMore(postsByAuthor);
                                    break;
                                // default:
                                //     postService.loadMore(posts.storage);  // -- obsolete
                                //     break;
                            }
                        }, 1250);
                    }
                }
            }
        });
  }
        selectedFilter = "newPostLoader";
        initialPosts = 12;
        loadPosts = 12;
        rowCounter =0;
        idCounter = 0;
        loadedPosts = [];
        loadedSinglePost = null;
        openedPostId = [];
        commentPostId = null;
        indexOfPost = null;
        
        

        renderPosts = (posts) => {
            postService.result.setAttribute("style","max-width: min-content; max height: min-content; display: grid");
            if (this.selectedFilter !== "authorPosts"){
                this.lastAuthor = null;
                this.lastPageLoaded = ["cards"]; 
            }
           // let copies = [...posts];
           let copies = [];
           copies = posts;
            console.log(posts)
            console.log(copies);
            console.log("second posts")
            this.counter = 0;
         
            for (let x of copies.posts) {            
                const imageSrc = `data:image/png;base64,${x.image}`; 
                if (this.counter < this.initialPosts) {
                         
                    this.result.innerHTML += `
                        <div class="card" style="width: 25vw" id="card-${x.id}">
                            <img class="card-img-top img-fluid imgLink" src="${imageSrc}" style="object-fit: fill; height: 20vw;" alt="Image should be here" value="${x.id}">
                            <div class="card-body title">
                                <a class="post-link"  value="${x.id}"><h5 class="card-title">${x.title}</h5></a>
                                <p class="card-text">${x.description}</p>
                            </div>
                            <div class="card-body icons">
                                <div> 
                                    <img src="./source/data/icons/star.svg" alt="Star Icon" class="starsIcon">
                                    <p>${x.rating} Stars</p>
                                </div>
                                <div>
                                    <img src="./source/data/icons/chat-right.svg" alt="Comment Icon" class="commentsIcon">
                                    <p>${x.comments} Comments</p>
                                </div>
                                <br>
                                <div class="tags">
                                <p><small>Tags: ${x.tags}</small></p>
                            </div>  
                            </div>
                            
                        </div>
                    `;
    
                    this.loadedPosts.push(x);
                    this.idCounter++;
                }
                this.rowCounter++;
                this.counter++;
                lightDarkChek();
            }
            let titlePostOpener = document.getElementsByClassName("post-link");
            Array.from(titlePostOpener).forEach(function(element) {
            element.addEventListener('click', getPostId);
            });
            let imgPostOpener = document.getElementsByClassName("imgLink");
            Array.from(imgPostOpener).forEach(function(element) {
            element.addEventListener('click', getPostId);
            });
        }
        renderSinglePost = (post) =>{
            const imageSrc = `data:image/png;base64,${post.image}`; 
            window.scrollTo(0,0);
            postService.lastPageLoaded.push("post");
            this.loadMoreBtn.style.display = "none";
            this.filterDiv.style.display = "none";
            this.backBtn.style.display = "block";
            console.log(postService.lastPageLoaded);
            postService.result.setAttribute("style","max-width: none; max height: none; display: block ");
            this.result.innerHTML = `<div class="singleCard mb-3" id="singlePostId">
    <div class="row g-0">
      <div class="col-md-5">
        <img src=${imageSrc} id="postImage" class="img-fluid rounded-start" alt="Relevant Picture">
      </div>
      <br>
      <div class="col-md-7">
        <div class="singleCard-body">
          <h2 class="card-title card-header"> ${post.title}</h2>
          <small>Created by - <a style="color: #00b13d"  id="${post.user.id}">${post.user.fullname}</a> on ${post.postingTime}  </small><br>
          <small>tags- ${post.tags}</small>
          <hr>
          <p class="singleCard-text">${post.text}</p>
          <div class="card" style="width: 70vw;">
        </div>
        <br>
      <div id='addStarContainer'>
            <p>Did you like this post? 
            <span  id='addStartOnPost'> Add -> <img id='starPostImg' src="./source/data/icons/star.svg" alt="Star Icon" class="starsIcon">${post.rating}</span>
            </p>
    </div>
      </div>
      
    </div>
  </div>
    
  <br>
  <br>
  <hr>
    <div class="ad-banner">
        <h1>QINSHIFT</h1>
        <p>The Change Begins Here! <a href="https://qinshiftacademy.com/" target="_blank">Click to learn more</a></p>
    </div><hr><br>
    

    
    <div class="comments">
    <!-- Comment form -->
        <div class="comment-form">
            <h3>Add a Comment</h3>
            <form id="commentForm">
                <input type= "text" id = "commentName" placeholder="Name (optional)">
                <label for="commentText">Your Comment:</label>
                <textarea type="text" id="commentText" name="commentText" placeholder="Type your comment here..." required></textarea>
                <button type="submit">Post Comment</button>
            </form>
        </div>
        <br>
        <br>
        
        <div id="addedComments">
        </div>
        <!-- Add more comments here... -->
    </div>
        
    </div>
    <br><br>`
    // document.getElementById("comments").innerHTML = `
    // it works
    // `
    document.getElementById('addStartOnPost').addEventListener('click',()=>{
        if(modalService.currentUser.email == null){
            users.alert('warningAlert', 'You must be logged in to like a post!');
        }
        else{
            let post = posts.storage.find(x=> x.id == postService.commentPostId);
            let indexPost = posts.storage.indexOf(post);
            posts.storage[indexPost].addStar(modalService.currentUser.id);
        }
    })
    // posts.storage[this.indexOfPost].fillStar(modalService.currentUser.id); Api Logic needed to check if user already liked the post
    document.getElementById("commentForm").addEventListener("submit",function(event){
        event.preventDefault();
        console.log("it kinda works")
        let commentName = document.getElementById("commentName");
        let commentText = document.getElementById("commentText");
        let post = posts.storage.find(x=> x.id == postService.commentPostId);
        let indexPost = posts.storage.indexOf(post);
        posts.storage[indexPost].addComment(commentName.value,commentText.value);
        commentName.value = "";
        commentText.value = "";
        displayComments();
    });
    displayComments();
    // document.getElementById("postAuthorId").addEventListener('click',()=>{  Router will take care of navigation history
    //     postService.lastPageLoaded.push("author");
    //     postService.lastAuthor = this.loadedSinglePost.authorId;
    //     authorPostsLoader(posts.storage, this.loadedSinglePost.authorId);
    // });     
}

        loadMore = async () => {
            if(postFilter.totalPages !== 0 && postFilter.pageIndex >= postFilter.totalPages){
                console.log("No more posts!");
                return;
            }
            let result = await apiCallz.fetchPaginatedPosts(postFilter);
            postFilter.updateFilter(result.pageIndex, result.totalPages);
            this.renderPosts(result);
        }
    writePosts = (postData)=> {
        for (const item of postData) {
            posts.newPost(`${item.imgSrc}.jpg`, item.title, item.text, item.tags, users.storage[`${item.authorId}`], item.stars, item.postingTime);
        }
    }
    
    openPost = async(postId) =>{
        let post =  await apiCallz.fetchDetailedPost(postId);
        this.loadedSinglePost = post;
        this.indexOfPost = posts.storage.indexOf(post);
        this.renderSinglePost(post);
    }
    
} 
let getPostId = function(){
    let postId = this.getAttribute("value");
    postService.openedPostId.push(postId);
    postService.commentPostId = postId;
    postService.selectedFilter = null;
    postService.openPost(postId);
}



loadMoreBtn.addEventListener("click", function () {
    console.log(postService.selectedFilter)
    if (postService.selectedFilter == "newPostsLoader") {
        postService.loadMore(newestPosts);
        console.log("first");
    } else if (postService.selectedFilter == "oldPostsLoader") {
        postService.loadMore(oldPosts);
        console.log("second");
    } else if (postService.selectedFilter == "mostPopularPostsLoader") {
        postService.loadMore(mostPopularPosts);
        console.log("third");
    } else if (postService.selectedFilter == "showTagPosts") {
        postService.loadMore(taggedPosts);
        
    } else if (postService.selectedFilter == "searchedPosts") {
        postService.loadMore(filteredPosts);
    }
    else {
        // postService.loadMore(posts.storage);
    }
});

const users = new Users();
const posts = new Posts();
const post = new Post();
const postService = new PostService();
const modalService = new ModalService();
const newsletterService = new Newsletter();

modalService.removeSession();

const userJsonPath = "source/data/json/userDATA.json";
const postJsonPath = "source/data/json/postData.json";
const userData = await getDataFromJson(userJsonPath);
users.writeUsers(userData);
users.newUser("Sasho", "Popovski", "example@mail.com", "easyGuessPassword123", true);
users.newUser("Daniel", "Petrov", "example2@mail.com", "12345");
users.newUser("Boris","Krstovski",'borisk@lala.com','123456');
users.newUser("Test","Testing",'test@lala.com','123456');

const postData = await getDataFromJson(postJsonPath);
postService.writePosts(postData)
// let titleWords = getTitleWords(posts.storage);

const postFilter = new PostFilter();
// newPostsLoader(posts.storage); json loader
var result = await apiCallz.fetchPaginatedPosts(postFilter);
newPostsLoader(result); 
postFilter.updateFilter(result.pageIndex, result.totalPages);



// posts.newPost("source/data/postImgs/3.jpg", "This man predicts stock prices like a fortune teller.", "Pay for more", ["stock"], users.storage[30], new Date(1992,11,20,8,30));
// posts.newPost("source/data/postImgs/20.jpg", "How this professor teaches AI and thinks about the future of human creativity", "Pay for more", ["AI"], users.storage[50]);

// postService.renderPosts(posts.storage.sort(x=> x.postingTime ));
// posts.printPosts();

// users.printUsers();
document.getElementById("newFirst").addEventListener("click", function(){
    newPostsLoader(posts.storage,posts.selectedFilter);
})
document.getElementById("oldFirst").addEventListener("click", function(){
    oldPostsLoader(posts.storage,posts.selectedFilter);
})
document.getElementById("mostPopular").addEventListener("click", function(){
    mostPopularPostsLoader(posts.storage,posts.selectedFilter);
})
document.getElementById("srcIcon").addEventListener("click", function() {
    
    // const 
    
    // if(document.getElementById("searchInput").getAttribute("display") == "none"){
    //     // document.getElementById("searchInput").setAttribute("style",dis)
    //     console.log("The thing works")
    // }
    // searchPostsLoader(posts.storage);
});


document.getElementById("tagFilter").addEventListener("click", function() {
    console.log("it worksz");
    var tagDropdown = document.getElementById('tagFilterDropdown');
    if (tagDropdown.style.display === 'none' || tagDropdown.style.display === '') {
        tagDropdown.style.display = 'block';
    } else {
        tagDropdown.style.display = 'none';
    }
});


// Hide tag filter dropdown when clicking outside of it
document.addEventListener("click", (event) => {
    var filterDiv = document.getElementById('filterDiv');
    var tagDropdown = document.getElementById('tagFilterDropdown');
    var isClickInsideFilterDiv = filterDiv.contains(event.target);
    var isClickInsideDropdown = tagDropdown.contains(event.target);
    var tagClickCheck = true; 
    
    if (!isClickInsideFilterDiv && !isClickInsideDropdown) {
        tagDropdown.style.display = 'none';
        tagClickCheck = false;
    }
    const selectedTags = Array.from(document.querySelectorAll('.form-check-input:checked')).map(cb => cb.value);
    if (selectedTags.length > 0 ) {
        // showTagPosts(posts.storage, selectedTags);
        if (tagClickCheck == true) {
            showTagPosts(posts.storage, selectedTags);
        }
        tagClickCheck = false; 
    } else {    
            // postService.renderPosts(posts.storage);
    }  
});


let mybutton = document.getElementById("backToTopBtn")
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}


export {postService,users};




//display modal function

//sign up modal storing entered values
document.getElementById('signUpForm').addEventListener('submit', function(event) {
    event.preventDefault();

    let registeredFirstname = document.getElementById('signUpFirstName').value;
    let registeredLastName = document.getElementById('signUpLastName').value;
    let registeredEmail = document.getElementById('signUpEmail').value;
    let registeredPassword = document.getElementById('signUpPassword').value;
    console.log(registeredFirstname, registeredLastName, registeredEmail, registeredPassword);
    if(!registeredPassword.length < 5){
        if(!users.storage.some(x => x.email === registeredEmail)){
            console.log('User Signed Up:', { registeredEmail, registeredPassword });
            users.newUser(registeredFirstname, registeredLastName, registeredEmail, registeredPassword);
            users.alert('successAlert',"Successfully registered!");
            document.getElementById('signUpForm').reset();
            hideModal('signUpModal');
        } else{
            users.alert('warningAlert',"Email is already registered, please try logging in or use a different email!");
            document.getElementById('signUpForm').reset();
        }
    } else{
        users.alert('warningAlert',"Password does not meet the requirements");
            document.getElementById('signUpForm').reset();
    }
});

// login modal logic for checking values from signup modal
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    let email = document.getElementById('loginEmail').value;
    let password = document.getElementById('loginPassword').value;
    console.log(email, password);

    if (users.storage.some(x => x.email === email &&
                                x.password === password)) 
    {
        
        modalService.currentUser = users.storage.find(x => x.email === email &&
                                                           x.password === password);
        updateNavbar();
        users.alert('successAlert',`Successfully logged in. Hello ${modalService.currentUser.fullName()}!`);
        hideModal('loginModal');
    } else {
        users.alert('warningAlert','Invalid username or password. Please try again.');
    }

    document.getElementById('loginForm').reset();
});

//changes the logout button
document.getElementById('logoutBtn').addEventListener('click', function() {
    modalService.removeSession();
    updateNavbar();
});

//displayes the currently subscribed email in the unsubscribe modal
document.getElementById('newsletterForm').addEventListener('submit', function(event) {
    event.preventDefault();
    if(!modalService.currentUser.isSubscribed  && modalService.currentUser.email != null ){
        modalService.currentUser.isSubscribed = true;
        newsletterService.addNewSubscriber(modalService.currentUser.email);
    }
    else{
    const emailInput = document.getElementById('newsletterEmail').value;
    document.getElementById('newsletterEmail').style.visibility = 'hidden';
    newsletterService.addNewSubscriber(emailInput);

    document.getElementById('newsletterForm').reset();
}});
document.getElementById('newsletterUnsubscribeForm').addEventListener('submit',(event)=>{
    event.preventDefault();
    if(modalService.currentUser.isSubscribed && modalService.currentUser.email != null ){
        modalService.currentUser.isSubscribed = false;
        newsletterService.removeSubscriber(modalService.currentUser.email);
    }
    else{
    const emailInput = document.getElementById('unsubNewsletterEmail').value;
    document.getElementById('unsubNewsletterEmail').style.visibility = 'hidden';
    newsletterService.removeSubscriber(emailInput);
    document.getElementById('newsletterUnsubscribeForm').reset();
}})


//changes the button from login to logout and displays the currently loggin user
function updateNavbar() {
    const loggedInUser = document.getElementById('loggedInUser');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const createPostBtn = document.getElementById('createPostBtn');

    if (modalService.currentUser.firstName != null) {
        // loggedInUser.textContent = `Logged in as: ${modalService.currentUser.fullName()}`;
        loginBtn.style.display = 'none';
        createPostBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'inline-block';
    } else {
        // loggedInUser.textContent = 'You\'re not logged in!';
        loginBtn.style.display = 'inline-block';
        createPostBtn.style.display = 'none';
        logoutBtn.style.display = 'none';
    }
}

//logic frr displaying newsletter and and NL unsubscribe modal
document.getElementById('newsletterBtn').addEventListener('click', function() {
    if (modalService.currentUser.email == null) {
        document.getElementById('subscibeModalInfo').innerText = '';
        document.getElementById('showUnsubscribeText').style.visibility = 'visible';
        document.getElementById('newsletterEmail').style.visibility = 'visible';
        document.getElementById('newsletterEmail').disabled = false;
        showModal('subscribeModal');
    } 
    else if(!modalService.currentUser.isSubscribed) {
        document.getElementById('subscibeModalInfo').innerText = '';
        document.getElementById('newsletterEmail').style.visibility = 'visible';
        newsletterService.subscribeLoggedUser();
        showModal('subscribeModal');
    }
    else if(modalService.currentUser.isSubscribed){
        document.getElementById('unsubscibeModalInfo').innerText = '';
        document.getElementById('unsubNewsletterEmail').style.visibility = 'visible';
        newsletterService.unsubscribeLoggedUser();
        showModal('unsubscribeModal');
    }
});
document.getElementById('showUnsubscribeBtn').addEventListener('click', ()=>{
    if (modalService.currentUser.email == null){
    hideModal('subscribeModal');
    document.getElementById('unsubNewsletterEmail').disabled = false;
    document.getElementById('unsubNewsletterEmail').style.visibility = 'visible';
    document.getElementById('unsubscibeModalInfo').innerHTML = "";
    showModal('unsubscribeModal');
    }
})

//login event listener
document.getElementById('loginBtn').addEventListener('click', function() {
    showModal('loginModal');
});

document.getElementById('showSignUpBtn').addEventListener('click', function() {
    hideModal('loginModal');
    showModal('signUpModal');
});
//Creating post listener
document.getElementById('createPostBtn').addEventListener('click', function() {
    showModal('createPostModal');
});
document.getElementById('newPostBtn').addEventListener('click',()=>{
    let postTitle = document.getElementById('newPostTitle').value ;
    let postText = document.getElementById('newPostText').value ;
    let postTags = Array.from(document.querySelectorAll('.custom-control-input:checked')).map(cb => cb.value);
    let imageNumber = document.getElementById('imgRange').value ;
    if(postTags.length == 0 || postText == '' || postTitle == ''){
        users.alert('warningAlert',"You must fill the fields and select 1 tag");

    }
    else{
    posts.newPost(`source/data/postImgs/${imageNumber}.jpg`, postTitle, postText, postTags, users.storage[modalService.currentUser.id - 1]);
    hideModal('createPostModal');
    newPostsLoader(posts.storage);
    }
});


//closing open modals when clinked on the background
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', function(event) {
        const modal = event.target.closest('.modal');
        hideModal(modal.id);
    });
});
document.getElementById('closeCreatePostModal').addEventListener('click', ()=> hideModal('createPostModal'));

window.addEventListener('click', function(event) {
    const modal = document.querySelector('.modal.show');
    if (modal && event.target === modal) {
        hideModal(modal.id);
    }
});
document.getElementById("lightDarkToggle").addEventListener("click", function(){
    lightDarkChek();
});

//updates the navbar
updateNavbar();
// displayComments();



document.getElementById("monthFilter").addEventListener("click",function(){
    showModal("monthModal");
});
document.getElementById("monthModalForm").addEventListener("submit", function(event){
    event.preventDefault();
    let dateValue = document.getElementById("dateValue").value;
    monthYear(posts.storage, dateValue);
});
// document.getElementById("searchInput").addEventListener("")
document.getElementById("searchDiv").addEventListener("submit", function(event){
    event.preventDefault();
    searchPostsLoader(posts.storage);
})
document.getElementById("searchInput").addEventListener("input", function(event){
    event.preventDefault();
    let searchField = document.getElementById("searchInput").value;
    document.getElementById('suggestionWords').innerHTML = '';
    if(searchField.length >= 2){
        searchSuggestions(searchField, titleWords);
    }
})
function searchSuggestions(searchQuery, suggestionWords) {
    let suggestions = suggestionWords.filter(x => x.includes(searchQuery.toLowerCase()));
    let firstFiveSuggestions = suggestions.splice(0, 4);
    let optionList = document.getElementById('suggestionWords');
    firstFiveSuggestions.forEach(element => {
        optionList.innerHTML +=`
            <option value="${element}">${element}</option>
        `
    });
}


function displayComments() {
    document.getElementById("addedComments").innerHTML = ""
    let post = posts.storage.find(x=> x.id == postService.commentPostId);
    if(post.comments.length == 0){
        document.getElementById("addedComments").innerHTML = `
        <div class="comment" style="text-align: center">
        <p>Be the first to comment!</p>
        </div>`
    }
    for (let x of post.comments){
        document.getElementById("addedComments").innerHTML += `
        <div class="comment">
            <span class="user">${x.username}</span>
            <span class="date">${x.date}</span>
            <p>${x.text}</p>
        </div>
    `
    }
    
}
// function getTitleWords(posts){
//     let result = [];

//     posts.forEach(x => {
//         let words = x.title.split(' ');
//         for(let i = 0; i < words.length; i++){
//             if (!result.includes(words[i].toLowerCase())){
//                 result.push(words[i].toLowerCase());
//             }
//         }

//     })
//     return result;
// }