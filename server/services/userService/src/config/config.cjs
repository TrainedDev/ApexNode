const { config } = require("dotenv");

config();

module.exports = {
  "development": {
    use_env_variable: "DB_URL",
    dialect: "postgres",
  }
}