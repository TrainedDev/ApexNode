const bcrypt = require("bcrypt");

module.exports = (sq, datatype) => {
  const User = sq.define(
    "User",
    {
      id: {
        type: datatype.UUID,
        primaryKey: true,
        unique: true,
        defaultValue: datatype.UUIDV4,
        allowNull: false,
      },
      username: {
        type: datatype.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [4, 10],
            msg: "username character length should be between 4 and 10",
          },
          isAlpha: {
            msg: "required genuine name with no numbers and special character or empty",
          },
        },
      },
      email: {
        type: datatype.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: "incorrect email",
          },
        },
      },
      password: {
        type: datatype.STRING,
        allowNull: false,
        validate: {
          min: {
            args: [6],
            msg: "password size should be equal or greater than 6",
          },
        },
      },
      role: {
        type: datatype.ENUM("customer", "admin"),
        allowNull: false,
        defaultValue: "customer",
      },
    },
    {
      timestamps: true,
      indexes: [{ fields: ["email"] }],
      tableName: "ecommerce_users",
      defaultScope: {
        attributes: { exclude: ["password"] },
      },
      hooks: {
        beforeSave: async (user) => {
          if (user.changed("password")) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
      },
    },
  );

  User.associate = (model) => {
    User.hasOne(model.Profile, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
  };

  return User;
};
