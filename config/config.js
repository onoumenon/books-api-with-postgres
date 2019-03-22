module.exports = {
  development: {
    username: "postgres",
    //INSERT PASSWORD BELOW FOR APP TO WORK
    password: "",
    database: "books-api",
    options: {
      dialect: "postgres"
    }
  },
  test: {
    username: "postgres",
    password: "",
    database: "books-api",
    options: {
      dialect: "sqlite",
      storage: ":memory:",
      logging: false
    }
  },
  production: {
    url: process.env.DATABASE_URL,
    options: {
      dialect: "postgres"
    }
  }
};
