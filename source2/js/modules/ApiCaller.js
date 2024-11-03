import loadingSpinnerService from "./loadingSpinnerService.js";

export class ApiCaller {
    async fetchFromDB(url, method, body, token) {
        try {
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
                    return result;
                } else {
                    console.log(response);
                    loadingSpinnerService.hideSpinner();
                    return response;
                }
            }
            loadingSpinnerService.hideSpinner();

        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    }

}