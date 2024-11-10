export class apiCall {
    async fetchPaginatedPosts(postFilter) {
        if (postFilter.totalPages > 0 && postFilter.pageIndex <= postFilter.totalPages) 
            postFilter.pageIndex ++;

        console.log(JSON.stringify(postFilter)); // Optional: Logging filter before sending

        let pagiPostUrl = "https://localhost:7073/api/Posts";
        try {
            const response = await fetch(pagiPostUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(postFilter), // Removed unnecessary wrapping object
            });

            const paginatedPosts = await response.json();
            console.log(paginatedPosts);
            return paginatedPosts;

        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    }

    async fetchDetailedPost(id) {
        let detailedPostUrl = `https://localhost:7073/api/Posts/${id}`;
        try {
            const response = await fetch(detailedPostUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json", // Fixed the typo
                }
            });

            const jsonResponse = await response.json();
            console.log(jsonResponse);
            return jsonResponse;

        } catch (error) {
            console.error("Error fetching post:", error);
        }
    }
}