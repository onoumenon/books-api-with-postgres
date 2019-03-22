module.exports = (sequelize, type) => {
  const Book = sequelize.define(
    "book",
    {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: type.STRING(80)
    },
    { timestamps: false }
  );

  Book.associate = models => {
    Book.belongsTo(models.Author);
  };

  return Book;
};
