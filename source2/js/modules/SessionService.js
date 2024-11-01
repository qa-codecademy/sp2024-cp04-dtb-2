export default class SessionService {
    constructor() {

    };
    Set(session) {
        sessionStorage.setItem("session", JSON.stringify(session)
        );
    }
    Get() {
        const found = sessionStorage.getItem("session")
        const parsed = JSON.parse(found);
        return parsed;
    }
    Remove() {
        sessionStorage.removeItem("session");
    }

}