export class PostService {
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
        <img src=${post.imgSrc} id="postImage" class="img-fluid rounded-start" alt="Relevant Picture">
      </div>
      <br>
      <div class="col-md-7">
        <div class="singleCard-body">
          <h2 class="card-title card-header"> ${post.title}</h2>
          <small>Created by - <a style="color: #00b13d"  id="postAuthorId">${post.authorId.fullName()}</a> on ${post.postingTime}  </small><br>
          <small>tags- ${post.tags}</small>
          <hr>
          <p class="singleCard-text">${post.text}</p>
          <div class="card" style="width: 70vw;">
        </div>
        <br>
      <div id='addStarContainer'>
            <p>Did you like this post? 
            <span  id='addStartOnPost'> Add -> <img id='starPostImg' src="./source/data/icons/star.svg" alt="Star Icon" class="starsIcon"></span>
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
    posts.storage[this.indexOfPost].fillStar(modalService.currentUser.id);
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
    document.getElementById("postAuthorId").addEventListener('click',()=>{
        postService.lastPageLoaded.push("author");
        postService.lastAuthor = this.loadedSinglePost.authorId;
        authorPostsLoader(posts.storage, this.loadedSinglePost.authorId);
    });
// let testComment = document.getElementById("commentForm");

// testComment.addEventListener("click", function (e) {
//     e.preventDefault();
//     const commentText = document.getElementById("commentText").value;
//     const isAnonymous = document.getElementById("anonymous").checked;

//     // Process the comment (you can send it to a server or handle it as needed)
//     console.log("Comment:", commentText);
//     console.log("Anonymous:", isAnonymous);
// });
// lightDarkChek();        
}

        loadMore = (posts) => {
            let postsToLoad = posts.filter(post => !this.loadedPosts.includes(post));
            this.renderPosts(postsToLoad.slice(0, this.loadPosts));
        }
    writePosts = (postData)=> {
        for (const item of postData) {
            posts.newPost(`${item.imgSrc}.jpg`, item.title, item.text, item.tags, users.storage[`${item.authorId}`], item.stars, item.postingTime);
        }
    }
    
    openPost (postId){
        let post = posts.storage.find(x=> x.id == postId);
        this.loadedSinglePost = post;
        this.indexOfPost = posts.storage.indexOf(post);
        this.renderSinglePost(post);
    }
} 