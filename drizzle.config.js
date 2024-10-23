/** @type { import("drizzle-kit").Config } */
export default{
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
        url: 'postgresql://neondb_owner:tYSPVJEim4L6@ep-white-feather-a5bnysun.us-east-2.aws.neon.tech/neondb?sslmode=require',
    }
};