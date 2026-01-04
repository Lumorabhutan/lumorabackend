import Contact from "../../models/contactus/contactus.model";

export default class ContactRepository {
    // Repository methods here
    async create(contactData: any) {
        // Implementation for creating a contact entry
    const contact = await Contact.create(contactData);
    return contact;
    }
async findAll() {
  const contacts = await Contact.findAll({
    order: [['createdAt', 'DESC']],
  });

  return contacts;
}

    async findById(contactId: number) {
        // Implementation for retrieving a contact entry by ID
    const contact = await Contact.findByPk(contactId);
    return contact;
    }
    async update(contactId: number, contactData: any) {
        // Implementation for updating a contact entry
    const contact = await Contact.findByPk(contactId);
    if (contact) {
        await contact.update(contactData);
    }
    return contact;
    }
    async delete(contactId: number) {
        // Implementation for deleting a contact entry
    const contact = await Contact.findByPk(contactId);
    if (contact) {
        await contact.destroy();
    }
    return contact;
}
}

