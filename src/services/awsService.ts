// src/services/awsService.ts
import AWS from "aws-sdk";

// config: read from env variables
const dynamoDB = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// Example: save user
export const saveUser = async (username: string, password: string) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE as string,
    Item: {
      username,
      password,
      createdAt: new Date().toISOString(),
    },
  };

  await dynamoDB.put(params).promise();
  return { message: "User saved!" };
};
