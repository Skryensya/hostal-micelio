import { scraper } from "google-maps-review-scraper";
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

config({ path: '.env.local' });

interface ScrapeOptions {
  maxPages?: number;
  sortType?: "relevent" | "newest" | "highest_rating" | "lowest_rating";
  searchQuery?: string;
  clean?: boolean;
  saveToFile?: boolean;
}

interface ScrapedReview {
  review_id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
  reviewerUrl: string;
  reviewUrl: string;
  photoCount: number;
  scrapedAt: string;
}

interface ScrapedReviewsData {
  metadata: {
    totalReviews: number;
    scrapedAt: string;
    source: string;
    pages: number;
    sortType: string;
  };
  reviews: ScrapedReview[];
}

/**
 * Detect if text is in Spanish
 */
function isSpanishText(text: string): boolean {
  if (!text || text.length < 10) return false;
  
  // Spanish indicators - words, characters, and patterns common in Spanish
  const spanishIndicators = [
    // Common Spanish words
    /\b(el|la|los|las|un|una|de|del|en|con|por|para|que|es|está|muy|más|también|pero|como|su|se)\b/gi,
    // Spanish specific characters
    /[ñáéíóúü]/gi,
    // Spanish patterns
    /ción\b/gi,
    /\bexcelente\b/gi,
    /\brecomiendo\b/gi,
    /\bgracias\b/gi,
    /\blugar\b/gi,
    /\batención\b/gi,
    /\bservicio\b/gi,
    /\bhostal\b/gi,
    /\bperfecto\b/gi,
    /\blindo\b/gi,
    /\bmuy\b/gi,
    /\bsuper\b/gi,
    /\bbien\b/gi,
    /\btodo\b/gi,
  ];
  
  // English indicators to avoid false positives
  const englishIndicators = [
    /\b(the|and|was|were|have|had|will|would|could|should|this|that|with|from|they|there|where|when|what|which|really|very|great|good|amazing|wonderful|beautiful|perfect|excellent|recommend|staff|room|place|stay|love|best|nice|friendly|clean|comfortable)\b/gi,
  ];
  
  let spanishScore = 0;
  let englishScore = 0;
  
  // Count Spanish indicators
  spanishIndicators.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      spanishScore += matches.length;
    }
  });
  
  // Count English indicators
  englishIndicators.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      englishScore += matches.length;
    }
  });
  
  // Must have significantly more Spanish indicators than English
  return spanishScore > englishScore && spanishScore >= 3;
}

/**
 * Scrape Google Maps reviews using google-maps-review-scraper package
 * @param url Google Maps place URL
 * @param options Scraping configuration options
 */
export async function scrapeGoogleReviews(
  url: string,
  options: ScrapeOptions = {}
) {
  const {
    maxPages = 4,
    sortType = "relevent", 
    searchQuery = "",
    clean = false,
    saveToFile = true,
  } = options;

  if (!url || typeof url !== "string") {
    throw new Error("Valid URL is required");
  }

  // Ensure URL has Spanish language parameter
  const spanishUrl = url.includes('hl=') ? url : url + (url.includes('?') ? '&hl=es' : '?hl=es');
  
  console.log(`Scraping reviews from: ${spanishUrl}`);
  console.log(`Pages: ${maxPages}, Sort: ${sortType}`);
  console.log(`Language: Spanish (hl=es)`);

  try {
    const reviews = await scraper(spanishUrl, {
      sort_type: sortType,
      search_query: searchQuery,
      pages: maxPages,
      clean: clean,
    });

    if (clean && typeof reviews === 'string') {
      // When clean=true, the parser returns a JSON string
      const parsedReviews = JSON.parse(reviews);
      console.log(`✅ Successfully scraped ${parsedReviews.length} clean reviews`);
      return parsedReviews;
    } else if (reviews && Array.isArray(reviews)) {
      // When clean=false, manually parse the raw data
      const parsedReviews = (reviews as unknown[]).map((reviewData: unknown, index: number) => {
        try {
          const reviewArray = reviewData as unknown[];
          const review = reviewArray[0] as unknown[];
          
          // Get the full review text - try multiple possible locations
          const fullText = review[2]?.[15]?.[0]?.[0] || 
                          review[2]?.[3] || 
                          review[2]?.[0]?.[1] || 
                          '';
          
          // Fix date formatting - the timestamp appears to be in microseconds
          const timestamp = review[1]?.[2] || 0;
          const date = new Date(timestamp / 1000); // Convert from microseconds to milliseconds
          const formattedDate = date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });
          
          // Get reviewer URL
          const reviewerUrl = review[1]?.[4]?.[5]?.[2]?.[0] || '';
          
          // Count photos in the review
          const photos = review[2]?.[2] || [];
          const photoCount = Array.isArray(photos) ? photos.length : 0;
          
          // Generate review URL using Google Maps review data format
          const reviewId = String(review[0] || '');
          const placeIdMatch = spanishUrl.match(/!1s([^!]+)/);
          const placeId = placeIdMatch ? placeIdMatch[1] : '';
          
          // Use the Google Maps reviews data URL format with coordinates
          const reviewUrl = reviewId && placeId 
            ? `https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1s${reviewId}!2m1!1s0x0:${placeId}!3m1!1s2@1:${reviewId.replace('==', '%3D%3D')}/@-39.2856781,-72.2264821,216m?hl=es`
            : '';
          
          return {
            review_id: String(reviewId),
            author: String(review[1]?.[4]?.[5]?.[0] || 'Anónimo'),
            rating: Number(review[2]?.[0]?.[0] || 0),
            text: String(fullText),
            date: formattedDate,
            reviewerUrl: String(reviewerUrl),
            reviewUrl: reviewUrl,
            photoCount: photoCount,
            scrapedAt: new Date().toISOString()
          };
        } catch (error) {
          console.warn(`Error parsing review ${index}:`, error);
          return {
            review_id: '',
            author: 'Anónimo',
            rating: 0,
            text: '',
            date: '',
            reviewerUrl: '',
            reviewUrl: '',
            photoCount: 0,
            scrapedAt: new Date().toISOString()
          };
        }
      });
      
      console.log(`✅ Successfully scraped ${parsedReviews.length} raw reviews`);
      
      // Filter for 5-star Spanish reviews and limit to 20
      const filteredReviews = parsedReviews
        .filter(review => {
          const isFiveStars = review.rating === 5;
          const isSpanish = isSpanishText(review.text);
          
          if (!isFiveStars) {
            console.log(`⚠️ Filtered out review by ${review.author}: Not 5 stars (${review.rating} stars)`);
          } else if (!isSpanish) {
            console.log(`⚠️ Filtered out review by ${review.author}: Not in Spanish`);
          }
          
          return isFiveStars && isSpanish;
        })
        .slice(0, 30); // Limit to 30 reviews
      
      console.log(`🌟 Filtered to ${filteredReviews.length} Spanish 5-star reviews`);
      
      // Save to JSON file if requested
      if (saveToFile) {
        const structuredData: ScrapedReviewsData = {
          metadata: {
            totalReviews: filteredReviews.length,
            scrapedAt: new Date().toISOString(),
            source: spanishUrl,
            pages: maxPages,
            sortType: sortType
          },
          reviews: filteredReviews
        };
        
        await saveToJsonFile(structuredData);
      }
      
      return filteredReviews;
    } else {
      console.warn("⚠️ No reviews returned or invalid format");
      console.log("Returned data type:", typeof reviews);
      return [];
    }
  } catch (error) {
    console.error(`❌ Error scraping reviews:`, error);
    throw error;
  }
}

/**
 * Save scraped reviews data to JSON file
 */
async function saveToJsonFile(data: ScrapedReviewsData): Promise<void> {
  try {
    const dbDir = path.join(process.cwd(), 'db');
    const filePath = path.join(dbDir, 'SCRAPED_REVIEWS.json');
    
    // Ensure db directory exists
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    
    // Save with pretty formatting
    const jsonContent = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonContent, 'utf-8');
    
    console.log(`💾 Reviews saved to: ${filePath}`);
    console.log(`📊 Total reviews saved: ${data.reviews.length}`);
  } catch (error) {
    console.error('❌ Error saving to JSON file:', error);
    throw error;
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const url = args[0] || process.env.GOOGLE_MAPS_REVIEWS_URL;
  
  if (!url) {
    console.log("Usage: npx tsx src/scripts/scrapeReviews.ts <google-maps-url> [maxPages]");
    console.log("Or set GOOGLE_MAPS_REVIEWS_URL environment variable");
    console.log("Example: npx tsx src/scripts/scrapeReviews.ts 'https://www.google.com/maps/place/Example+Restaurant' 3");
    process.exit(1);
  }

  const maxPages = args[1] ? parseInt(args[1]) : 4;

  scrapeGoogleReviews(url, { maxPages })
    .then(reviews => {
      console.log(`\n📊 Resumen de Reseñas (${reviews.length} reseñas):\n`);
      reviews.forEach((review: { author?: string; rating?: number; date?: string; text?: string; reviewerUrl?: string; reviewUrl?: string }, index: number) => {
        console.log(`${index + 1}. ${review.author || 'Anónimo'} (${review.rating || 'Sin calificación'}⭐)`);
        console.log(`   Fecha: ${review.date || 'Sin fecha'}`);
        if (review.reviewUrl) {
          console.log(`   Review URL: ${review.reviewUrl}`);
        }
        if (review.reviewerUrl) {
          console.log(`   Perfil: ${review.reviewerUrl}`);
        }
        console.log(`   Reseña: ${review.text || 'Sin texto'}`);
        console.log(`   ${'─'.repeat(80)}\n`);
      });
    })
    .catch(error => {
      console.error(`❌ Error: ${error.message}`);
      process.exit(1);
    });
}