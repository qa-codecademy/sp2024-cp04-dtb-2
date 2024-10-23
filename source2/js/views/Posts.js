import AbstractView from "./AbstractView.js";
import { ApiCaller } from "../modules/ApiCaller.js";

let apiCaller = new ApiCaller();

export default class Posts extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Posts");

    }
    async getHtml() {
        
        let result = await apiCaller.fetchFromDB(`https://localhost:7073/api/Posts`, "POST", {
            pageIndex: 1,
            sortBy: "new",
        });
        console.log(result);
        
        let resultHtml = "";
        result.posts.forEach(element => {
            let imgSrc = `data:image/png;base64,${element.image}`
            resultHtml += `
                            <div class="card" style="width: 25vw" id="card-${element.id}">
                                <img class="card-img-top img-fluid imgLink" src="${imgSrc}" style="object-fit: fill; height: 20vw;" alt="Image should be here" value="${element.id}">
                                <div class="card-body title">
                                    <a class="post-link"  value="${element.id}"><h5 class="card-title">${element.title}</h5></a>
                                    <p class="card-text">${element.description}</p>
                                </div>
                                <div class="card-body icons">
                                    <div> 
                                        <img src="./source/data/icons/star.svg" alt="Star Icon" class="starsIcon">
                                        <p>${element.rating} Stars</p>
                                    </div>
                                    <div>
                                        <img src="./source/data/icons/chat-right.svg" alt="Comment Icon" class="commentsIcon">
                                        <p>${element.comments} Comments</p>
                                    </div>
                                    <br>
                                    <div class="tags">
                                        <p><small>Tags: ${element.tags}</small></p>
                                    </div>  
                                </div>
                            </div>
            `
        });
        return resultHtml;
        
    }
    
}