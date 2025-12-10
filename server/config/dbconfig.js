import mongoose from "mongoose"
import { DB_CLOUD_URL, DB_LOCAL_URL } from "./config.js";

const dbConfig = () => {
    mongoose.connect(DB_CLOUD_URL)
        .then(  conn => console.log(`😃 DB'${conn.connection.host}' is connected with express`))
        .catch(err => console.log(`😮DB connection failed! b/c ${err.message} `))
}

export default dbConfig;