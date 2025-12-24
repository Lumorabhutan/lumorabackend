"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const contactus_handler_1 = __importDefault(require("../../handler/contactus/contactus.handler"));
const contactHandler = new contactus_handler_1.default();
class ContactController {
    // Controller methods here
    async createContact(req, res) {
        try {
            const contactData = req.body;
            const contact = await contactHandler.createContact(contactData);
            res.status(201).json({
                success: "success",
                message: "crated Contact Us Successfully"
            });
        }
        catch (error) {
            res.status(500).json({ error: "Failed to create contact" + error });
        }
    }
    async getAllContacts(req, res) {
        try {
            const contacts = await contactHandler.getAllContacts();
            res.status(200).json(contacts);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to retrieve contacts" + error });
        }
    }
    async getContactById(req, res) {
        try {
            const { id } = req.params;
            const contact = await contactHandler.getContactById(Number(id));
            if (!contact)
                return res.status(404).json({ error: "Contact not found" });
            res.status(200).json(contact);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to retrieve contact" });
        }
    }
    async updateContact(req, res) {
        try {
            const { id } = req.params;
            const contactData = req.body;
            const updatedContact = await contactHandler.updateContact(Number(id), contactData);
            if (!updatedContact)
                return res.status(404).json({ error: "Contact not found" });
            res.status(200).json({
                success: "success",
                message: "Updated Contact us Successfully"
            });
        }
        catch (error) {
            res.status(500).json({ error: "Failed to update contact" });
        }
    }
    async deleteContact(req, res) {
        try {
            const { id } = req.params;
            const deletedContact = await contactHandler.deleteContact(Number(id));
            if (!deletedContact)
                return res.status(404).json({ error: "Contact not found" });
            res.status(204).send({
                success: "success",
                message: "deleted Contact us Successfully"
            });
        }
        catch (error) {
            res.status(500).json({ error: "Failed to delete contact" });
        }
    }
}
exports.default = ContactController;
//# sourceMappingURL=contactus.controller.js.map