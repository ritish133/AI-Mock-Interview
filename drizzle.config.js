/** @type { import("drizzle-kit").Config } */
export default{
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
        url: 'postgresql://ai-interview-mocker_owner:gB2SnEDp3kui@ep-fragrant-thunder-a5mj844q.us-east-2.aws.neon.tech/ai-interview-mocker?sslmode=require',
    }
};