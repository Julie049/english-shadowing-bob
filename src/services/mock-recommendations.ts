import type { RecommendationService } from '@/types/learning';
export const mockRecommendationService: RecommendationService = { async getRecommendations(lessons) { return lessons.filter(lesson => lesson.isRecommended); } };
