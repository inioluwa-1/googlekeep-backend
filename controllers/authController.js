const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { ApiError, asyncHandler } = require('../middleware/errorHandler')

const signup = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body

  // Validate input
  if (!firstName || !lastName || !email || !password) {
    throw new ApiError(400, 'All fields are required', [
      'firstName',
      'lastName',
      'email',
      'password',
    ])
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    throw new ApiError(400, 'Email already registered')
  }

  // Create new user
  const user = new User({
    firstName,
    lastName,
    email,
    password,
  })

  await user.save()

  // Generate token
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user: user.toJSON(),
    token,
  })
})

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Validate input
  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required', [
      'email',
      'password',
    ])
  }

  // Find user
  const user = await User.findOne({ email })
  if (!user) {
    throw new ApiError(401, 'Invalid credentials')
  }

  // Compare password
  const isMatch = await user.comparePassword(password)
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials')
  }

  // Generate token
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  res.json({
    success: true,
    message: 'Login successful',
    user: user.toJSON(),
    token,
  })
})

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.userId)
  if (!user) {
    throw new ApiError(404, 'User not found')
  }
  res.json({ success: true, user: user.toJSON() })
})

module.exports = {
  signup,
  login,
  getProfile,
}
