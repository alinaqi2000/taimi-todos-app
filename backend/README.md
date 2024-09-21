# Todos API Documentation

## 1. Get All Users

**Endpoint:** `GET /users/all`

**Request:**
* No request body.

**Response:**
```json
{
  "users": [
    {
      "id": "61462",
      "name": "Ali",
      "email": "ali@gmail.com"
    },
    {
      "id": "65580",
      "name": "Ali",
      "email": "alia@gmail.com"
    }
  ]
}
```

## 2. Register a New User

**Endpoint:** `POST /users/register`

**Request:**

| Field    | Type   | Description                |
|----------|--------|----------------------------|
| name     | string | User's name (required)     |
| email    | string | User's email (required)    |
| password | string | User's password (required) |

**Responses:**

| Request Body | Response |
|--------------|----------|
| `{"email": "ali4@gmail.com", "password": "ali12345"}` | `{"error": "Please provide all the fields."}` |
| `{"name": "Taimoor", "email": "ali4@gmail.com", "password": "ali12345"}` | `{"error": "This email is already taken!"}` |
| `{"name": "Taimoor", "email": "ali40@gmail.com", "password": "ali12345"}` | `{"user": {"id": 69452, "name": "Taimoor", "email": "ali40@gmail.com"}}` |

## 3. User Login

**Endpoint:** `POST /users/login`

**Request:**

| Field    | Type   | Description                |
|----------|--------|----------------------------|
| email    | string | User's email (required)    |
| password | string | User's password (required) |

**Responses:**

| Request Body | Response |
|--------------|----------|
| `{"email": "ali40@gmail.com", "password": ""}` | `{"error": "Please provide all the fields."}` |
| `{"email": "ali40@gmail.com", "password": "xx"}` | `{"error": "Invalid login credentials!"}` |
| `{"email": "ali40@gmail.com", "password": "ali12345"}` | `{"user": {"id": "69452", "name": "Taimoor", "email": "ali40@gmail.com"}}` |

## 4. Get Todos for a User

**Endpoint:** `GET /todos/all/:userId`

**Request:**
* No request body.

**Response:**
```json
{
  "todos": [
    {
      "id": "30850",
      "userId": "95112",
      "title": "My React Project",
      "completed": "true"
    }
  ]
}
```

## 5. Create a Todo

**Endpoint:** `POST /todos/create`

**Request:**

| Field     | Type   | Description                                  |
|-----------|--------|----------------------------------------------|
| title     | string | Title of the todo (required)                 |
| completed | string | Completion status of the todo (required)     |
| userId    | string | User ID associated with the todo (required)  |

**Responses:**

| Request Body | Response |
|--------------|----------|
| `{"title": "java Project", "completed": "true"}` | `{"error": "Please provide all the fields."}` |
| `{"title": "java Project", "completed": "true", "userId": "69452"}` | `{"todo": {"id": 62234, "title": "java Project", "completed": "true", "userId": "69452"}}` |

## 6. Update a Todo

**Endpoint:** `PUT /todos/update/:id`

**Request:**

| Field     | Type   | Description                                  |
|-----------|--------|----------------------------------------------|
| title     | string | Title of the todo (required)                 |
| completed | string | Completion status of the todo (required)     |
| userId    | string | User ID associated with the todo (optional)  |

**Responses:**

| Request Body | Response |
|--------------|----------|
| `{"title": "java Project", "completed": "true"}` | `{"error": "Please provide all the fields."}` |
| `{"title": "java Project", "completed": "false", "userId": "69452"}` | `{"todo": {"id": 62234, "title": "java Project", "completed": "false", "userId": "69452"}}` |