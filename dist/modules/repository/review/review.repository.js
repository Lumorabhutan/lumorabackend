"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRepository = void 0;
const review_model_1 = __importDefault(require("../../models/review/review.model"));
class ReviewRepository {
    async createReview(data) {
        const response = await review_model_1.default.create(data);
        return response;
    }
    async updateReview(id, data) {
        const response = await review_model_1.default.update(data, { where: { id }, returning: true });
        return response;
    }
    async fetchReview() {
        const reviews = await review_model_1.default.findAll({
            order: [['createdAt', 'DESC']],
        });
        return reviews;
    }
    async fetchActiveReview() {
        try {
            const reviews = await review_model_1.default.findAll({
                where: { status: "true" },
            });
            // Return the reviews only if there’s data
            if (reviews && reviews.length > 0) {
                return reviews;
            }
            // Return null (or an empty array if you prefer)
            return null;
        }
        catch (error) {
            console.error("Error fetching active reviews:", error);
            throw new Error("Failed to fetch active reviews");
        }
    }
    async deleteReview(id) {
        const response = await review_model_1.default.destroy({ where: { id } });
        return response;
    }
}
exports.ReviewRepository = ReviewRepository;
//# sourceMappingURL=review.repository.js.map