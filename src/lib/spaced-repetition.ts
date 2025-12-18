/**
 * Spaced Repetition Algorithm (SM-2)
 * 
 * This implementation is based on the SuperMemo SM-2 algorithm
 * for calculating optimal review intervals based on user performance.
 */

export interface ReviewResult {
  ease_factor: number;
  interval: number;
  next_review_date: Date;
  status: "new" | "learning" | "reviewing" | "mastered";
}

/**
 * Calculate the next review schedule based on user performance
 * 
 * @param quality - Quality of recall (0-5)
 * @param repetitions - Number of consecutive correct responses
 * @param easeFactor - Current ease factor (default: 2.5)
 * @param previousInterval - Previous interval in days (default: 0)
 * @returns ReviewResult with updated parameters
 */
export function calculateNextReview(
  quality: number,
  repetitions: number,
  easeFactor: number = 2.5,
  previousInterval: number = 0
): ReviewResult {
  // Ensure quality is between 0 and 5
  quality = Math.max(0, Math.min(5, quality));
  
  // Calculate new ease factor
  let newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  
  // Ease factor should not be less than 1.3
  newEaseFactor = Math.max(1.3, newEaseFactor);
  
  let newRepetitions = repetitions;
  let newInterval = previousInterval;
  let status: "new" | "learning" | "reviewing" | "mastered" = "learning";
  
  if (quality < 3) {
    newRepetitions = 0;
    newInterval = 1;
    status = "learning";
  } else {
    newRepetitions = repetitions + 1;
    
    if (newRepetitions === 1) {
      newInterval = 1;
      status = "learning";
    } else if (newRepetitions === 2) {
      newInterval = 6;
      status = "reviewing";
    } else {
      newInterval = Math.round(previousInterval * newEaseFactor);
      
      if (newInterval >= 21) {
        status = "mastered";
      } else {
        status = "reviewing";
      }
    }
  }
  
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);
  
  return {
    ease_factor: newEaseFactor,
    interval: newInterval,
    next_review_date: nextReviewDate,
    status,
  };
}

export function performanceToQuality(
  isCorrect: boolean,
  timeSpent?: number,
  difficulty?: "easy" | "medium" | "hard"
): number {
  if (!isCorrect) {
    return 1;
  }
  
  if (difficulty === "easy" || (timeSpent && timeSpent < 3)) {
    return 5;
  } else if (difficulty === "medium" || (timeSpent && timeSpent < 10)) {
    return 4;
  } else {
    return 3;
  }
}

