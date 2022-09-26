const express = require("express");
const cors = require("cors");
const app = express();
const nedb = require("nedb-promise");
const bcryptFunction = require("./bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
app.use(
  cors({
    origin: "*",
  })
);
// hejhejhejhej
// app.use(express.json());

// app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
// app.use(bodyParser.text({
//   limit: '200mb',
//   extended: true

// }));
app.use(
  express.json({
    limit: "50mb",
    extended: true,
  })
);
app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
  })
);

const accountsDB = new nedb({
  filename: "accounts.db",
  autoload: true,
});
const photoAlbumDB = new nedb({
  filename: "photoAlbum.db",
  autoload: true,
});

//sign up
app.post("/api/signup", async (request, response) => {
  const credentials = request.body;

  const resObj = {
    success: true,
    userNameExist: false,
    userEmailExist: false,
  };

  const findUser = await accountsDB.find({
    username: credentials.username,
  });
  const findEmail = await accountsDB.find({
    email: credentials.email,
  });

  if (findUser.length > 0) {
    resObj.userNameExist = true;
  }

  if (findEmail.length > 0) {
    resObj.userEmailExist = true;
  }
  if (resObj.userEmailExist || resObj.userNameExist) {
    resObj.success = false;
  } else {
    resObj.success = true;
    const hashPass = await bcryptFunction.hashPassword(credentials.password);
    credentials.password = hashPass;
    accountsDB.insert(credentials);
  }
  response.json(resObj);
});

//login
app.post("/api/login", async (request, response) => {
  const credentials = request.body;
  const resObj = {
    success: false,
    role: false,
    user: "",
    token: "",
  };
  const findAccount = await accountsDB.find({
    username: credentials.username,
  });

  const findRole = await accountsDB.find({ role: credentials.role });
  const role = findRole[0].role;

  if (findAccount.length > 0) {
    if (role === credentials.role) {
      const samePassword = await bcryptFunction.comparePassword(
        credentials.password,
        findAccount[0].password
      );
      if (samePassword) {
        resObj.user = findAccount[0].username;
        resObj.role = true;
        resObj.success = true;

        const token = jwt.sign(
          {
            username: findAccount[0].username,
          },
          "fiskmås",
          {
            expiresIn: 600,
          }
        );
        resObj.token = token;
      }
    }
  }
  response.json(resObj);
});

// is loggedin
app.get("/api/loggedin", async (request, response) => {
  const resObj = {
    loggedIn: false,
    errorMessage: "",
  };

  const token = request.headers.authorization.replace("Bearer ", "");

  try {
    const data = jwt.verify(token, "fiskmås");

    if (data) {
      resObj.loggedIn = true;
    }
  } catch (err) {
    resObj.errorMessage = "Token expired";
  }
  response.json(resObj);
});

//add photo
app.post("/api/addPhoto", async (request, response) => {
  const credentials = request.body;
  const userObj = {
    username: credentials.username,
    img: [credentials.img],
  };

  const findUser = await photoAlbumDB.find({
    username: credentials.username,
  });
  //om user har bilder
  if (findUser.length > 0) {
    const user = findUser[0]._id;

    photoAlbumDB.update(
      {
        _id: user,
      },
      {
        $push: {
          img: credentials.img,
        },
      }
    );
  } else {
    photoAlbumDB.insert(userObj);
  }
  response.json(userObj);
});

// get album guest
app.post("/api/getalbum", async (request, response) => {
  const credentials = request.body;

  const resObj = {
    success: false,
    allImages: [],
  };

  const findRole = await accountsDB.find({
    username: credentials.username,
  });
  let getAllImages = [];

  // Om role är ADMIN
  if (findRole[0].role === "admin") {
    // hämta bilder från alla users
    const allUsers = await photoAlbumDB.find({});
    allUsers.forEach((user) => {
      const imgs = user.img;
      imgs.forEach((img) => {
        getAllImages.push(img);
      });
    });
    resObj.success = true;
    resObj.allImages = getAllImages;
  }
  // Om role är GUEST
  if (findRole[0].role === "guest") {
    const findUser = await photoAlbumDB.find({
      username: credentials.username,
    });
    if (findUser.length > 0) {
      const userImages = findUser[0].img;
      resObj.allImages = userImages;
      resObj.success = true;
    } else {
      alert("No pictures in PhotoAlbum, take a picture plsss");
    }
  }
  response.json(resObj);
});

//delete photo
app.delete("/api/deletephoto", async (request, response) => {
  const credentials = request.body;

  resObj = {
    success: false,
    // user: {},
  };

  const findRole = await accountsDB.find({
    username: credentials.user,
  });
  if (findRole.length > 0) {
    if (findRole[0].role === "admin") {
      const user = await photoAlbumDB.find({ img: credentials.img });
      if (user.length > 0) {
        const userID = user[0]._id;
        photoAlbumDB.update(
          { _id: userID },
          { $pull: { img: credentials.img } }
        );
        resObj.success = true;
      }
    } else {
      const foundUser = await photoAlbumDB.find({
        username: credentials.user,
      });

      if (foundUser.length > 0) {
        const userID = foundUser[0]._id;
        photoAlbumDB.update(
          {
            _id: userID,
          },
          {
            $pull: {
              img: credentials.img,
            },
          }
        );

        resObj.success = true;
      } else {
        resObj.success = false;
      }
    }
  }

  // const updatedUser = await photoAlbumDB.find({
  //   username: credentials.user,
  // });
  // console.log(updatedUser);
  // resObj.user = updatedUser;
  response.json(resObj);
});

//log out

app.listen(2009, () => {
  console.log("Server listening to port 2009");
});
