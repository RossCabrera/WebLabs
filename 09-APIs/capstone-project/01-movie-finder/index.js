import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

const API_KEY = process.env.API_KEY;
const BASE_URL = process.env.BASE_URL;

// ── Middleware ────────────────────────────────
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────

// Home page
app.get("/", (req, res) => {
  res.render("home", { title: "Movie Finder" });
});

// Search results (with pagination)
app.get("/search", async (req, res) => {
  const query = req.query.q;
  const page  = parseInt(req.query.page) || 1; // current page, default 1

  if (!query || query.trim() === "") {
    return res.redirect("/");
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        apikey: API_KEY,
        s:      query,
        type:   "movie",
        page,          
      },
    });

    const data = response.data;

    // ── Handle errors ─────────────────────────────────────
    if (data.Response === "False") {
      const isTooMany = data.Error && data.Error.toLowerCase().includes("too many");

      // FALLBACK: if too many results, 
      if (isTooMany) {
        try {
          const exactRes = await axios.get(BASE_URL, {
            params: { apikey: API_KEY, t: query, plot: "full" },
          });
          if (exactRes.data.Response === "True") {
            // Exact match found — redirect to movie detail page
            return res.redirect(`/movie/${exactRes.data.imdbID}`);
          }
        } catch (_) { /* fall through */ }

        // Exact fallback also failed 
        return res.render("error", {
          title:   "Too many results",
          message: `"${query}" matches too many titles. Try adding a year or more words from the full title.`,
          query,
          tooMany: true,
        });
      }

      return res.render("error", {
        title:   "No Results",
        message: data.Error || "No movies found for that title.",
        query,
        tooMany: false,
        suggestions: [],
      });
    }

    // ── Pagination math ────────────────────────────────────────
    const totalResults = parseInt(data.totalResults) || 0;
    const totalPages   = Math.ceil(totalResults / 10);

    res.render("results", {
      title: `Results for "${query}"`,
      movies:       data.Search,
      totalResults,
      totalPages,
      currentPage:  page,
      query,
    });

  } catch (err) {
    console.error("Search error:", err.message);
    res.render("error", {
      title:   "Server Error",
      message: "Something went wrong. Please try again.",
      query,
      tooMany: false,
    });
  }
});

// Movie detail page
app.get("/movie/:id", async (req, res) => {
  const imdbID = req.params.id;

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        apikey: API_KEY,
        i: imdbID,       // 'i' param = fetch by IMDb ID
        plot: "full",
      },
    });

    const movie = response.data;

    if (movie.Response === "False") {
      return res.render("error", {
        title: "Movie Not Found",
        message: "We couldn't find that movie.",
        query: "",
      });
    }

    // Parse genres into array for tag display
    movie.GenreArray = movie.Genre !== "N/A"
      ? movie.Genre.split(", ")
      : [];

    // Parse ratings
    movie.ImdbRating = movie.imdbRating !== "N/A" ? movie.imdbRating : null;

    res.render("movie", {
      title: movie.Title,
      movie,
    });
  } catch (err) {
    console.error("Movie detail error:", err.message);
    res.render("error", {
      title: "Server Error",
      message: "Something went wrong fetching movie details.",
      query: "",
    });
  }
});

// 404 catch-all
app.use((req, res) => {
  res.status(404).render("error", {
    title: "404 - Page Not Found",
    message: "This page doesn't exist.",
    query: "",
  });
});

// ── Start Server ──────────────────────────────
app.listen(PORT, () => {
  console.log(`🎬 Movie Finder running at http://localhost:${PORT}`);
});