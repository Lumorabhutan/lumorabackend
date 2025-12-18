// require('dotenv').config();

// module.exports = {
//   development: {
//     username: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     host: process.env.DB_HOST,
//     port: Number(process.env.DB_PORT),
//     dialect: process.env.DB_DIALECT,
//   },

//   test: {
//     username: process.env.DB_TEST_USERNAME,
//     password: process.env.DB_TEST_PASSWORD,
//     database: process.env.DB_TEST_NAME,
//     host: process.env.DB_TEST_HOST,
//     dialect: process.env.DB_DIALECT,
//   },

//   production: {
//     username: process.env.DB_PROD_USERNAME,
//     password: process.env.DB_PROD_PASSWORD,
//     database: process.env.DB_PROD_NAME,
//     host: process.env.DB_PROD_HOST,
//     dialect: process.env.DB_DIALECT,
//   },
// };


// require("dotenv").config();

// module.exports = {
//   development: {
//     dialect: "postgres",
//     url: process.env.DATABASE_URL,
//   },

//   test: {
//     dialect: "postgres",
//     url: process.env.DATABASE_URL,
//   },

//   production: {
//     dialect: "postgres",
//     url: process.env.DATABASE_URL,
//     dialectOptions: {
//       ssl: {
//         require: true,
//         rejectUnauthorized: false,
//       },
//     },
//   },
// };

require("dotenv").config();

module.exports = {
  production: {
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT),
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
