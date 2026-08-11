module.exports = (sq, datatype) => {
  const Profile = sq.define(
    "Profile",
    {
      id: {
        type: datatype.UUID,
        defaultValue: datatype.UUIDV4,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      fullName: {
        type: datatype.STRING,
        allowNull: false,
        validate: {
          is: {
            args: /^[a-z\s]+$/i,
            msg: "required genuine name with no numbers and special character or empty",
          },
          len: {
            args: [4, 20],
            msg: "name length should be between 4 and 20",
          },
        },
      },
      address: {
        type: datatype.TEXT,
        allowNull: false,
        validate: {
          is: {
            args: /^[a-z0-9\s,-]+$/i,
            msg: "special are character not allowed except comma ,space,  hyphen",
          },
        },
      },
      area: {
        type: datatype.STRING,
        allowNull: false,
        validate: {
          is: {
            args: /^[a-z]+$/i,
            msg: "special character and number not allowed",
          },
        },
      },
      city: {
        type: datatype.STRING,
        allowNull: false,
        validate: {
          is: {
            args: /^[a-z]+$/i,
            msg: "special character and number not allowed",
          },
        },
      },
      state: {
        type: datatype.STRING,
        allowNull: false,
        validate: {
          is: {
            args: /^[a-z]+$/i,
            msg: "special character and number not allowed",
          },
        },
      },
      country: {
        type: datatype.STRING,
        allowNull: false,
        validate: {
          is: {
            args: /^[a-z]+$/i,
            msg: "special character and number not allowed",
          },
        },
      },
      phoneNumber: {
        type: datatype.STRING,
        allowNull: false,
        validate: {
          is: {
            // args: /^[\d{10}]$/,
            args: /^\d{10}$/,
            msg: "mobile number is not genuine",
          },
        },
      },
    },

    {
      tableName: "ecommerce_profile",
      defaultScope: {
        attributes: { exclude: ["userId"] },
      },
    },
  );

  Profile.associate = (model) => {
    Profile.belongsTo(model.User, { foreignKey: "userId" });
  };

  return Profile;
};
