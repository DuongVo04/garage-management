import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { sequelize } from "./schemas/index.js"
import { errorHandler } from "./middlewares/error.middleware.js"

import v1Routes from "./routes/v1/index.js"


await sequelize.authenticate();
// await sequelize.sync()
console.log("Database connected");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use("/uploads", express.static("uploads"));
app.listen(3000, () => {
    console.log(`Server running, port${port}`);
})


app.use("/api/v1", v1Routes);


app.use(errorHandler);