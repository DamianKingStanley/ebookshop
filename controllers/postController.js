import postModel from "../models/post.js";
import multer from "multer";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}_${file.originalname}`;
        cb(null, uniqueName);
    },
});

const upload = multer({ storage: storage });

// Create Post Function
export const createPost = async(req, res) => {
    try {
        const {
            userId,
            selectedDepartment,
            selectedCollege,
            selectedLevel,
            materials,
            title,
            price,
            author,
        } = req.body;

        // Handle file upload
        const bookcover = req.file ? `uploads/${req.file.filename}` : null;

        if (!bookcover) {
            return res.status(400).json({ error: "Cover picture is required." });
        }

        // Create a new post
        const newPost = await postModel.create({
            userId,
            selectedDepartment,
            selectedCollege,
            selectedLevel,
            materials,
            title,
            price,
            author,
            bookcover,
        });

        res.status(200).json({ message: "Post created successfully.", newPost });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//Filtered Posts

export const fetchFilteredPosts = async(req, res) => {
    try {
        const { department, college, level, materials } = req.query;

        // Build query object based on available filters
        const query = {};
        if (department) query.selectedDepartment = department;
        if (college) query.selectedCollege = college;
        if (level) query.selectedLevel = level;
        if (materials) query.selectedLevel = materials;

        const fetchPosts = await postModel
            .find(query)
            .populate("userId", "username");
        res.status(200).json({ message: "Successful", fetchPosts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//get all posts by categpry
export const getPostsByCategory = async(req, res) => {
    try {
        const { category } = req.params; // This could be 'college', 'department', 'level', 'others'
        const { type } = req.query; // The actual value to filter by (e.g., 'Computer Science')

        let filter = {};

        // Map the category to the corresponding field in your schema
        if (category === "college") {
            filter.selectedCollege = type;
        } else if (category === "department") {
            filter.selectedDepartment = type;
        } else if (category === "level") {
            filter.selectedLevel = type;
        } else if (category === "materials") {
            filter.type = type; // Assuming you have another type field for "others"
        }

        // Find the books that match the filter
        const books = await postModel.find(filter);
        res.json(books);
    } catch (error) {
        console.error("Error fetching posts by category:", error);
        res.status(500).json({ message: error.message });
    }
};
// fetch all post
export const fetchAllPost = async(req, res) => {
    try {
        const fetchPosts = await postModel.find({}).populate("userId", "username");
        res.status(200).json({ message: "successful", fetchPosts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//Search Google book
const googleBooksApiKey = process.env.GOOGLE_BOOKS_API_KEY;

const fetchBooksFromGoogle = async(query) => {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${googleBooksApiKey}`;
    return await axios.get(url);
};

export const searchgoogleBook = async(req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({ error: "Query parameter is required" });
    }
    try {
        const response = await fetchBooksFromGoogle(query);
        res.json(response.data.items);
    } catch (error) {
        console.error("Error fetching data from Google Books API:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Fetch all Google Books with a default query
export const fetchGoogleBook = async(req, res) => {
    try {
        const response = await fetchBooksFromGoogle("textbook");
        res.json(response.data.items);
    } catch (error) {
        console.error("Error fetching data from Google Books API:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

//SEARCH BY TILTLE
export const searchPosts = async(req, res) => {
    try {
        const { title } = req.query;

        if (!title) {
            return res
                .status(400)
                .json({ message: "Title query parameter is required" });
        }

        const posts = await postModel.find({
            title: { $regex: title, $options: "i" }, // Case-insensitive search
        });

        if (posts.length === 0) {
            return res.status(404).json({ message: "No books found" });
        }

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const postCount = async(req, res) => {
    try {
        const postCount = await postModel.countDocuments();
        res.status(200).json({ count: postCount });
    } catch (error) {
        console.error("Error fetching post count:", error);
        res.status(500).json({ message: error.message });
    }
};

// edit post
export const editPost = async(req, res) => {
    try {
        const id = req.params.id;
        console.log(req.body);
        const updatePosts = await postModel.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        console.log(updatePosts);
        res.status(200).json({ message: "Updated succesfully", updatePosts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// delete post
export const deletePost = async(req, res) => {
    try {
        const id = req.params.id;
        await postModel.findByIdAndRemove(id);

        res.status(200).json({ message: "deleted succesfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// single post
export const getSinglePost = async(req, res) => {
    try {
        const id = req.params.id;
        const SinglePost = await postModel.findById(id);
        console.log(SinglePost);
        res.status(200).json({ message: "Fetch succesfully", SinglePost });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// posts by a user
export const getPostsByUser = async(req, res) => {
    try {
        const userId = req.query.userId;
        const posts = await postModel.find({ userId: userId });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};