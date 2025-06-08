import ContactForm from '../model/contactForm.model.js';

export const submitContactForm = async (req, res) => {
    try {
        const { fullName, emailAddress, subject, message } = req.body;

        if (!fullName || !emailAddress || !subject || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newContactForm = new ContactForm({
            fullName,
            emailAddress,
            subject,
            message
        });

        await newContactForm.save();
        res.status(201).json({ message: "Contact form submitted successfully!" });
    } catch (error) {
        console.error("Error submitting contact form:", error);
        res.status(500).json({ message: "Failed to submit contact form. Please try again later." });
    }
}; 