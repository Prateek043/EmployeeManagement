const express=require('express')
const dotenv =require( "dotenv");
const cors =require( "cors");
const bodyParser =require( "body-parser");
const cookieParser=require("cookie-parser")
//securty packges
const helmet =require( "helmet");
const dbConnection =require( "./dbConfig/connection");
const adminAuthRoute=require("./routes/adminRoute")
//Here we can store our secret file
dotenv.config();

//instance if express
const app = express();

//public Files
app.use(express.static(__dirname + '/public'));

const PORT = process.env.PORT || 8800;

//connect to database
dbConnection();

app.use(helmet());
const allowedOrigins = ["http://localhost:5173"];
app.use(cors({ origin: allowedOrigins, methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello from the Backend Server")
});

app.use("/api/v1/auth",adminAuthRoute);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
