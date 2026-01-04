import Review from "../../models/review/review.model";
import { Optional } from 'sequelize';

export interface ReviewAttributes {
    id: number;
    name: string;
    email: string;
    rating: string;
    comment: string;
    status: boolean;
}

export interface ReviewIProps extends Optional<ReviewAttributes, 'id'> { }
export class ReviewRepository {
    async createReview(data: ReviewIProps): Promise<Review> {
        const response = await Review.create(data)
        return response;
    }
    async updateReview(id: number, data: ReviewIProps): Promise<[number, Review[]]> {
        const response = await Review.update(data, { where: { id }, returning: true });
        return response as unknown as [number, Review[]];
    }

    async fetchReview(): Promise<Review[]> {
        const reviews = await Review.findAll({
            order: [['createdAt', 'DESC']],
        });

        return reviews;
    }

    async fetchActiveReview(): Promise<Review[] | null> {
        try {
            const reviews = await Review.findAll({
                where: { status: "true" },
            });
            // Return the reviews only if there’s data
            if (reviews && reviews.length > 0) {
                return reviews;
            }

            // Return null (or an empty array if you prefer)
            return null;
        } catch (error) {
            console.error("Error fetching active reviews:", error);
            throw new Error("Failed to fetch active reviews");
        }
    }

    async deleteReview(id: number): Promise<number> {
        const response = await Review.destroy({ where: { id } });
        return response;
    }
}
