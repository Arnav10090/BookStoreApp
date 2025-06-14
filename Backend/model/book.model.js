import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    // name: {
    //     type: String,
    //     required: true
    // },
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        default: 'Uncategorized'
    },
    image: {
        type: String,
        default: ""
    },
    buyingLink: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

const Book = mongoose.model("Book", bookSchema);

export default Book;
