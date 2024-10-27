import postFilterService from "./PostFilterService.js";
import { ApiCaller } from "./ApiCaller.js";
import ButtonService from "./ButtonService.js"
// import modalService from "./ModalService.js";
import ModalService from "./ModalService.js";
import SessionService from "./SessionService.js";
import NavbarService from "./NavbarService.js";
import ThemeService from "./ThemeService.js";
import UploadImgService from "./UploadImgService.js";


const uploadImgService = new UploadImgService();
const themeService = new ThemeService();
const navbarService = new NavbarService();
const sessionService = new SessionService();
const buttonService = new ButtonService();
const apiCaller = new ApiCaller();
const modalService = new ModalService();

class EventService {
    constructor() {
        this.isScrollActive = true;
        this.firstScrollReached = false;
        this.initScrollListener();
        this.newsLetterListener();
        this.newsLetterSubListener();
        this.buttonClickListener();
        this.newsLetterUnsubListener();
        this.loginListener();
        this.loginModalListener();
        this.themeListener();
        this.createPostListener();
        // this.logoutListener(); 
    }

    canFetchNextPage() {
        const { pageIndex, totalPages } = postFilterService.getFilters();
        return pageIndex < totalPages;  
    }

    async fetchNextPage() {
        console.log("starting to fetch next page");
        console.log(postFilterService.filters);
        const filters = postFilterService.getFilters();
        console.log(filters);
        
        if (postFilterService.filters.pageIndex < postFilterService.filters.totalPages) {
            postFilterService.updateFilter({ pageIndex: filters.pageIndex + 1 });
            
            const newPosts = await apiCaller.fetchFromDB(`https://localhost:7073/api/Posts`, "POST", filters);
            console.log(newPosts);

            this.appendPostsToView(newPosts.posts);
        }
    }

    appendPostsToView(posts) {
        const contentPart = document.querySelector("#contentPart");
        let resultHtml = "";
        
        posts.forEach(element => {
            let imgSrc = `data:image/png;base64,${element.image}`;
            resultHtml += `
                <div class="card" style="width: 25vw" id="card-${element.id}">
                    <img class="card-img-top img-fluid imgLink" src="${imgSrc}" style="object-fit: fill; height: 20vw;" alt="Image should be here" value="${element.id}">
                    <div class="card-body title">
                        <a class="post-link" href="posts/${element.id}" data-link><h5 class="card-title">${element.title}</h5></a>
                        <p class="card-text">${element.description}</p>
                    </div>
                    <div class="card-body icons">
                        <div> 
                            <img src="/data/icons/star.svg" alt="Star Icon" class="starsIcon">
                            <p>${element.rating} Stars</p>
                        </div>
                        <div>
                            <img src="/data/icons/chat-right.svg" alt="Comment Icon" class="commentsIcon">
                            <p>${element.comments} Comments</p>
                        </div>
                        <br>
                        <div class="tags">
                            <p><small>Tags: ${element.tags}</small></p>
                        </div>  
                    </div>
                </div>
            `;
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
            const url = `https://localhost:7073/api/NewsLetters?email=${subedEmail}`;
            console.log(subedEmail);
            
            let result = await apiCaller.fetchFromDB(url, "POST");        
            console.log(result);
            
        });
        buttonService.newsLetterSubCloseBtn.addEventListener('click', () => {
            modalService.hideModal("subscribeModal");
        } );
    }
    newsLetterUnsubListener (){
        document.getElementById('newsletterUnsubscribeForm').addEventListener('submit', async(e)=> {
            e.preventDefault();
            let unsubedEmail = document.getElementById("unsubNewsletterEmail").value;
            const url = `https://localhost:7073/api/NewsLetters?email=${unsubedEmail}`;
            let result = await apiCaller.fetchFromDB(url, "DELETE");
            console.log(result);
        });
        buttonService.newsLetterUnsubCloseBtn.addEventListener('click', ()=> {
            modalService.hideModal("unsubscribeModal");
        });

    }
    loginListener(){
        document.getElementById("loginBtn").addEventListener('click', ()=>{            
            modalService.showModal("loginModal");
        });

    }
    loginModalListener(){
        document.getElementById('loginForm').addEventListener('submit', async(e)=> {
            e.preventDefault();
            let loginEmail = document.getElementById("loginEmail").value;
            let loginPass = document.getElementById("loginPassword").value;
            let body = {
                email: loginEmail ,
                password: loginPass
            }
            const url = `https://localhost:7073/api/User/login`;
            let result = await apiCaller.fetchFromDB(url, "POST", body);
            if (result != undefined) {
                sessionService.Set(result);
                navbarService.loggedInNavbar();
                this.logoutListener();        
                this.themeListener();
                this.createPostListener();
        
            }
            modalService.hideModal("loginModal");
        });
        buttonService.logginCloseBtn.addEventListener('click', ()=> {
            modalService.hideModal("loginModal");
        });
    }
    logoutListener() {
        document.getElementById('logoutBtn').addEventListener('click', ()=> {           
            sessionService.Remove();
            navbarService.defaultNavbar();
            this.loginListener();
            this.loginModalListener();
            this.themeListener();

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
        this.createPostModalListener();
    }
    createPostModalListener () {
        document.getElementById("newPostBtn").addEventListener('click', ()=>{

            modalService.hideModal("createPostModal");
        })
    }
}

const eventService = new EventService();
export default eventService;