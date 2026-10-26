const express    = require('express');
const http       = require('http');
const { Server } = require('socket.io');
const path       = require('path');
const app    = express();
const server = http.createServer(app);
const io     = new Server(server);
const mongodb = require('./mongodb');


app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' https://cdnjs.cloudflare.com; " + 
    "style-src 'self' 'unsafe-inline'; " + 
    "connect-src 'self' ws: wss:;" 
  ); 
  next(); 
}); 
 
app.use(express.json());

app.use(express.static(path.join(__dirname, 'ui'))); 

const PORT = process.env.PORT || 8080; 
const usernameRegex = /^\w{5,15}$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

app.post("/api/register", async (req, res) => {
  try {
    const {username, password} = req.body || {};

    if ( typeof username !== "string" || typeof password !== "string" || !usernameRegex.test(username) || !passwordRegex.test(password) ) {
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
    console.error("register error:", err);

    res.status(500).json({
      success: false,
      message: "server error"
    });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const {username, password} = req.body || {};

    if ( typeof username !== "string" || typeof password !== "string" || !usernameRegex.test(username) || !passwordRegex.test(password) ) {
      return res.status(400).json ({
        success: false,
        message: "invalid format"
      });
    }
    
    const user = await mongodb.find(
      username,
      password
    );

    if (!user) {
      return res.status(401).json ({
        success: false,
        message: "invalid username or password"
      });
    }

    res.json({
      success: true,
      message: "succesful login",
      user
    });

  } catch (err) {
    console.error("Login error:", err);

    res.status(500).json({
      success: false,
      message: "server error"
    });
  }
});

(async () => { 
  try { 
    await mongodb.connect(); 
    server.listen(PORT, () => 
      console.log('Server running on port ' + PORT)); 
  } catch (err) { 
    console.log('Error>server.js: failed to start — database connection error', err); 
    process.exit(1); // fail fast — don't run a server that can't authenticate anyone 
  } 
})();