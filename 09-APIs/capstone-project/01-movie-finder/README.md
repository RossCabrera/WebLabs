# 🎬 Capstone Project 4: Movie Finder Web Application

## 📌 1. Project  Overview

The objective of this project is to develop a **Movie Finder Web
Application** using **Node.js**, **Express.js**, and **EJS**, integrated
with the OMDb API.

The application must allow users to search for movies, browse results
with pagination, and access detailed information about each selected
movie.

------------------------------------------------------------------------

## 📋 2. Functional Requirements

### 2.1 Movie Search

The system shall:

- Allow users to search for movies by title.
- Send HTTP requests to the OMDb API using Axios.
- Display search results dynamically.
- Show up to 10 movies per results page.

------------------------------------------------------------------------

### 2.2 Pagination

The system shall:

- Display the total number of results returned by the API.
- Calculate the total number of pages based on API results.
- Allow users to navigate between pages.
- Maintain the search query while navigating between pages.

------------------------------------------------------------------------

### 2.3 Movie Details Page

The system shall provide a dynamic route:

/movie/:imdbID

When a user selects a movie, the application must display a detailed
view including:

- Poster
- Title
- Year
- Runtime
- Rated classification
- Country
- Genre (displayed as styled tags)
- IMDb rating
- Rotten Tomatoes rating
- Metacritic score
- Full plot
- Director
- Writers
- Cast (styled as pills)
- Language
- Box Office

If poster data is unavailable (`N/A`), a placeholder must be displayed.

------------------------------------------------------------------------

### 2.4 Error Handling

The system shall:

- Handle cases where no results are found.
- Handle "Too many results" API responses.
- Display a user-friendly error page.
- Log server errors to the console.
- Prevent application crashes due to invalid API responses.

------------------------------------------------------------------------

## 🏗 3. Non-Functional Requirements

The application must:

- Use server-side rendering with EJS.
- Use partial templates (header, footer, navbar).
- Store API keys securely using environment variables (`dotenv`).
- Not use a database (data must come exclusively from OMDb API).
- Maintain a clear and organized folder structure.

------------------------------------------------------------------------

## 📂 4. Project Structure Requirement

    movie-finder/
    │
    ├── public/
    │   ├── css/
    │   └── images/
    │
    ├── views/
    │   ├── partials/
    │   │    ├── header.ejs
    │   │    ├── footer.ejs
    │   │    └── navbar.ejs
    │   │
    │   ├── home.ejs
    │   ├── results.ejs
    │   ├── movie.ejs
    │   └── error.ejs
    │
    ├── index.js
    ├── .env
    ├── package.json
    └── README.md

------------------------------------------------------------------------

## 🛠 5. Technical Requirements

The application must be developed using:

- Node.js\
- Express.js\
- Axios\
- EJS\
- CSS\
- OMDb API\
- dotenv

------------------------------------------------------------------------

## 🎯 6. Learning Objectives

By completing this project, students must demonstrate the ability to:

- Integrate and consume a third-party REST API.
- Handle query parameters in Express.
- Implement dynamic routing (`/movie/:id`).
- Process and render external JSON data.
- Implement pagination logic.
- Manage environment variables securely.
- Structure a scalable Express application.
