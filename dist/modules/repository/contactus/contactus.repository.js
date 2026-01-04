"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const contactus_model_1 = __importDefault(require("../../models/contactus/contactus.model"));
class ContactRepository {
    // Repository methods here
    async create(contactData) {
        // Implementation for creating a contact entry
        const contact = await contactus_model_1.default.create(contactData);
        return contact;
    }
    async findAll() {
        const contacts = await contactus_model_1.default.findAll({
            order: [['createdAt', 'DESC']],
        });
        return contacts;
    }
    async findById(contactId) {
        // Implementation for retrieving a contact entry by ID
        const contact = await contactus_model_1.default.findByPk(contactId);
        return contact;
    }
    async update(contactId, contactData) {
        // Implementation for updating a contact entry
        const contact = await contactus_model_1.default.findByPk(contactId);
        if (contact) {
            await contact.update(contactData);
        }
        return contact;
    }
    async delete(contactId) {
        // Implementation for deleting a contact entry
        const contact = await contactus_model_1.default.findByPk(contactId);
        if (contact) {
            await contact.destroy();
        }
        return contact;
    }
}
exports.default = ContactRepository;
//# sourceMappingURL=contactus.repository.js.map