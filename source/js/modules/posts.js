import { Post } from "./post.js";

export class Posts {
    constructor(){
        this.storage = [];
    }
    newPost(imgSrc, title, postText, tags, authorId, stars, postingTime) {
        if(tags.length < 1) return "Post must have at least one tag";
        let postId;
        this.storage.length < 1 ? postId = 1 
                                : postId = this.storage[this.storage.length - 1].id + 1;
        let newPost = new Post(postId, imgSrc, title, postText, tags, authorId, stars, postingTime);
        if(!newPost) return "Invalid entries"; else this.storage.push(newPost);
    }
    printPosts = () => this.storage.forEach(x => console.log(`id: ${x.id}\ntitle: ${x.title}\ncontent: ${x.text}\ndate created: ${x.postingTime}\ntags: ${x.tags}\nstars: ${x.stars}\nCreated by: ${x.authorId.fullName()}`));
}