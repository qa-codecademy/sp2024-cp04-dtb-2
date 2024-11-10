class PostFilterService{
    constructor() {
        this.filters = {
            pageIndex: 1,
            totalPages: 0,
            sortBy: "new",
            tags: [""],
            year: 0,
            month: 0
        }
        };

    updateFilter({ pageIndex, totalPages, sortBy, tags, year, month }) {
        if (pageIndex !== undefined) this.filters.pageIndex = pageIndex;
        if (totalPages !== undefined) this.filters.totalPages = totalPages;
        if (sortBy !== undefined) this.filters.sortBy = sortBy;
        if (tags !== undefined) this.filters.tags = tags;
        if (year !== undefined) this.filters.year = year;
        if (month !== undefined) this.filters.month = month;
    }

    getFilters() {
        return this.filters;
    }
}

const postFilterService = new PostFilterService();
Object.freeze(postFilterService);
export default postFilterService;