import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import globalErrorHandler from "./src/utils/errorHandler.js";
// import config from "./src/config/index.js";
// import session from "express-session";
// import passport from "passport";

import authRouter from "./src/routers/auths.js";
// import { passportSetup } from "./src/config/passport.js";
import userRouter from "./src/routers/usersrouters.js";
// import passportRouter from "./src/routers/passportRoutes.js";
import session from "express-session";
import passport from "passport";
import productRouter from "./src/routers/product.js";
import cartRouter from "./src/routers/cart.js";
import jobRouter from "./src/routers/job.js";
import adminRouter from "./src/routers/admin.js";
import ratingRouter from "./src/routers/rating.js";
import passportRouter from "./src/routers/passportRoutes.js";
// import globalErrorHandler from "./src/utils/errorHandler.js";
import config from "./src/config/index.js";
import lawyerRouter from "./src/routers/lawyer.js";

dotenv.config({ path: "./configenv.env" });
// passportSetup("company" || "lawyer" || "admin");

const mongoURI = config.MONGODB_CONNECTION_URL;

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Database connection is established"))
  .catch((err) => console.log(err.message));
const port = config.PORT;

const app = express();

// Middleware
app.use(cookieParser());
app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/", authRouter);
app.use("/", productRouter);
app.use("/", cartRouter);
app.use("/", jobRouter);
app.use("/", adminRouter);
app.use("/", ratingRouter);
app.use("/", lawyerRouter);

app.use(
  cors({
    origin: ["http://localhost:5005", "http://localhost:3000"], // Add your second origin here
  })
);

// app.use(
//   cors({
//     ["http://localhost:5005", "http://example.com"],
//     // origin: "http://localhost:5005",
//   })
// );

app.use(
  session({
    secret: process.env.COOKIE_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api", authRouter);
app.use("/api", userRouter);
// app.use(passportRouter);

app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
