console.log("CONNECTED");

const naviageteTo = url => {
    history.pushState(null,null,url);
    router();
};


const router = async ()=> {
    const routes = [
        {path: "/", view: ()=> console.log("Viewing Posts")},
        {path: "/post", view: ()=> console.log("Viewing PostDetails")},
        {path: "/aboutus", view: ()=> console.log("Viewing Aboutus")},
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

   console.log(match.route.view());

};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", ()=> {


    document.body.addEventListener("click", e => {
        if(e.target.matches("[data-link]")) {
            e.preventDefault();
            naviageteTo(e.target.href);
        }
    })
    router();
})