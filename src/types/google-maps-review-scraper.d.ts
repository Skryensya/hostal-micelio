declare module "google-maps-review-scraper" {
  interface Review {
    author?: string;
    rating?: number;
    date?: string;
    text?: string;
    reviewerUrl?: string;
    review_id?: string;
    [key: string]: unknown;
  }

  interface ScraperOptions {
    sort_type?: "relevent" | "newest" | "highest_rating" | "lowest_rating";
    search_query?: string;
    pages?: number | "max";
    clean?: boolean;
  }

  export function scraper(url: string, options?: ScraperOptions): Promise<Review[]>;
}