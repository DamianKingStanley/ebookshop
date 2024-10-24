import express from "express";
import upload from "../multer.js";

const router = express.Router();

import {
    createPost,
    fetchFilteredPosts,
    getPostsByCategory,
    searchgoogleBook,
    fetchGoogleBook,
    fetchAllPost,
    searchPosts,
    editPost,
    deletePost,
    getSinglePost,
    getPostsByUser,
    postCount,
} from "../controllers/postController.js";

import auth from "../middleware/auth.js";

router.post("/upload-books", auth, upload.single("bookcover"), createPost);
router.get("/posts", fetchAllPost);
router.get("/filtered-posts", fetchFilteredPosts);
router.get("/:category", getPostsByCategory);
router.get("/googlebook/search", searchgoogleBook);
router.get("/googlebook/fetch", fetchGoogleBook);
router.get("/book/search", searchPosts);
router.get("/posts/count", postCount);
router.put("/posts/edit/:id", auth, editPost);
router.delete("/posts/edit/:id", auth, deletePost);
router.get("/post/:id", getSinglePost);
router.get("/posts/:userId", getPostsByUser);

export default router;