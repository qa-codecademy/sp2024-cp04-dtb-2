import { Comment } from "./comment.js";

import { Base } from "./base.js"
import { users } from "../app.js";
export class Post extends Base{
    constructor(id, imgSrc, title, text, tags, authorId, stars = [], postingTime = new Date().toISOString().slice(0, 10)){
        super(id);
        this.imgSrc = imgSrc;
        this.title = title;
        this.text = text;
        this.tags = Array.isArray(tags) ? tags : [tags];
        this.authorId = authorId;
        this.stars = stars;
        this.comments = [];
        this.postingTime = postingTime;
    }

    addComment = (name, comment) => this.comments.push(new Comment(comment, name));
    // displayComments() {
    //     document.getElementById("addedComments").innerHTML += `
    //     it works
    //     `;
        
        
    // }


    addStar = (userId) =>{
        let starArray = this.stars.some(x => x == userId);
        if(!starArray){
            this.stars.push(userId);
            document.getElementById('starPostImg').setAttribute('src',"./source/data/icons/star-fill.svg");
            users.alert('successAlert',"Successfully liked the post!")
        }
        else {
            let index = this.stars.indexOf(userId);
            this.stars.splice(index, 1);
            document.getElementById('starPostImg').setAttribute('src',"./source/data/icons/star.svg");
            users.alert('successAlert',"Successfully unliked the post!");
        };
    }
    fillStar = (userId) =>{
        if(this.stars.some(x => x == userId)){
            document.getElementById('starPostImg').setAttribute('src',"./source/data/icons/star-fill.svg");
        }
        else{
            document.getElementById('starPostImg').setAttribute('src',"./source/data/icons/star.svg");
        }
    } 
}
