import postFilterService from "./PostFilterService.js";
import { ApiCaller } from "./ApiCaller.js";
import ButtonService from "./ButtonService.js"
// import modalService from "./ModalService.js";
import ModalService from "./ModalService.js";

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
            if (this.isScrollActive) {
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
        // buttonService.newsLetterModalSubBtn.addEventListener('click', async () => {
        //     let newsLetterEmail = document.querySelector('#newsLetterEmail').value;
        //     console.log(newsLetterEmail);
            
            
        // });
    }

    toggleScroll() {
        this.isScrollActive = !this.isScrollActive;
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
}

const eventService = new EventService();
export default eventService;