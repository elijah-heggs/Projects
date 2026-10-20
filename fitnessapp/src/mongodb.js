
const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");

require("dotenv").config();

const uri = process.env.MONGODB_URI;

if (!uri) {
    throw new Error("MONGODB_URI environment variable is not defined");
}

const client = new MongoClient(uri);

let users;
let exercises;

async function connect() {
    await client.connect();

    const database = client.db("fitnessapp");

    users = database.collection("users");
    await users.createIndex({ username: 1 }, { unique: true });

    exercises = database.collection("exercises");
    await exercises.createIndex({ userId: 1, exerciseId: 1 }, { unique: true });

    console.log("Connected to MongoDB");
}

async function getExercises(userId) {
    return await exercises.find({ userId }).toArray();
}

// Save or update a single exercise
async function saveExercise(userId, exerciseId, weight, sets, reps) {
    return await exercises.updateOne(
        { userId, exerciseId },
        {
            $set: {
                weight,
                sets,
                reps,
                updatedAt: new Date()
            }
        },
        { upsert: true }
    );
}

async function register(username, password) {
    const existingUser = await users.findOne({ username });

    if (existingUser) {
        return {
            success: false,
            message: "Username already exists"
        };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    try {
        await users.insertOne({
            username: username,
            password: hashedPassword,
            createdAt: new Date()
        });
    } catch (err) {
        if (err.code === 11000) {
            return {
                success: false,
                message: "Username already exists"
            };
        }
        throw err;
    }

    return {
        success: true,
        message: "Account created successfully"
    };
}

async function find(username, password) {
    const user = await users.findOne({ username });

    if (!user) {
        return null;
    }

    const validPassword = await bcrypt.compare(
        password,
        user.password
    );

    if (!validPassword) {
        return null;
    }

    return {
        id: user._id.toString(),
        username: user.username
    };
}

module.exports = {
    connect,
    register,
    find,
    getExercises,
    saveExercise
};
