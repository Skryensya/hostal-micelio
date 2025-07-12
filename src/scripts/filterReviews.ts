import fs from 'fs';
import path from 'path';

interface Review {
  review_id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  reviewerUrl: string;
  reviewUrl: string;
  scrapedAt: string;
}

interface ReviewsData {
  metadata: {
    totalReviews: number;
    scrapedAt: string;
    source: string;
    pages: number;
    sortType: string;
    filteredAt?: string;
  };
  reviews: Review[];
}

function hasGoodSpelling(text: string): boolean {
  // Very bad patterns that should be filtered
  const veryBadPatterns = [
    /\w{25,}/g, // Extremely long words
    /[0-9]{8,}/g, // Very long numbers in text
    /\b\w\b(?:\s+\w\b){5,}/g, // Many single letters in a row
  ];
  
  // Check for very bad patterns
  for (const pattern of veryBadPatterns) {
    if (pattern.test(text)) {
      return false;
    }
  }
  
  // Text must be reasonably long
  if (text.length < 20) {
    return false;
  }
  
  // Must contain some Spanish indicators
  const hasSpanishWords = /\b(excelente|bueno|muy|súper|hermoso|lugar|atención|recomiendo|gracias|hostal|lindo|cómodo|limpio)\b/gi.test(text);
  const hasSpanishStructure = /\b(el|la|los|las|un|una|de|del|en|con|por|para|que|es|está|todo|bien)\b/gi.test(text);
  
  return hasSpanishWords || hasSpanishStructure;
}

function isRealName(name: string): boolean {
  // Clear username patterns to filter out
  const usernamePatterns = [
    /^[a-z]+_[a-z]+$/i, // user_name format
    /^[a-z]+\d{2,}$/i, // username123
    /^\w{1,2}$/i, // Very short (1-2 chars)
    /^[A-Z_]{4,}$/i, // ALL_CAPS_USERNAMES
    /\d{4,}/g, // Names with 4+ numbers
    /^(user|guest|admin|test)/i, // Common username prefixes
    /\b(STYLE|STAX)\s/i, // Business names with space
    /^[a-z]{3,}\s+(AH|BV)$/i, // name + initials pattern like "bel AH"
  ];
  
  // Check for obvious username patterns
  for (const pattern of usernamePatterns) {
    if (pattern.test(name)) {
      return false;
    }
  }
  
  // Must have at least one space (first + last name)
  if (!name.includes(' ')) {
    return false;
  }
  
  // Must have reasonable length
  if (name.length < 5 || name.length > 50) {
    return false;
  }
  
  // Must start with capital letter
  if (!/^[A-ZÁÉÍÓÚÑÜ]/.test(name)) {
    return false;
  }
  
  return true;
}

function filterReviews() {
  try {
    const filePath = path.join(process.cwd(), 'db', 'SCRAPED_REVIEWS.json');
    const data: ReviewsData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    console.log(`📊 Original reviews: ${data.reviews.length}`);
    
    const filteredReviews = data.reviews.filter(review => {
      const hasGoodSpellingScore = hasGoodSpelling(review.text);
      const hasRealNameScore = isRealName(review.author);
      
      if (!hasGoodSpellingScore) {
        console.log(`❌ Filtered out (bad spelling): "${review.author}" - "${review.text.substring(0, 50)}..."`);
      }
      
      if (!hasRealNameScore) {
        console.log(`❌ Filtered out (username): "${review.author}"`);
      }
      
      return hasGoodSpellingScore && hasRealNameScore;
    });
    
    console.log(`\n✅ Filtered reviews: ${filteredReviews.length}`);
    console.log(`\n📝 Selected reviews:`);
    filteredReviews.forEach((review, index) => {
      console.log(`${index + 1}. ${review.author} - "${review.text.substring(0, 60)}..."`);
    });
    
    // Update the data
    const filteredData: ReviewsData = {
      ...data,
      metadata: {
        ...data.metadata,
        totalReviews: filteredReviews.length,
        filteredAt: new Date().toISOString(),
      },
      reviews: filteredReviews
    };
    
    // Save filtered reviews
    fs.writeFileSync(filePath, JSON.stringify(filteredData, null, 2), 'utf-8');
    console.log(`\n💾 Saved ${filteredReviews.length} filtered reviews to ${filePath}`);
    
  } catch (error) {
    console.error('❌ Error filtering reviews:', error);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  filterReviews();
}

export { filterReviews };