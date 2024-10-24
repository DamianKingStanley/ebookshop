import mongoose from "mongoose";

// const reviewSchema = mongoose.Schema(
//   {
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     rating: { type: Number, required: true }, // Assuming rating is a number
//     createdAt: { type: Date, default: Date.now },
//   },
//   {
//     _id: false,
//   }
// );

const postSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    selectedDepartment: { type: String, required: true },
    selectedCollege: { type: String, required: true },
    selectedLevel: { type: String, required: true },
    materials: { type: String },
    title: { type: String, required: true },
    price: { type: String, required: true },
    bookcover: { type: String, required: true }, // URL or path to the photo
    author: { type: String },
    // reviews: [reviewSchema],
}, {
    timestamps: true,
});

export default mongoose.model("Post", postSchema);