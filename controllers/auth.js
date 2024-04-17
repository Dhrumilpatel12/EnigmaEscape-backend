import User from '../models/User.js';
import bcrypt from 'bcryptjs';

import { createError } from '../utils/error.js';



export const register = async (req,res) => {
    try {
        const { username, lastname, email, password, phone, role } = req.body;

        // Validate if all required fields are present
        if (!username || !lastname || !email || !password || !phone) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Check password length
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
        }

        // Check for lowercase letter
        if (!/[a-z]/.test(password)) {
            return res.status(400).json({ success: false, message: 'Password must include at least one lowercase letter.' });
        }

        // Check for uppercase letter
        if (!/[A-Z]/.test(password)) {
            return res.status(400).json({ success: false, message: 'Password must include at least one uppercase letter.' });
        }

        // Check for a digit
        if (!/\d/.test(password)) {
            return res.status(400).json({ success: false, message: 'Password must include at least one number.' });
        }

        // Check for a special character
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return res.status(400).json({ success: false, message: 'Password must include at least one special character.' });
        }


        let errors = [];

           // Check if the email is already in use
           const existingUserByEmail = await User.findOne({ email });
           if (existingUserByEmail) {
               return res.status(400).json({ success: false, message: 'Email is already existed' });
           }
   
           // Check if the phone number is already in use
           const existingUserByPhone = await User.findOne({ phone });
           if (existingUserByPhone) {
               return res.status(400).json({ success: false, message: 'Phone number is already existed' });
           }
   
          // If there are any errors, return them
          if (errors.length > 0) {
            return res.status(400).json({ success: false, message: errors.join(' ') });
        }


        const salt = bcrypt.genSaltSync(10)
        const hash= bcrypt.hashSync(req.body.password,salt)

        const newUser = new User({
            username,
            lastname,
            email,
            password:hash,
            phone,
            isAdmin: role === "admin" ? true : false,
           
        });
        await newUser.save();
        res.status(200).json({ success: true, message: "User has been created" });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ success: false, message: "Please try again" });
    }
};
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if the email and password are provided
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: 'Incorrect email or password' });
        }

      

        // Response with user data
        const { password: _, ...userData } = user.toObject(); // Exclude password from response
        res.status(200).json({ success: true, message: 'Successfully logged in', data: userData, role:user.role, });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: 'Failed to login. Please try again later.' });
    }
};


