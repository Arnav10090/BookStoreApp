import mongoose from "mongoose";

const contactFormSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    emailAddress: {
        type: String,
        required: true,
        lowercase: true
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ContactForm = mongoose.model("ContactForm", contactFormSchema);

export default ContactForm; 