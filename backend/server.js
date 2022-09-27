const express = require("express");
const cors = require("cors");
const app = express();
const nedb = require("nedb-promise");
const bcryptFunction = require("./bcrypt");
const jwt = require("jsonwebtoken");
app.use(
  cors({
    origin: "*",
  })
);

//ger oss mer utrymma i databasen bla.
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
//skapar databas filerna
const accountsDB = new nedb({
  filename: "accounts.db",
  autoload: true,
});
const photoAlbumDB = new nedb({
  filename: "photoAlbum.db",
  autoload: true,
});


//alla endpoints

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
  //om användaren redan finns
  if (findUser.length > 0) {
    resObj.userNameExist = true;
  }

  if (findEmail.length > 0) {
    resObj.userEmailExist = true;
  }
  if (resObj.userEmailExist || resObj.userNameExist) {
    resObj.success = false;
  } else {
    //om användaren inte finns i databasen
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

  if (findAccount.length > 0) {
    const role = findAccount[0].role;

    //här kollar vi om rollerna och hashed password stämmer med som finns i databasen 
    if (role === credentials.role) {
      const samePassword = await bcryptFunction.comparePassword(
        credentials.password,
        findAccount[0].password
      );
      if (samePassword) {
        resObj.user = findAccount[0].username;
        resObj.role = true;
        resObj.success = true;

        //här sätter vi vår token
        const token = jwt.sign({
            username: findAccount[0].username,
          },
          "fiskmås", {
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
    //kollar om token stämmer med det vi skickar in
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
  const resObj={
    success: false
  }

  const findUser = await photoAlbumDB.find({
    username: credentials.username,
  });
  //om user har bilder så updaterar vi DB
  if (findUser.length > 0) {
    const user = findUser[0]._id;

    photoAlbumDB.update({
      _id: user,
    }, {
      $push: {
        img: credentials.img,
      },
    });
    resObj.success = true
  } else {
    //annars om anvädaren inte har bilder så lägger vi till den i DB
    photoAlbumDB.insert(userObj);
    resObj.success = true
  }
  response.json(resObj);
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


  if (findRole.length > 0) {
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

  }


  response.json(resObj);
});

//delete photo
app.delete("/api/deletephoto", async (request, response) => {
  const credentials = request.body;

  resObj = {
    success: false,
  };

  const findRole = await accountsDB.find({
    username: credentials.user,
  });

  if (findRole.length > 0) {
    // om rollen är ADMIN ska den kunna ta bort allas bilder
    if (findRole[0].role === "admin") {
      const user = await photoAlbumDB.find({
        img: credentials.img,
      });
      if (user.length > 0) {
        const userID = user[0]._id;
        photoAlbumDB.update({
          _id: userID,
        }, {
          $pull: {
            img: credentials.img,
          },
        });
        resObj.success = true;
      }
    } else {
      const foundUser = await photoAlbumDB.find({
        username: credentials.user,
      });
      //Om GÄST ska den bara kunna ta bort sina egna bilder!
      if (foundUser.length > 0) {
        const userID = foundUser[0]._id;
        photoAlbumDB.update({
          _id: userID,
        }, {
          $pull: {
            img: credentials.img,
          },
        });

        resObj.success = true;
      } else {
        resObj.success = false;
      }
    }
  }

  response.json(resObj);
});


app.listen(2009, () => {
  console.log("Server listening to port 2009");
});