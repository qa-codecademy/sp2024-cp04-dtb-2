import AboutUs from "./views/AboutUs.js";
import Post from "./views/Post.js";
import Posts from "./views/Posts.js";
import postFilterService from "./modules/PostFilterService.js";
import eventService from "./modules/EventService.js";
import ModalService from "./modules/ModalService.js";
import modalService from "./modules/ModalService.js";
import themeService from "./modules/ThemeService.js";

console.log("CONNECTED");

const getParams = match => {
    if (!match.result) return {};

    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

    console.log(Array.from(match.route.path.matchAll(/:(\w+)/g)));

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
        case "/filterbyold":
            postFilterService.updateFilter({ sortBy: "old" });
            break;

        case "/filterbynew":
            postFilterService.updateFilter({ sortBy: "new" });
            break;

        case "/filterbymostpopular":
            postFilterService.updateFilter({ sortBy: "popular" });
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
        // { path: "/filterbymonthandyear", view: () => new Posts(postFilterService.filters) },
        // { path: "/filterbytags", view: () => new Posts(postFilterService.filters) }
    ]

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
            eventService.addStarEventListeners();
            eventService.paintStars(eventService.currentRating);
            eventService.commentListener();
            eventService.editCommentListener();
            eventService.deleteCommentListener();
        }
    }
    themeService.themeCheck();
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        const link = e.target.closest("[data-link]");
        if (link) {
            e.preventDefault();
            console.log('Link clicked:', link.href);
            naviageteTo(link.href);
        }
    });
    router();
});