const showRegisterBtn = document.getElementById("showRegisterBtn");
const showLoginBtn = document.getElementById("showLoginBtn");

const loginUI = document.getElementById("loginUI");
const registerUI = document.getElementById("registerUI");

const joinBtn = document.getElementById("joinBtn");
const registerBtn = document.getElementById("registerBtn");

registerUI.style.display = "none";

showRegisterBtn.addEventListener("click", function(event) {
    event.preventDefault();

    loginUI.style.display = "none";
    registerUI.style.display = "block";
});

showLoginBtn.addEventListener("click", function(event) {
    event.preventDefault();

    loginUI.style.display = "block";
    registerUI.style.display = "none";
})

registerBtn.addEventListener("click", async function() {
    const username = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;
    const error = document.getElementById("register-error");

    const form = document.getElementById("registerForm");

    const usernameInput = document.getElementById("registerUsername");
    const passwordInput = document.getElementById("registerPassword");

    console.log("Username:", usernameInput.value);
    console.log("Username valid:", usernameInput.checkValidity());
    console.log("Username error:", usernameInput.validationMessage);

    console.log("Password valid:", passwordInput.checkValidity());
    console.log("Password error:", passwordInput.validationMessage);

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

        alert("Account created succesffuly");

        form.reset();
        registerUI.style.display = "none";
        loginUI.style.display = "block";

    } catch (err) {
        error.textContent = "unable to connect to server";
    } finally {
        registerBtn.disabled = false;
    }
});

joinBtn.addEventListener("click", async function() {
     const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;
    const error = document.getElementById("login-error");

    const form = document.getElementById("LoginForm");

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

        alert("Welcome " + result.user.username);



     } catch (err) {
        error.textContent = "unable to connect to server";
     } finally {
        joinBtn.disabled = false;
     }
});