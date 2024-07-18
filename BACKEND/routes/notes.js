// routes/notes.js
const express = require('express');
const router = express.Router();
const Note = require('../server/models/Note');
const auth = require('../middleware/auth');


//HERE we creating a new note

router.post('/create', auth, async (req, res) => {
  const { title, content, tags, backgroundColor, reminder } = req.body;
  const note = new Note({
    title,
    content,
    tags,
    backgroundColor,
    archived: false,
    deletedAt: null,
    reminder,
    userId: req.user._id,
  });

  try {
    await note.save();
    res.send('Note created successfully');
  } catch (err) {
    res.status(400).send(err);
  }
});

//GET ALL NOTES 
router.get('/', auth, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user._id, deletedAt: null });
    res.send(notes);
  } catch (err) {
    res.status(400).send(err);
  }
});

//SEARCH NOTES 
router.get('/search', auth, async (req,res) => {
    const {query} = req.query;
    try {
      const notes = await Note.find({
        userId: req.user._id, deletedAt: null,
        $or: [
          {title: {$regex: query, $options: 'i'}},
          {content: {$regex: query, $options: 'i'}},
          {tags:{$regex: query, $options: 'i'}}
        ]
      });
      res.send(notes);
    } catch (err) {
      res.status(400).send(err);
    }
})
    //LABEL VIEW
router.get('/label/:label', auth, async (req,res) => {
    const {label} = req.params;
    try {
      const notes = await Note.find({
        userId: req.user._id, deletedAt: null,
        tags: label
      });
      res.send(notes);
    } catch (err) {
      res.status(400).send(err);
    }
})

//ARCHIEVED NOTES

router.get('/archived', auth, async (req,res) => {
    try {
      const notes = await Note.find({
        userId: req.user._id, 
        archived: true,
        deletedAt: null,
      });
      res.send(notes);
    } catch (err) {
      res.status(400).send(err);
    }
})

router.post('/archive/:id', auth, async (req,res) => {
    const {id} = req.params;
    try {
      await Note.updateOne({ _id:id,
        userId: req.user._id,} , 
        {archived:true
      });
      res.send("Note Archieved Successfully");
    } catch (err) {
      res.status(400).send(err);
    }
})

//TRASH NOTES

router.get('/trash', auth, async (req,res) => {
    const thirtyDaysAgo =  new Date(Date.now() - 30 * 24 * 60 * 650 * 1000);
    try {
      const notes = await Note.find({
        userId: req.user._id, 
        deletedAt:{$ne: null, $gte: thirtyDaysAgo}
      });
      res.send(notes);
    } catch (err) {
      res.status(400).send(err);
    }
})

router.post('/delete/:id', auth, async (req,res) => {
  const { id } = req.params;
    try {
      await Note.updateOne({ _id: id,
            userId: req.user._id,} , 
            {deletedAt: new Date()
        });
        res.send("Note Moved to trash");
      } catch (err) {
        res.status(400).send(err);
      }
});

//HERE WE TRY TO RESTORE NOTE FROM TRASH

router.post('/restore/:id', auth, async (req, res) => {
    const {id} = req.params;
    try {
      await Note.updateOn({ _id:id,
        userId: req.user._id,} ,{deletedAt: null
      });
      res.send("Note Restored Successfully");
    } catch (err) {
      res.status(400).send(err);
    }
})

// HERE WE TRY TO DELETE NOTE PERMANANTLY
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    await Note.deleteOne({_id : id, user_id: req.user._id });
    res.send("Note Deleted Permanantly");
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
