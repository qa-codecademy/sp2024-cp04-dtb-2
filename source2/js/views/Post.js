import AbstractView from "./AbstractView.js";
import apiCaller from "../modules/ApiCaller.js";
import ButtonService from "../modules/ButtonService.js";
import eventService from "../modules/EventService.js";
import SessionService from "../modules/SessionService.js";

const sessionService = new SessionService();
const btnService = new ButtonService();

export default class Post extends AbstractView {

  constructor(params) {
    super(params);
    this.setTitle("Post Details");
  }


  async getHtml() {
    btnService.filterBtn.style.display = "none";
    btnService.loadMoreBtn.style.display = "none";
    
    const user = sessionService.Get();
    eventService.updateCurrentPostId(this.params.id);
    
    const post = await apiCaller.fetchFromDB(`https://localhost:7073/api/Posts/${this.params.id}`, "GET");
    eventService.currentPostAuthorId = post.user.id;
    const isAuthor = user && user.id === post.user.id;
    let isSubscribed = null;
    if (user) {
      const star = await apiCaller.fetchFromDB(`https://localhost:7073/api/Stars`, "POST", { userId: user.id, postId: this.params.id });
      const foundUserWithNewsletter = await apiCaller.fetchFromDB(`https://localhost:7073/api/User/usernewsletter`, "GET", null, user.token);
      if(foundUserWithNewsletter.newsLetter !== null && foundUserWithNewsletter.newsLetter.authors.some(x => x.id === eventService.currentPostAuthorId)){
        isSubscribed = true;
      }
      eventService.updateCurrentRating(star?.rating || 0);
    }
    
    let isAdmin = false;
    const token = sessionService.GetParsedToken();
    if( token && token.token.isAdmin === "True"){
      isAdmin = true;
    }
    
    let randomAdSrc = '';
    
    const randomAd = await apiCaller.fetchFromDB('https://localhost:7073/api/Image/randomimage/114', "GET");
    if(randomAd.data !== null){
      randomAdSrc = `data:image/png;base64,${randomAd.data}`;
    }

    const imgSrc = `data:image/png;base64,${post.image}`;
    const postTags = post.tags.map(tag => `#${tag}`).join(' ');
    const date = new Date(post.postingTime);
    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",  // Ex: Sep, Oct, Nov
      year: "numeric"
  });
    const commentsHTML = post.comments.map(x => `
      <div class="comment" data-id="${x.id}">
        <span class="user">${x.name}</span>
        <span class="date">${x.date}</span>
        <p class="text">${x.text}</p>
        ${user && x.userId === user.id ? `
          <button class="btn btn-danger commentDelete">Delete</button>
          <button class="btn btn-warning commentEdit">Edit</button>
        ` : ''}
      </div>
    `).join('');
  
    let resultHtml = `<div id="postImg">
                      <img src=${imgSrc} id="singlePostImage" class="img-fluid rounded-start" alt="Relevant Picture">
                    </div>
                    <div id="holder">
                      <div id="postText">
                        <h2 class="card-title card-header" id="singlePostTitle"> ${post.title}</h2>
                        <small>Created by -   <a href="/authorposts/${post.user.id}" style="color: #00b13d" class="userFullname" id="${post.user.id}" data-link>${post.user.fullname}</a>  ${isSubscribed ? `<button type="button" class="btn btn-dark btn-sm subButton" id="subscribeAuthor" disabled>Subscribed</button>` :`<button type="button" class="btn btn-dark btn-sm subButton" id="subscribeAuthor">Subscribe</button>`}  Posted on ${formattedDate}</small><br>
                        
                        <button type="button" class="btn btn-secondary btn-sm disabled">${postTags}</button>
                        ${isAuthor ? `<button class="btn btn-outline-warning" value="${post.id}" id="editPostBtn">Edit</button>` : ''}
                        ${isAdmin || isAuthor? `<button class="btn btn-outline-danger" value="${post.id}" id="deletePostBtn">Delete</button>`: ''}
                        <hr>
                        <p class="singleCard-text">${post.text}</p>
                        <div id="addStarContainer">
                          <p>Post rating: <span id="postRating">${post.rating}</span>
                            <span id="addStartOnPost"> 
                              <div class="star-rating" id ="starsRating">
                                  <input type="radio" id="star5" name="rating" value="5" />
                                  <label for="star5" title="5 stars">
                                      <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                                  </label>
                                  <input type="radio" id="star4" name="rating" value="4" />
                                  <label for="star4" title="4 stars">
                                      <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                                  </label>
                                  <input type="radio" id="star3" name="rating" value="3" />
                                  <label for="star3" title="3 stars">
                                      <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                                  </label>
                                  <input type="radio" id="star2" name="rating" value="2" />
                                  <label for="star2" title="2 stars">
                                      <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                                  </label>
                                  <input type="radio" id="star1" name="rating" value="1" />
                                  <label for="star1" title="1 star">
                                      <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                                  </label>
                              </div>
                              
                            </span>
                          </p>
                        </div>
                      </div>
                      <div id="ads">
                        <img class="img-fluid rounded-start" src="${randomAdSrc}">
                      </div>
                    </div>
                    <div id="comments">
                      <div class="comments">
                        <!-- Comment form -->
                        <div class="comment-form">
                          <h3>Add a Comment</h3>
                          <form id="commentForm">
                            <input type= "text" id = "commentName" placeholder="Name (optional)">
                            <label for="commentText">Your Comment:</label>
                            <textarea type="text" id="commentText" name="commentText" placeholder="Type your comment here..." required></textarea>
                            <button type="submit" id ="commentPostBtn">Post Comment</button>
                          </form>
                        </div>
                        <br>
                        <br>
                
                        <div id="addedComments">
                        ${commentsHTML}
                        </div>
                        <!-- Add more comments here... -->
                      </div>
                    </div>
              <div>
                <div>
                </div>
                <br>
                <div>
                  <div class="singleCard-body">
                    <div class="card" style="width: 70vw;">
                    </div>
                    <br>
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

            </div>
            <br><br>`;
  
    return resultHtml;
  }
  
 }