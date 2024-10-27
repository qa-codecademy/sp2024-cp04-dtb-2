export default class SessionService {
    constructor() {
        
    };
    Set (session) {
        localStorage.setItem("session",JSON.stringify(session)
    );
    }
    Get () {
        const found = localStorage.getItem("session")
        const parsed = JSON.parse(found);
        return parsed;
    }
    Remove () {
        localStorage.removeItem("session");
    }

}