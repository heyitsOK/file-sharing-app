const multer = require("multer");
const mongoose = require("mongoose");
require("dotenv").config();
const bcrypt = require("bcrypt");
const File = require("./models/File")

const express = require("express");
const app = express();
app.use(express.urlencoded({extended: true}))

const upload = multer({dest: "uploads"});

mongoose.connect(process.env.DATABASE_URL);

app.set("view engine", "pug");

app.get("/", (req, res) => {
    res.render("index")
});

app.use(express.static('views'));

app.post("/upload", upload.single("file"), async (req, res) => {
    const fileData = {
        path: req.file.path,
        originalName: req.file.originalname,
    }
    if (req.body.password != null && req.body.password !== "") {
        fileData.password = await bcrypt.hash(req.body.password, 10);
    }

    const file = await File.create(fileData);
    res.contentType("Content-Type", "application/json");
    res.send(JSON.stringify({fileLink: `${req.headers.origin}/file/${file.id}`}))
});

app.route("/file/:id").get(handleDownload).post(handleDownload);

/*broken due to change in request object
-- request.body should be empty
-- */
async function handleDownload (req, res) {
    const file = await File.findById(req.params.id);
    if (file.password) {
        if (req.body.password == null) {
            res.render('password');
            return
        }
        
        if (!(await bcrypt.compare(req.body.password, file.password))) {
            res.render("password", {error: true})
            return;
        }
    }

    file.downloadCount++;
    await file.save();
    console.log(file.downloadCount);

    res.download(file.path, file.originalName)
}

app.listen(process.env.PORT);