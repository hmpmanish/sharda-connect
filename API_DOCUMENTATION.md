# API Documentation 🔌

All API routes are prefixed with `/api`.

## Auth (`/api/auth`)
- `POST /register` - Register a new user
- `POST /login` - Authenticate user & get token
- `POST /logout` - Clear HTTP-only cookie

## Users (`/api/users`)
- `GET /profile` - Get logged-in user profile
- `PUT /profile` - Update profile details
- `GET /public/:username` - Get public profile for anonymous messaging

## Messages (`/api/messages`)
- `POST /send/:userId` - Send an anonymous message
- `GET /inbox` - Get all received anonymous messages
- `PUT /:id/favorite` - Toggle favorite status
- `PUT /:id/read` - Mark message as read
- `DELETE /:id` - Delete an anonymous message

## Connections (`/api/connections`)
- `GET /search` - Search students by keyword
- `POST /request/:userId` - Send a connection request
- `GET /` - Get all user connections (pending, accepted, blocked)
- `PUT /:id` - Update connection status (accept/reject/block)

## Conversations & DMs (`/api/conversations`)
- `GET /` - Get all active conversations
- `POST /` - Create or fetch a conversation with a user
- `GET /:id/messages` - Get all messages in a conversation

## Admin (`/api/admin`)
- *Protected by Admin/SuperAdmin Role Middleware*
- `POST /auth/login` - Admin login
- `GET /dashboard/metrics` - Get total platform stats
- `GET /users` - Manage users
- `GET /reports` - Manage reported messages (Anon & DMs)
- `GET /audit-logs` - (SuperAdmin only) View admin actions
