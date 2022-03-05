// get route to show all notes that should return as an array of objects
const notes = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const { readFromFile, readAndAppend, writeToFile } = require("../helpers/fsUtils");

// GET Route for retrieving all the tips
notes.get("/notes", (req, res) => {
  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

// create note (post a route)
notes.post("/notes", (req, res) => {
  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const createNote = {
      title,
      text,
      id: uuidv4(),
    };

    readAndAppend(createNote, "./db/db.json");

    const response = {
      status: "note created",
      body: createNote,
    };

    res.json(response);
  } else {
    res.json("Error in posting feedback");
  }
});

// EXTRA CREDIT, delete notes
notes.delete("/notes/:note_id", (req, res) => {
  const noteId = req.params.note_id;
  console.log(noteId);
  readFromFile("./db/db.json")
    .then((data) => JSON.parse(data))
    .then((json) => {
      // Make a new array of all tips except the one with the ID provided in the URL
      const result = json.filter((notes) => notes.id !== noteId);
      console.log(result);
      // Save that array to the filesystem
      writeToFile("./db/db.json", result);

      // Respond to the DELETE request
      res.json(`Item ${noteId} has been deleted 🗑️`);
    });
});
module.exports = notes;
