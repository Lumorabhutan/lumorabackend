// 
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Option 1: Use connection string (simpler)
const sequelize = new Sequelize(process.env.DATABASE_URL || process.env.DATABASE_PUBLIC_URL || '', {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Railway requires SSL
    }
  },
  logging: false
});

export default sequelize;
