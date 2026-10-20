
const showRegisterBtn = document.getElementById("showRegisterBtn");
const showLoginBtn = document.getElementById("showLoginBtn");

const loginUI = document.getElementById("loginUI");
const registerUI = document.getElementById("registerUI");

const joinBtn = document.getElementById("joinBtn");
const registerBtn = document.getElementById("registerBtn");

registerUI.style.display = "none";

// Switch to registration
showRegisterBtn.addEventListener("click", function(event) {
    event.preventDefault();

    loginUI.style.display = "none";
    registerUI.style.display = "block";
});

// Switch back to login
showLoginBtn.addEventListener("click", function(event) {
    event.preventDefault();

    registerUI.style.display = "none";
    loginUI.style.display = "block";
});

// Register a new user
registerBtn.addEventListener("click", async function() {
    const username = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;
    const error = document.getElementById("register-error");

    const form = document.getElementById("registerForm");

    if (!form.reportValidity()) return;

    registerBtn.disabled = true;

    try {
        const response = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        const result = await response.json();

        if (!response.ok) {
            error.textContent = result.message;
            return;
        }

        error.textContent = "";

        alert("Account created successfully!");

        form.reset();
        registerUI.style.display = "none";
        loginUI.style.display = "block";

    } catch (err) {
        error.textContent = "Unable to connect to server";
    } finally {
        registerBtn.disabled = false;
    }
});

// Login an existing user
joinBtn.addEventListener("click", async function() {
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;
    const error = document.getElementById("login-error");

    const form = document.getElementById("loginForm");

    if (!form.reportValidity()) return;

    joinBtn.disabled = true;

    try {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        const result = await response.json();

        if (!response.ok) {
            error.textContent = result.message;
            return;
        }

        error.textContent = "";

        await showDashboard(result.user.username);

        // Authentication validated.
        // Add an authenticated session here later.

    } catch (err) {
        error.textContent = "Unable to connect to server";
    } finally {
        joinBtn.disabled = false;
    }
});


const homeUI = document.getElementById("homeUI");
const exerciseGrid = document.getElementById("exerciseGrid");

const exerciseList = [
    { id: "bench-press", name: "Bench Press" },
    { id: "squat", name: "Squat" },
    { id: "deadlift", name: "Deadlift" },
    { id: "shoulder-press", name: "Shoulder Press" },
    { id: "bicep-curl", name: "Bicep Curl" },
    { id: "lat-pulldown", name: "Lat Pulldown" }
];

// Display home page
async function showDashboard(username) {
    loginUI.style.display = "none";
    registerUI.style.display = "none";
    homeUI.style.display = "block";

    document.getElementById("welcomeMessage").textContent =
        "Welcome, " + username;

    createExerciseGrid();
    await loadExercises();
}

// Dynamically create exercise cards
function createExerciseGrid() {
    exerciseGrid.replaceChildren();

    exerciseList.forEach(exercise => {
        const card = document.createElement("div");
        card.className = "exercise-card";

        const title = document.createElement("h3");
        title.textContent = exercise.name;
        card.appendChild(title);

        const fields = {};

        ["weight", "sets", "reps"].forEach(field => {
            const label = document.createElement("label");
            label.textContent =
                field === "weight" ? "Weight (lb)" :
                field === "sets" ? "Sets" : "Reps";

            const input = document.createElement("input");
            input.type = "number";
            input.min = field === "weight" ? "0" : "1";
            input.max = field === "weight" ? "2000" :
                field === "sets" ? "100" : "1000";
            input.step = field === "weight" ? "any" : "1";
            input.required = true;

            input.id = `${exercise.id}-${field}`;

            fields[field] = input;

            label.appendChild(input);
            card.appendChild(label);
        });

        const button = document.createElement("button");
        button.textContent = "Save Exercise";

        const status = document.createElement("p");
        status.className = "save-status";
        status.setAttribute("role", "status");

        button.addEventListener("click", async () => {
            if (!Object.values(fields).every(input =>
                input.reportValidity()
            )) return;

            button.disabled = true;
            status.textContent = "Saving...";

            try {
                const response = await fetch(
                    `/api/exercises/${exercise.id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            weight: Number(fields.weight.value),
                            sets: Number(fields.sets.value),
                            reps: Number(fields.reps.value)
                        })
                    }
                );

                if (!response.ok) {
                    throw new Error("Save failed");
                }

                status.textContent = "Exercise saved!";
            } catch (err) {
                status.textContent = "Unable to save exercise";
            } finally {
                button.disabled = false;
            }
        });

        card.appendChild(button);
        card.appendChild(status);
        exerciseGrid.appendChild(card);
    });
}

// Load user's previously saved exercise data
async function loadExercises() {
    try {
        const response = await fetch("/api/exercises");

        if (!response.ok) {
            throw new Error("Unable to retrieve exercises");
        }

        const savedExercises = await response.json();

        savedExercises.forEach(exercise => {
            ["weight", "sets", "reps"].forEach(field => {
                const input = document.getElementById(
                    `${exercise.exerciseId}-${field}`
                );

                if (input) {
                    input.value = exercise[field];
                }
            });
        });
    } catch (err) {
        console.error("Error loading exercises:", err);
    }
}

// Restore dashboard if user is already logged in
async function restoreSession() {
    try {
        const response = await fetch("/api/me");

        if (response.ok) {
            const user = await response.json();
            await showDashboard(user.username);
        }
    } catch (err) {
        console.error("Session check failed:", err);
    }
}

restoreSession();

