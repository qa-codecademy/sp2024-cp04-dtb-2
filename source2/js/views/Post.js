import AbstractView from "./AbstractView.js";
import { ApiCaller } from "../modules/ApiCaller.js";
import ButtonService from "../modules/ButtonService.js";
import eventService from "../modules/EventService.js";
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
                          Add -> 
                          <img id="starPostImg" src="/data/icons/star.svg" alt="Star Icon" class="starsIcon">
                          ${post.rating}
                        </span>
                      </p>
                      <div id="starRatingContainer" class="star-rating hidden">
                        ${[...Array(5)].map((_, i) => `<img src="/data/icons/star_empty.svg" 
                          class="star-icon" data-rating="${i + 1}" alt="Star ${i + 1}">`).join('')}
                      </div>
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