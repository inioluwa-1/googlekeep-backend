const Note = require('../models/Note')
const { ApiError, asyncHandler } = require('../middleware/errorHandler')

const createNote = asyncHandler(async (req, res) => {
  const { title, content, color } = req.body
  const userId = req.user.userId

  if (!title && !content) {
    throw new ApiError(400, 'Title or content is required')
  }

  const note = new Note({
    userId,
    title,
    content,
    color,
  })

  await note.save()
  res.status(201).json({
    success: true,
    message: 'Note created',
    note,
  })
})

const getNotes = asyncHandler(async (req, res) => {
  const userId = req.user.userId
  const { archived, trashed } = req.query

  const filter = { userId }

  if (archived === 'true') {
    filter.isArchived = true
  } else if (archived === 'false') {
    filter.isArchived = false
  }

  if (trashed === 'true') {
    filter.isTrashed = true
  } else if (trashed === 'false') {
    filter.isTrashed = false
  }

  const notes = await Note.find(filter).sort({ createdAt: -1 })
  res.json({ success: true, notes })
})

const getNoteById = asyncHandler(async (req, res) => {
  const { id } = req.params
  const userId = req.user.userId

  const note = await Note.findOne({ _id: id, userId })
  if (!note) {
    throw new ApiError(404, 'Note not found')
  }

  res.json({ success: true, note })
})

const updateNote = asyncHandler(async (req, res) => {
  const { id } = req.params
  const userId = req.user.userId
  const { title, content, color, isArchived, isTrashed, labels } = req.body

  const note = await Note.findOne({ _id: id, userId })
  if (!note) {
    throw new ApiError(404, 'Note not found')
  }

  if (title !== undefined) note.title = title
  if (content !== undefined) note.content = content
  if (color !== undefined) note.color = color
  if (isArchived !== undefined) note.isArchived = isArchived
  if (isTrashed !== undefined) note.isTrashed = isTrashed
  if (labels !== undefined) note.labels = labels

  await note.save()
  res.json({
    success: true,
    message: 'Note updated',
    note,
  })
})

const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.params
  const userId = req.user.userId

  const note = await Note.findOneAndDelete({ _id: id, userId })
  if (!note) {
    throw new ApiError(404, 'Note not found')
  }

  res.json({
    success: true,
    message: 'Note deleted successfully',
  })
})

const archiveNote = asyncHandler(async (req, res) => {
  const { id } = req.params
  const userId = req.user.userId

  const note = await Note.findOne({ _id: id, userId })
  if (!note) {
    throw new ApiError(404, 'Note not found')
  }

  note.isArchived = !note.isArchived
  await note.save()

  res.json({
    success: true,
    message: note.isArchived ? 'Note archived' : 'Note unarchived',
    note,
  })
})

const trashNote = asyncHandler(async (req, res) => {
  const { id } = req.params
  const userId = req.user.userId

  const note = await Note.findOne({ _id: id, userId })
  if (!note) {
    throw new ApiError(404, 'Note not found')
  }

  note.isTrashed = !note.isTrashed
  await note.save()

  res.json({
    success: true,
    message: note.isTrashed ? 'Note moved to trash' : 'Note restored',
    note,
  })
})

module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  archiveNote,
  trashNote,
}
