const app = require("./app");
const { sequelize } = require("./Models");
const createAuthorsAndBooks = require("./seed");

const port = process.env.PORT || 5555;

//Wrap sequelize sync around the app.listen (force: true drops the tables if exists, so only use in dev )
sequelize.sync({ force: true }).then(() => {
  createAuthorsAndBooks();
  app.listen(port, () => {
    if (process.env.NODE_ENV === "production") {
      console.log(`Server is running on Heroku with port number ${port}`);
    } else {
      console.log(`Server is running on http://localhost:${port}`);
    }
  });
});
