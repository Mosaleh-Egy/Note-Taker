// Require all the deps


const express = require("express");

const path = require("path");

const fs = require("fs");

const app = express();

var PORT = 3001;
app.use(express.static(__dirname + "/public"));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

// direct user to correct the page depending on the URL provided

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// Send JSON of all notes if user accesses /api/notes

app.get("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (error, notes) => {
    if (error) {
      return console.log(error);
    }
    res.json(JSON.parse(notes));
  });
});

// use POST method to bring user input to backend

app.post("/api/notes", (req, res) => {
  // Declar const for the notes currently being saved by the user
  const currentNote = req.body;

  // Retrieve notes from db.json, it will get the id of the last saved note
  fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (error, notes) => {
    if (error) {
      return console.log(error);
    }
    notes = JSON.parse(notes);

    // Assign the identifiers to each new note and the previous IDs should not match
    if (notes.length > 0) {
      let lastId = notes[notes.length - 1].id;
      var id = parseInt(lastId) + 1;
    } else {
      // giving a id 10 if no notes are there
      var id = 10;
    }

    // create new note object
    let newNote = {
      title: currentNote.title,
      text: currentNote.text,
      id: id,
    };

    // join new note with existing notes array to form a new array
    var newNotesArr = notes.concat(newNote);

    fs.writeFile(
      path.join(__dirname, "./db/db.json"),
      JSON.stringify(newNotesArr),
      (error, data) => {
        if (error) {
          return error;
        }

        console.log(newNotesArr);
        res.json(newNotesArr);
      }
    );
  });
});

//  Delete chosen note using delete http method
app.delete("/api/notes/:id", (req, res) => {
  let deleteId = JSON.parse(req.params.id);
  console.log("ID to be deleted: ", deleteId);
  fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (error, notes) => {
    if (error) {
      return console.log(error);
    }
    let notesArray = JSON.parse(notes);
    // Loop through notes Array and delete the id which are same
    for (var i = 0; i < notesArray.length; i++) {
      if (deleteId == notesArray[i].id) {
        notesArray.splice(i, 1);

        fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(notesArray), (error, data) => {
          if (error) {
            return error
          }
          console.log(notesArray);
          // sending the response of notesArray to the json data
          res.json(notesArray);
        })
      }
    }

  });
});



app.listen(process.env.PORT || PORT, () => console.log(`Application listening on PORT ${PORT}`));

