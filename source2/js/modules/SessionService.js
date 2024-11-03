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

        if (parsed && parsed.token) {
            const decodedToken = this.parseJwt(parsed.token);
            parsed.token = decodedToken; // Update token with decoded claims
        }

        return parsed;
    }
    Remove() {
        sessionStorage.removeItem("session");
    }
    parseJwt(token) {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        return JSON.parse(jsonPayload);
    }

}