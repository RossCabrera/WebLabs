const express = require("express");
const router = express.Router();
const db = require("../config/db");

// HOME PAGE — show start screen
router.get("/", (req, res) => {
  res.render("index");
});

// START QUIZ — pick a random question
router.get("/quiz", async (req, res) => {
  // Score comes from query string e.g. /quiz?score=3
  const score = parseInt(req.query.score) || 0;

  try {
    // Pick one random country with its capital AND flag code
    const result = await db.query(`
        SELECT c.id, c.country, c.capital, f.flag
        FROM capitals c
        JOIN flags f ON f.name = c.country
        ORDER BY RANDOM()
        LIMIT 1
    `);

    // Pick 3 other random wrong capitals
    const question = result.rows[0];
    const wrongAnswers = await db.query(
      `
      SELECT capital FROM capitals
      WHERE id != $1
      ORDER BY RANDOM()
      LIMIT 3
    `,
      [question.id],
    );

    // Combine correct + wrong answers and shuffle them
    const allAnswers = [
      question.capital,
      ...wrongAnswers.rows.map((r) => r.capital),
    ].sort(() => Math.random() - 0.5);

    res.render("quiz", { question, allAnswers, score });
  } catch (err) {
    console.error(err);
    res.send("Database error");
  }
});

// CHECK ANSWER — handle form submission
router.post("/answer", (req, res) => {
  const { answer, correct, score } = req.body;
  const currentScore = parseInt(score) || 0;

  if (answer === correct) {
    // Correct! Go to next question with score +1
    res.redirect(`/quiz?score=${currentScore + 1}`);
  } else {
    // Wrong! Go to game over screen
    res.redirect(
      `/gameover?score=${currentScore}&correct=${encodeURIComponent(correct)}&answer=${encodeURIComponent(answer)}`,
    );
  }
});

// GAME OVER PAGE
router.get("/gameover", (req, res) => {
  const { score, correct, answer } = req.query;
  res.render("gameover", { score, correct, answer });
});

module.exports = router;
