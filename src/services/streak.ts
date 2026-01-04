import { differenceInCalendarDays, parseISO, startOfDay } from 'date-fns';

export interface StreakResult {
  streak: number;
  status: 'kept' | 'lost' | 'extended' | 'same_day';
  message: string;
}

export const StreakService = {
  calculateStreak(lastLogDate: string | null, currentStreak: number): StreakResult {
    const today = startOfDay(new Date());
    
    if (!lastLogDate) {
      return { streak: 0, status: 'lost', message: "Start your journey today!" };
    }

    const lastLog = startOfDay(parseISO(lastLogDate));
    const diff = differenceInCalendarDays(today, lastLog);

    if (diff === 0) {
      // Already logged today or streak updated for today
      return { streak: currentStreak, status: 'same_day', message: "Keep it up!" };
    } 
    
    if (diff === 1) {
      // Logged yesterday, streak is safe but not yet extended for today (extension happens on log)
      // Actually, usually we carry over the number.
      return { streak: currentStreak, status: 'kept', message: "Your streak is on fire!" };
    }

    // Missed yesterday (diff > 1)
    return { streak: 0, status: 'lost', message: "Oh no! You missed a day. Let's start fresh!" };
  }
};
