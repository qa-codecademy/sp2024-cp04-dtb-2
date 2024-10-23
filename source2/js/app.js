import AboutUs from "./views/AboutUs.js";
import Post from "./views/Post.js";
import Posts from "./views/Posts.js";

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
    
    const routes = [
        { path: "/", view: Posts },
        { path: "/posts/:id", view: Post },
        { path: "/aboutus", view: AboutUs },
        // {path: "/filterbyold", action: console.log("oldposts") },
        // {path: "/filterbynew"},
        // {path: "/filterbymostpopular"}
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
        view = new match.route.view(getParams(match));  // Instantiate if it's a class
    } else {
        view = match.route.view();  // Call if it's a regular function
    }

    if (view && view.getHtml) {
        document.querySelector("#contentPart").innerHTML = await view.getHtml();
    }

    console.log(view);
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
document.body.addEventListener("click", e => {
    const link = e.target.closest("[data-link]");
    if (link) {
        e.preventDefault();
        const url = new URL(link.href);
        
        // Example: Modify the params based on the link clicked
        if (url.pathname === "/filterbymostpopular") {
            params.sortBy = "popular";
        }

        naviageteTo(link.href);
    }
});