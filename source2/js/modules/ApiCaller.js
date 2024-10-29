export class ApiCaller {
    async fetchFromDB(url, method, body, token) {
        try {
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
                    return result;
                } else {
                    console.log(response);
                    return response;
                }
            }

        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    }

}