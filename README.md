# TMDB RESTful API with NestJS

**REST API** using **NestJS**, **MongoDB**, and **The Movie Database (TMDB)** API.

---

## Features
- Fetch movies from TMDB and store in MongoDB  
- List movies with genre-based filtering  
- User rating system  
- Authentication (JWT) for secure API access  
- Logging using `LoggerService` (Local + Rollbar)  
- Error handling using global exception filters
- Dockerized for easy deployment  

---

## Tech Stack
- Node.js & NestJS (REST API Framework)  
- MongoDB & Mongoose (Database)  
- TMDB API (Movie Data)  
- JWT Authentication (Security)  
- Logging (`@nestjs/common` Logger + Rollbar)  
- Docker (Containerization)  

---

## Setup & Installation

### Clone the Repository
```sh
git clone https://github.com/manojsethi/tmdb-assignment.git
```

### Install Dependencies
```sh
pnpm install
```

## Docker Setup

---

## Environment Variables

Set the following environment variables before running the container:

| Variable              | Description                      |
|----------------------|--------------------------------|
| `TMDB_MONGO_URI`    | MongoDB connection URI        |
| `TMDB_PORT`         | Application port (default: 9000) |
| `TMDB_API_KEY`      | External API Key |
| `TMDB_JWT_SECRET_KEY` | JWT Secret Key for authentication |
| `TMDB_LOGGER_ROLLBAR_POST_SERVER_TOKEN` | Rollbar Key for Logger |


---

## Build & Run Instructions

### 1. Build the Docker Image
Run the following command to build the Docker image:

```sh
docker build -t my-nest-app .
```

### 2. Run the Container
Use the following command to start a container with the necessary environment variables:

```sh
docker run -d -p 9000:9000 \
  -e TMDB_MONGO_URI="your_mongodb_uri" \
  -e TMDB_API_KEY="your_api_key" \
  -e TMDB_JWT_SECRET_KEY="your_secret_key" \
  -e TMDB_LOGGER_ROLLBAR_POST_SERVER_TOKEN="your_rollbar_key" \
  --name my-nest-container my-nest-app
```

---

## Notes
- Ensure that your MongoDB URI is accessible.  
- The default port is 9000, but you can modify it as needed.  
- Update the TMDB_API_KEY with a valid key.

---

## API Endpoints

### Authentication
| Method  | Endpoint        | Description          | Auth Required |
|---------|---------------|----------------------|--------------|
| POST    | `/auth/signup`  | Register a new user  | No |
| POST    | `/auth/signin`  | Authenticate & get JWT | No |

#### Sign Up
**Request:**  
```json
{
  "email": "testUser@yopmail.com",
  "password": "Welcome12@#"
}
```

**Response:**  
```json
{
    "status": 201,
    "message": "User created!"
}
```

#### Sign In
**Request:**  
```json
{
  "email": "testUser@yopmail.com",
  "password": "Welcome12@#"
}
```

**Response:**  
```json
{
  "status": 200,
  "data": { 
      "accessToken": "your-jwt-token",
      "email": "your-email" 
   }
}
```

---

### Movies
| Method  | Endpoint                  | Description                      | Auth Required |
|---------|--------------------------|----------------------------------|--------------|
| GET     | `/movies?page=1&limit=10` | List all movies (paginated)      | Yes |
| GET     | `/movies/search?searchText=Mickey` | Search movies by title or overview | Yes |
| GET     | `/movies/filter?genre=Action&genre=Action` | Filter movies by genre | Yes |
| POST    | `/movies/rating`         | Rate a movie                     | Yes |

#### List Movies
**Request:**  
```http
GET /movies?page=1&limit=20
Authorization: Bearer your-jwt-token
```

**Response:**  
```json
{
    "status": 200,
    "data": [
        {
            "_id": "67d90bf278dd09061d02f330",
            "movieId": 1361451,
            "__v": 0,
            "genre": [
                "Drama",
                "Crime"
            ],
            "overview": "Miquel moves to a town in the Spanish countryside. He is there to work in an industrial mill, ran by siblings María and Ángel. María, who dislikes her work and the neighbours she has to do business with, finds in Miquel a person similar to her.",
            "posterPath": "https://api.themoviedb.org/3/edKpE9B5qN3e559OuMCLZdW1iBZ.jpg",
            "rating": 0,
            "releaseDate": "2025-03-17",
            "title": "La terra negra"
        }}
```

#### Search Movies
**Request:**  
```http
GET /movies/search?searchText=Mickey
Authorization: Bearer your-jwt-token
```

**Response:**  
```json
{
    "status": 200,
    "data": [
        {
            "_id": "67d90bf278dd09061d02f31f",
            "movieId": 696506,
            "__v": 0,
            "genre": [
                "Science Fiction",
                "Comedy",
                "Adventure"
            ],
            "overview": "Unlikely hero Mickey Barnes finds himself in the extraordinary circumstance of working for an employer who demands the ultimate commitment to the job… to die, for a living.",
            "posterPath": "https://api.themoviedb.org/3/edKpE9B5qN3e559OuMCLZdW1iBZ.jpg",
            "rating": 0,
            "releaseDate": "2025-02-28",
            "title": "Mickey 17"
        }
      ]
}
```

#### Filter Movies by Genre
**Request:**  
```http
GET /movies/filter?genre=Action
Authorization: Bearer your-jwt-token
```

**Response:**  
```json
{
    "status": 200,
    "data": [
        {
            "_id": "67d95c2078dd09061d02f6ea",
            "movieId": 696506,
            "__v": 0,
            "genre": [
                "Science Fiction",
                "Comedy",
                "Adventure"
            ],
            "overview": "Unlikely hero Mickey Barnes finds himself in the extraordinary circumstance of working for an employer who demands the ultimate commitment to the job… to die, for a living.",
            "posterPath": "https://api.themoviedb.org/3/edKpE9B5qN3e559OuMCLZdW1iBZ.jpg",
            "rating": 0,
            "releaseDate": "2025-02-28",
            "title": "Mickey 17"
        }
    ]
}
```

#### Rate a Movie
**Request:**  
```http
POST /movies/rating
Authorization: Bearer your-jwt-token
Content-Type: application/json
```

**Body:**  
```json
{
  "movieId": "67d90bf278dd09061d02f327",
  "rating": 4
}
```

**Response:**  
```json
{
  "status": 201,
  "message": "Rating added!"
}
```

---

## Authentication Usage
- After signing in, copy the JWT token and include it in the `Authorization` header for all protected routes:
```
Authorization: Bearer your-jwt-token
```
