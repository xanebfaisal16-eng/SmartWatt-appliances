const PORT = 8080;
const DB_CLOUD_URL = "mongodb+srv://admin:12345@clusterpracticezone.5kget8a.mongodb.net/practicezone";
const DB_LOCAL_URL = 'mongodb://localhost:27017/practicezone';
const JWT_SECRET = "%^@$%#@FDWFGD`jhe";
const JWT_REFRESH_SECRET = "%^@$%#@REFRESH_SECRET_KEY@#$%";  // ADD THIS LINE
const CLIENT_URL = "http://localhost:5173";

export {
    PORT,
    DB_CLOUD_URL,
    DB_LOCAL_URL,
    JWT_SECRET,
    JWT_REFRESH_SECRET,  // ADD THIS LINE
    CLIENT_URL
};