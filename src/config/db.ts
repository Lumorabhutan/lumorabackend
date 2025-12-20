// db.ts or sequelize.ts
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.DATABASE_PUBLIC_URL;

if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL is missing. Make sure your Postgres plugin is in the same project and deployed.'
  );
}

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Required for Railway
    },
  },
  define: {
    underscored: true,     // Fixes column case issues
    timestamps: true,
  },
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to database:', error);
    return false;
  }
}
testConnection();

export default sequelize;