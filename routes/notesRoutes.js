const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  archiveNote,
  trashNote,
} = require('../controllers/notesController')

// All notes routes require authentication
router.use(auth)

router.post('/', createNote)
router.get('/', getNotes)
router.get('/:id', getNoteById)
router.put('/:id', updateNote)
router.delete('/:id', deleteNote)
router.patch('/:id/archive', archiveNote)
router.patch('/:id/trash', trashNote)

module.exports = router
