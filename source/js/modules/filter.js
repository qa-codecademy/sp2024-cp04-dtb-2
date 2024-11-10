import {postService,users} from "../app.js";
import {ModalService} from "./ModalService.js";
export let taggedPosts = [];
export let mostPopularPosts = [];
export let oldPosts = [];
export let newestPosts = [];
export let filteredPosts = [];
export let postsByAuthor = [];

const modalService = new ModalService();

export function newPostsLoader(posts) {
    postService.selectedFilter = "newPostsLoader";
    newestPosts = posts // .slice().sort((a, b) => new Date(b.postingTime) - new Date(a.postingTime));
    document.getElementById("contentPart").innerHTML = "";
    postService.renderPosts(newestPosts);
}
export function oldPostsLoader(posts) {
    postService.selectedFilter = "oldPostsLoader";
    oldPosts = posts.slice().sort((a, b) => new Date(a.postingTime) - new Date(b.postingTime));
    document.getElementById("contentPart").innerHTML = "";
    postService.renderPosts(oldPosts);
}
export function mostPopularPostsLoader(posts) {
    postService.selectedFilter = "mostPopularPostsLoader";
    let postsWithStars = posts.filter(post => post.stars !== undefined && post.stars !== null);
    mostPopularPosts = postsWithStars.slice().sort((a, b) => {
        return b.stars.length - a.stars.length; 
    });
    document.getElementById("contentPart").innerHTML = "";
    postService.renderPosts(mostPopularPosts);
}
export function showTagPosts (posts, selectedTags) {
   
    postService.selectedFilter = "showTagPosts";
    taggedPosts = [];

    posts.forEach(post => {
        if (Array.isArray(post.tags) && post.tags.some(tag => selectedTags.includes(tag))) {
            taggedPosts.push(post);
        }
    });

    document.getElementById("contentPart").innerHTML = "";
    postService.renderPosts(taggedPosts);    
}
export function searchPostsLoader(posts) {
    postService.selectedFilter = "searchedPosts";
    let searchInput = document.getElementById("searchInput").value.toLowerCase();
    filteredPosts = posts.filter(post => post.title.toLowerCase().includes(searchInput) || post.text.toLowerCase().includes(searchInput));
    document.getElementById("searchInput").value = '';
    document.getElementById("contentPart").innerHTML = "";
    if(filteredPosts.length < 1){
        document.getElementById('contentPart').innerHTML = `
        <h5 style="width: 30vw; text-align:center">No posts were found with the search query -> ( <b>${searchInput}</b> ).<br>Please try searching something else!</h5>`;
        document.getElementById('loadMoreBtn').style.display = 'none';

    } else{
        postService.renderPosts(filteredPosts);
    }
}
export function authorPostsLoader(posts, id) {
    postService.selectedFilter = "authorPosts";
    postsByAuthor = posts.filter(x => x.authorId == id);
    document.getElementById('contentPart').innerHTML = "";
    postService.renderPosts(postsByAuthor);

}
export function monthYear(posts, dateValue) {
    postService.selectedFilter = "monthYear";
    
    // Use map to create a new array with transformed postingTime
    let splicedPosts = posts.map(post => {
        // Assuming postingTime is a string, take the first part (e.g., "2023-07" for "2023-07-07T12:34:56")
        post.postingTime = post.postingTime.slice(0, 7); // Keeping the first 7 characters (YYYY-MM)
        return post;
    });

    // Filter posts based on the dateValue
    let monthYearPosts = splicedPosts.filter(post => post.postingTime === dateValue);
    if(monthYearPosts.length < 1){
        document.getElementById('contentPart').innerHTML = `
        <h5 style="width: 30vw; text-align:center">NO POSTS FOUND ON ${dateValue}!</h5>`;
        users.alert("warningAlert", `There are no posts found on ${dateValue}. Please filter by another date!`);
        document.getElementById('loadMoreBtn').style.display = 'none';

    }
    else{// Render the filtered posts
    modalService.hideModal('monthModal');
    document.getElementById('contentPart').innerHTML = "";
    postService.renderPosts(monthYearPosts);
    }
}