import AbstractView from "./AbstractView.js";
import { ApiCaller } from "../modules/ApiCaller.js";
import ButtonService from "../modules/ButtonService.js";
import eventService from "../modules/EventService.js";
import SessionService from "../modules/SessionService.js";

const sessionService = new SessionService();
const apiCaller = new ApiCaller();
const btnService = new ButtonService();

export default class Post extends AbstractView {

  constructor(params) {
    super(params);
    this.setTitle("Post Details");
  }

  

  async getHtml() {
    btnService.filterBtn.style.display = "none";
    btnService.loadMoreBtn.style.display = "none";
    let user = sessionService.Get();
    if (user != null || user != undefined) {
      let star =  await apiCaller.fetchFromDB(`https://localhost:7073/api/Stars`, "POST", { userId : user.id, postId : this.params.id });
      if (star != null || star != undefined ) {
        let starNum = star.rating;
        eventService.updateCurrentRating(starNum);
        eventService.updateCurrentPostId(this.params.id);
      } else {

        eventService.updateCurrentRating(0);
      }
    }
    let post = await apiCaller.fetchFromDB(`https://localhost:7073/api/Posts/${this.params.id}`, "GET");
    let imgSrc = `data:image/png;base64,${post.image}`;

    return `<div class="singleCard mb-3" id="singlePostId">
              <div class="row g-0">
                <div class="col-md-5">
                  <img src=${imgSrc} id="postImage" class="img-fluid rounded-start" alt="Relevant Picture">
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
                    <div id="addStarContainer">
                      <p>Did you like this post? 
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
                          ${post.rating}
                        </span>
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
            <br><br>`;
  }

  async init() {
    // Add any additional initialization here if needed
    await eventService.addStarEventListeners();
}
}