import { Request, Response } from 'express';
import { saveUser,getUser } from '../services/awsService';

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


// Signin
export const signin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await getUser(username);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({ message: "Signin successful", user });
  } catch (err) {
    res.status(500).json({ error: "Signin failed", details: err });
  }
};
