const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb+srv://saileshkumar:sai26lesh@cluster0.p2wivek.mongodb.net/notesDB?retryWrites=true&w=majority&appName=cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("Connection error", err));

// Schema & Model
const noteSchema = new mongoose.Schema({
    title: String,
    content: String,
    date: { type: Date, default: Date.now }
});

const Note = mongoose.model("Note", noteSchema);

// Routes
app.post("/notes", async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ error: "Title and content are required" });
    }
    try {
        const newNote = new Note({ title, content });
        await newNote.save();
        res.json({ message: "Note added successfully", note: newNote });
    } catch (error) {
        res.status(500).json({ status: "Error saving note", error: error.message });
    }
});

app.get("/notes", async (req, res) => {
    try {
        const allNotes = await Note.find();
        res.json(allNotes);
    } catch (error) {
        res.status(500).json({ status: "Error fetching notes", error: error.message });
    }
});

app.listen(5000, () => {
    console.log("Server is online on port 5000");
});
