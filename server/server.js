const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const movieModel = require('./movie-model.js');

const app = express();

// Parse urlencoded bodies
app.use(bodyParser.json()); 

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, 'files')));

// Task 1.2: GET /genres — returns sorted array of unique genres from all movies
app.get('/genres', function (req, res) {
  const allMovies = Object.values(movieModel);
  const genreSet = new Set();

  for (const movie of allMovies) {
    for (const genre of movie.Genres) {
      genreSet.add(genre);
    }
  }

  const sortedGenres = Array.from(genreSet).sort();
  res.send(sortedGenres);
});

// Task 2.2: GET /movies — returns all movies, or filtered by genre query parameter
app.get('/movies', function (req, res) {
  let movies = Object.values(movieModel);

  const genre = req.query.genre;
  if (genre) {
    movies = movies.filter(movie => movie.Genres.includes(genre));
  }

  res.send(movies);
});

// Configure a 'get' endpoint for a specific movie
app.get('/movies/:imdbID', function (req, res) {
  const id = req.params.imdbID;
  const exists = id in movieModel;
 
  if (exists) {
    res.send(movieModel[id]);
  } else {
    res.sendStatus(404);
  }
});

app.put('/movies/:imdbID', function(req, res) {
  const id = req.params.imdbID;
  const exists = id in movieModel;

  movieModel[req.params.imdbID] = req.body;
  
  if (!exists) {
    res.status(201);
    res.send(req.body);
  } else {
    res.sendStatus(200);
  }
});

app.listen(3000);

console.log("Server now listening on http://localhost:3000/");
