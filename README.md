# Rules for different permissions

#### Public Routes

- **Route**: `GET /api/cats`
- **Description**: Fetches all cats.
- **Access**: No authentication required.

- **Route**: `GET /api/cats/:id`
- **Description**: Fetches a specific cat by ID.
- **Access**: Public (no authentication required).

#### Protected Routes

- **Route**: `POST /api/cats`
- **Description**: Creates a new cat.
- **Access**: Requires authentication.

- **Route**: `PUT /api/cats/:id`
- **Description**: Updates a specific cat by ID.
- **Access**: Only the owner of the cat can update it.

- **Route**: `PUT /api/users`
- **Description**: Updates user information.
- **Access**: Users can only update their own information.

- On success: Returns a JWT token and user details.
- On failure: Returns `Invalid token` if the given token is invalid.
