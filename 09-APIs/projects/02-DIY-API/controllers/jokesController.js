import jokes from "../data/jokes.js";


// ==========================
// GET Random Joke
// ==========================
export const getRandomJoke = (req, res) => {
  if (jokes.length === 0) {
    return res.status(404).json({ error: "No jokes available" });
  }

  const randomIndex = Math.floor(Math.random() * jokes.length);
  res.json(jokes[randomIndex]);
};


// ==========================
// GET Joke by ID
// ==========================
export const getJokeById = (req, res) => {
  const jokeId = parseInt(req.params.id);

  if (isNaN(jokeId)) {
    return res.status(400).json({ error: "Invalid joke ID" });
  }

  const joke = jokes.find(j => j.id === jokeId);

  if (!joke) {
    return res.status(404).json({ error: "Joke not found" });
  }

  res.json(joke);
};


// ==========================
// GET All Jokes (Optional Filter)
// ==========================
export const getJokes = (req, res) => {
  const { type } = req.query;

  if (!type) {
    return res.json(jokes);
  }

  const filteredJokes = jokes.filter(
    j => j.jokeType.toLowerCase() === type.toLowerCase()
  );

  if (filteredJokes.length === 0) {
    return res.status(404).json({
      error: "No jokes found for this type",
    });
  }

  res.json(filteredJokes);
};


// ==========================
// POST Create New Joke
// ==========================
export const createJoke = (req, res) => {
  const { jokeText, jokeType } = req.body;

  if (!jokeText || !jokeType) {
    return res.status(400).json({
      error: "jokeText and jokeType are required",
    });
  }

  let newId = 1;

  if (jokes.length > 0) {
    let maxId = jokes[0].id;

    for (let i = 1; i < jokes.length; i++) {
      if (jokes[i].id > maxId) {
        maxId = jokes[i].id;
      }
    }

    newId = maxId + 1;
  }

  const newJoke = {
    id: newId,
    jokeText,
    jokeType,
  };

  jokes.push(newJoke);

  res.status(201).json(newJoke);
};


// ==========================
// PUT Replace Entire Joke
// ==========================
export const replaceJoke = (req, res) => {
  const jokeId = parseInt(req.params.id);
  const { jokeText, jokeType } = req.body;

  if (isNaN(jokeId)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  const joke = jokes.find(j => j.id === jokeId);

  if (!joke) {
    return res.status(404).json({ error: "Joke not found" });
  }

  if (!jokeText || !jokeType) {
    return res.status(400).json({
      error: "jokeText and jokeType are required",
    });
  }

  joke.jokeText = jokeText;
  joke.jokeType = jokeType;

  res.json(joke);
};


// ==========================
// PATCH Update Partially
// ==========================
export const updateJoke = (req, res) => {
  const jokeId = parseInt(req.params.id);

  if (isNaN(jokeId)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  const joke = jokes.find(j => j.id === jokeId);

  if (!joke) {
    return res.status(404).json({ error: "Joke not found" });
  }

  if (req.body.jokeText !== undefined) {
    joke.jokeText = req.body.jokeText;
  }

  if (req.body.jokeType !== undefined) {
    joke.jokeType = req.body.jokeType;
  }

  res.json(joke);
};


// ==========================
// DELETE One Joke
// ==========================
export const deleteJoke = (req, res) => {
  const jokeId = parseInt(req.params.id);

  if (isNaN(jokeId)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  const jokeIndex = jokes.findIndex(j => j.id === jokeId);

  if (jokeIndex === -1) {
    return res.status(404).json({ error: "Joke not found" });
  }

  jokes.splice(jokeIndex, 1);

  res.json({ message: "Joke deleted successfully" });
};


// ==========================
// DELETE All Jokes (Protected)
// ==========================
export const deleteAllJokes = (req, res) => {
  if (req.query.apiKey !== process.env.MASTER_KEY) {
    return res.status(403).json({
      error: "Forbidden: Invalid API key",
    });
  }

  jokes.length = 0;

  res.json({ message: "All jokes deleted" });
};
