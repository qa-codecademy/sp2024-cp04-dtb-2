import loadingSpinnerService from "./loadingSpinnerService.js";

class ApiCaller {
    constructor() {
        this.isFetching = false;
    }
    async fetchFromDB(url, method, body, token) {
        try {
            if(this.isFetching) return;

            this.isFetching = true;

            loadingSpinnerService.displaySpinner();
            const headers = {
                "Content-Type": "application/json",
            };
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const response = await fetch(url, {
                method,
                headers,
                body: body ? JSON.stringify(body) : undefined,
            });

            if (response) {
                const contentType = response.headers.get("Content-Type");
                if (contentType && contentType.includes("application/json")) {
                    const result = await response.json();
                    console.log(result);
                    loadingSpinnerService.hideSpinner();
                    this.isFetching = false;
                    result.status = response.status;
                    return result;
                } else {
                    loadingSpinnerService.hideSpinner();
                    this.isFetching = false;
                    return response;
                }
            }
            this.isFetching = false;
            loadingSpinnerService.hideSpinner();

        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    }

}

const apiCaller = new ApiCaller();
export default apiCaller;