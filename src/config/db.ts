// // 
// import { Sequelize } from 'sequelize';
// import dotenv from 'dotenv';

// dotenv.config();
// const databaseUrl = process.env.DATABASE_URL
// //  || 
//   // 'postgresql://postgres:RGUlXcYyOoBSguVVBMRckIQMxxfDdKML@postgres.railway.internal:5432/railway';

// // Option 1: Use connection string (simpler)
// const sequelize = new Sequelize(databaseUrl, {
//   dialect: 'postgres',
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false 
//     }
//   },
//   logging: false
// });

// export default sequelize;


import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL || 
 'postgresql://postgres:RGUlXcYyOoBSguVVBMRckIQMxxfDdKML@postgres.railway.internal:5432/railway';


if (!databaseUrl) {
  throw new Error('DATABASE_URL is not defined');
}

const isProduction = process.env.NODE_ENV === 'production';

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  dialectOptions: !isProduction
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {}, // ❌ NO SSL locally
  logging: false,
});

export default sequelize;
