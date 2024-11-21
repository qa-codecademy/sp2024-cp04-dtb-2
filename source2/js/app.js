import AboutUs from "./views/AboutUs.js";
import Post from "./views/Post.js";
import Posts from "./views/Posts.js";
import postFilterService from "./modules/PostFilterService.js";
import eventService from "./modules/EventService.js";
import ModalService from "./modules/ModalService.js";
import modalService from "./modules/ModalService.js";
import themeService from "./modules/ThemeService.js";
import Settings from "./views/Settings.js";
import MyPosts from "./views/MyPosts.js";
import ButtonService from "./modules/ButtonService.js";
import AuthorPosts from "./views/AuthorPosts.js";
import SearchPosts from "./views/SearchPosts.js";
import AdminPanel from "./views/AdminPanel.js";
import AdminPanelUsers from "./views/AdminPanelUsers.js";
import SessionService from "./modules/SessionService.js";
import AdminPanelBanners from "./views/AdminPanelBanners.js";


const sessionService = new SessionService();
const buttonService = new ButtonService();

console.log("CONNECTED");

const getParams = match => {
    if (!match.result) return {};

    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
}

const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const naviageteTo = url => {
    history.pushState(null, null, url);
    router();
};

const router = async () => {
    switch (location.pathname) {
        case "/":
            postFilterService.updateFilter({pageIndex: 1, sortBy: "new", year: 0, month: 0, tags: []})
            break;
        case "/filterbytags":
            const urlParams = new URLSearchParams(window.location.search);
            const tagsParam = urlParams.get('tags');
            const tags = tagsParam ? tagsParam.split(',') : [];
            postFilterService.updateFilter({ pageIndex: 1, tags:tags, year:0, month:0 }); 
            break;

        case "/filterbyold":
            postFilterService.updateFilter({ pageIndex: 1, sortBy: "old", year: 0, month: 0, tags: [] });
            break;

        case "/filterbynew":
            postFilterService.updateFilter({ pageIndex: 1, sortBy: "new", year: 0, month: 0, tags: [] });
            break;

        case "/filterbymostpopular":
            postFilterService.updateFilter({ pageIndex: 1, sortBy: "popular", year: 0, month: 0, tags: [] });
            break;

        case "/filterbymonthandyear":
            let dateValue = document.getElementById("dateValue").value;
            let splitValues = dateValue.split("-");
            let year = splitValues[0];
            let month = splitValues[1];
            postFilterService.updateFilter({ pageIndex: 1, year: year ? year : 0, month: month ? month : 0, tags: [] });
            break;

        default: break;
    }

    const routes = [
        { path: "/", view: () => new Posts(postFilterService.filters) },
        { path: "/posts/:id", view: Post },
        { path: "/aboutus", view: AboutUs },
        { path: "/filterbyold", view: () => new Posts(postFilterService.filters) },
        { path: "/filterbynew", view: () => new Posts(postFilterService.filters) },
        { path: "/filterbymostpopular", view: () => new Posts(postFilterService.filters) },
        { path: "/filterbymonthandyear", view: () => new Posts(postFilterService.filters) },
        { path: "/filterbytags", view: () => new Posts(postFilterService.filters) },
        { path: "/search/:query", view: SearchPosts},
        { path: "/settings", view: Settings },
        { path: "/settings/myposts", view: MyPosts },
        { path: "/authorposts/:id", view: AuthorPosts},
        { path: "/adminpanel", view: AdminPanel},
        { path: "/adminpanel/users", view: AdminPanelUsers},
        { path: "/adminpanel/banners", view: AdminPanelBanners}
    ];

    const potentialMatches = routes.map(route => {
        return {
            route: route,
            result: location.pathname.match(pathToRegex(route.path))
        };
    });

    let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);
    if (!match) {
        match = {
            route: routes[0],
            result: [location.pathname]
        };
    }

    let view;

    if (typeof match.route.view === "function" && /^\s*class\s+/.test(match.route.view.toString())) {
        view = new match.route.view(getParams(match));
    } else {
        view = match.route.view();
    }

    if (view && view.getHtml) {
        document.querySelector("#contentPart").innerHTML = await view.getHtml();
        if (view instanceof Post) {
            let contentPart = document.getElementById("contentPart");
            let contentPartDiv = document.getElementById("contentPartDiv");
            buttonService.fetchAllButtons();
            eventService.addStarEventListeners();
            eventService.paintStars(eventService.currentRating);
            eventService.commentListener();
            eventService.editCommentListener();
            eventService.deleteCommentListener();
            eventService.editPostListener();
            eventService.deletePostListener();
            eventService.SubscribeAuthorListener();


            let user = sessionService.Get();
            
            if (!user){
                eventService.loginListener();
                eventService.loginModalListener();
            }
            
            contentPartDiv.classList.remove("row");
            contentPartDiv.classList.remove("justify-content-md-center");
            contentPart.classList.remove("contentPart");
            contentPart.classList.remove("col-md-10");
            contentPart.classList.add("singlePostStyle");
        }
    }

    if (view instanceof Settings) {
        let contentPartDiv = document.getElementById("contentPartDiv");
        let contentPart = document.getElementById("contentPart");
        contentPartDiv.classList.add("row");
        contentPartDiv.classList.add("justify-content-md-center");
        contentPart.classList.remove("contentPart");
        contentPart.classList.add("settingsStyle");
        contentPart.classList.add("col-md-10");
        eventService.settingsListener();
        eventService.DeleteAccountListener();
    }

    if (view instanceof AdminPanel || view instanceof AdminPanelBanners){
        eventService.isScrollActive = false;
        let contentPartDiv = document.getElementById("contentPartDiv");
        let contentPart = document.getElementById("contentPart");
        contentPartDiv.classList.add("row");
        contentPartDiv.classList.add("justify-content-md-center");
        contentPart.classList.remove("contentPart");
        contentPart.classList.add("settingsStyle");
        contentPart.classList.add("col-md-10");
    }
    if(view instanceof AdminPanelBanners){
        // Call eventService listener here
        eventService.UploadAdBannerModalListener();
        let imageContainerDiv = document.querySelector("#adBannersContainerDiv");
        let imageContainer = document.querySelector("#adBannersContainer");
        imageContainerDiv.classList.add("row");
        imageContainerDiv.classList.add("justify-content-md-center");
        imageContainer.classList.add("contentPart");
        eventService.DeleteAdBannerListener();
    }

    if(view instanceof AdminPanelUsers){
        eventService.isScrollActive = false;
        eventService.DeleteUsersListener();
    }

    if (view instanceof Posts) {
        let contentPartDiv = document.getElementById("contentPartDiv");
        let contentPart = document.getElementById("contentPart");
        contentPartDiv.classList.add("row");
        contentPartDiv.classList.add("justify-content-md-center");
        contentPart.classList.remove("col-md-10");
        contentPart.classList.remove("settingsStyle");
        contentPart.classList.add("contentPart");
        buttonService.fetchAllButtons();        
        eventService.isScrollActive = true;
    }
    
    if (view instanceof MyPosts) {
        eventService.MyPostsListener();
    }
    
    if (view instanceof AuthorPosts) {
        let contentPartDiv = document.getElementById("contentPartDiv");
        let contentPart = document.getElementById("contentPart");
        contentPartDiv.classList.add("row");
        contentPartDiv.classList.add("justify-content-md-center");
        contentPart.classList.remove("col-md-10");
        contentPart.classList.remove("settingsStyle");
        contentPart.classList.add("contentPart");
        eventService.isScrollActive = false;
        eventService.MyPostsListener();
    }
    
    if (view instanceof SearchPosts) {
        let contentPartDiv = document.getElementById("contentPartDiv");
        let contentPart = document.getElementById("contentPart");
        contentPartDiv.classList.add("row");
        contentPartDiv.classList.add("justify-content-md-center");
        contentPart.classList.remove("col-md-10");
        contentPart.classList.remove("settingsStyle");
        contentPart.classList.add("contentPart");
        eventService.isScrollActive = false;

    } 
    themeService.themeCheck();
};

const updateTagFilter = () => {
    const selectedTags = Array.from(document.querySelectorAll('.form-check-input:checked')).map(cb => cb.value);
    const url = `/filterbytags?tags=${selectedTags.join(',')}`;
    naviageteTo(url);
};

const addTagEventListeners = () => {
    const tagCheckboxes = document.querySelectorAll('.form-check-input');
    
    tagCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateTagFilter);
    });
};

window.addEventListener("popstate", router);

document.querySelector('.search-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const query = document.getElementById('searchInput').value;
    if (query) {
        naviageteTo(`/search/${encodeURIComponent(query)}`);
    }
});
// document.getElementById('srcIcon').addEventListener('click', (e) => {
//     e.preventDefault();
//     const query = document.getElementById('searchInput').value;
//     if (query) {
//         naviageteTo(`/search/${(query)}`);
//     }
// });

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
                const link = e.target.closest("[data-link]");
                if (link) {
                    e.preventDefault();
                    console.log('Link clicked:', link.href);
                    naviageteTo(link.href);
                }
            });
    addTagEventListeners(); 
    router();
});
