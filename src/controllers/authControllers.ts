import { Request, Response } from 'express';
import { saveUser } from '../services/awsService';

export const signup = async (req: Request, res: Response) => {
  const { username, password } = req.body;

    if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

 /* res.json({
    message: 'Signup endpoint hit!',
    received: { username, password }
  });*/

   try {
    // Call DynamoDB service
    const result = await saveUser(username, password);

    res.status(201).json(result); // returns { success: true, message: "User saved!" }
  } catch (error: any) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Could not save user" });
  }

};

export const signin = (req: Request, res: Response) => {
  // TODO: Implement signin logic (e.g., validate credentials, generate token)
  res.json({ message: 'Signin endpoint hit!' });
};
