
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const mongodb = require("./mongodb");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());

app.use(session({
    name: "fitness.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        dbName: "fitnessapp"
    }),
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));

// Security headers
app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; " +
        "script-src 'self' https://cdnjs.cloudflare.com; " +
        "style-src 'self' 'unsafe-inline'; " +
        "connect-src 'self' ws: wss:;"
    );
    next();
});

app.use(express.static(path.join(__dirname, "ui")));

const PORT = process.env.PORT || 8080;

const usernameRegex = /^\w{5,15}$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

// Register a new user
app.post("/api/register", async (req, res) => {
    try {
        const { username, password } = req.body || {};

        if (
            typeof username !== "string" ||
            typeof password !== "string" ||
            !usernameRegex.test(username) ||
            !passwordRegex.test(password)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid username or password format"
            });
        }

        const result = await mongodb.register(
            username,
            password
        );

        res.status(result.success ? 201 : 409).json(result);

    } catch (err) {
        console.error("Registration error:", err);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

// Authenticate an existing user
app.post("/api/login", async (req, res) => {
    try {
        const { username, password } = req.body || {};

        if (
            typeof username !== "string" ||
            typeof password !== "string" ||
            !usernameRegex.test(username) ||
            !passwordRegex.test(password)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid username or password format"
            });
        }

        const user = await mongodb.find(
            username,
            password
        );

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        req.session.regenerate((err) => {
    if (err) {
        return res.status(500).json({
            success: false,
            message: "Unable to establish session"
        });
    }

    req.session.userId = user.id;
    req.session.username = user.username;

    req.session.save((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to save session"
            });
        }

        res.json({
            success: true,
            message: "Login successful",
            user
        });
    });
});

    } catch (err) {
        console.error("Login error:", err);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});



const EXERCISE_IDS = new Set([
    "bench-press",
    "squat",
    "deadlift",
    "shoulder-press",
    "bicep-curl",
    "lat-pulldown"
]);

// Middleware to protect routes
function requireAuth(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({
            success: false,
            message: "Please log in first"
        });
    }

    next();
}

// Retrieve saved exercises for logged-in user
app.get("/api/exercises", requireAuth, async (req, res) => {
    try {
        const exercises = await mongodb.getExercises(
            req.session.userId
        );

        res.json(exercises.map(exercise => ({
            exerciseId: exercise.exerciseId,
            weight: exercise.weight,
            sets: exercise.sets,
            reps: exercise.reps
        })));
    } catch (err) {
        console.error("Error loading exercises:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Save a user's exercise
app.put("/api/exercises/:exerciseId", requireAuth, async (req, res) => {
    try {
        const { exerciseId } = req.params;
        const { weight, sets, reps } = req.body || {};

        if (!EXERCISE_IDS.has(exerciseId)) {
            return res.status(400).json({
                message: "Invalid exercise"
            });
        }

        if (
            typeof weight !== "number" ||
            !Number.isFinite(weight) ||
            weight < 0 ||
            weight > 2000 ||
            !Number.isInteger(sets) ||
            sets < 1 || sets > 100 ||
            !Number.isInteger(reps) ||
            reps < 1 || reps > 1000
        ) {
            return res.status(400).json({
                message: "Invalid weight, sets, or reps"
            });
        }

        await mongodb.saveExercise(
            req.session.userId,
            exerciseId,
            weight,
            sets,
            reps
        );

        res.json({
            success: true,
            message: "Exercise saved"
        });

    } catch (err) {
        console.error("Error saving exercise:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Check current login status
app.get("/api/me", requireAuth, (req, res) => {
    res.json({
        id: req.session.userId,
        username: req.session.username
    });
});


// Connect before starting the server
(async () => {
    try {
        await mongodb.connect();

        server.listen(PORT, () => {
            console.log("Server running on port " + PORT);
        });

    } catch (err) {
        console.error(
            "Error>server.js: failed to start",
            err
        );

        process.exit(1);
    }
})();
