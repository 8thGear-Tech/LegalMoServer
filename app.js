import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import globalErrorHandler from "./src/utils/errorHandler.js";
import config from "./src/config/index.js";
import authRouter from "./src/routers/auths.js";
import productRouter from "./src/routers/product.js";
import cartRouter from "./src/routers/cart.js"
import jobRouter from "./src/routers/job.js"

dotenv.config({ path: "./configenv.env" });

const mongoURI = config.MONGODB_CONNECTION_URL;

mongoose
  .connect('mongodb+srv://legalmo:kQvhWA0S69hkOXTY@legalmo.n5ltuv1.mongodb.net/legalmodb?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Database connection is established"))
  .catch((err) => console.log(err.message));
const port = config.PORT;
const app = express();


// Middleware
app.use(morgan("tiny"));
app.use(express.urlencoded({extended: false}))
app.use(express.json());
app.use(cors());

 app.use('/', authRouter);
 app.use('/', productRouter);
 app.use('/', cartRouter)
 app.use('/', jobRouter)


app.use(
  cors({
    origin: "http://localhost:5005",
  })
);

// error handler
app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
