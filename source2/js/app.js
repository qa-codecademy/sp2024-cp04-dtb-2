import AboutUs from "./views/AboutUs.js";

console.log("CONNECTED");


const naviageteTo = url => {
    history.pushState(null,null,url);
    router();
};


const router = async ()=> {
    const routes = [
        {path: "/", view: ()=> console.log("Viewing Posts")},
        {path: "/post", view: ()=> console.log("Viewing PostDetails")},
        {path: "/aboutus", view: AboutUs },
    ]
   // tEst
   const potenitalMatches = routes.map(route => {
    return {
        route: route,
        isMatch: location.pathname === route.path
    }
   });

   let match = potenitalMatches.find(potenitalMatch => potenitalMatch.isMatch);
   if(!match) {
    match = {
        route: routes[0],
        isMatch: true
    }
   }

   const view = new match.route.view();

   document.querySelector("#contentPart").innerHTML = await view.getHtml();

   console.log(match.route.view());

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