import User from '../models/User.js';

export const createUser = async (req, res) => {
  const newUser = new User(req.body);
    try {
      const savedUser = await newUser.save();
       
        // Respond with success message and the saved User
        res.status(201).json({ success: true, message: 'User created successfully', data: savedUser });
    } catch (error) {
        // If an error occurs, respond with error message
        console.error('Error creating User:', error);
        res.status(500).json({ success: false, message: 'Failed to create User. Try again' });
    }
};

export const updateUser = async (req, res, next) => {
    const id = req.params.id;
    try {
        const updateUser = await User.findByIdAndUpdate(id, {
            $set: req.body
        }, { new: true });

        res.status(200).json({ success: true, message: 'Successfully updated', data: updateUser });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to update' });
    }
};

    export const deleteUser = async (req, res, next) => {
        const id = req.params.id;
        try {
            await User.findByIdAndDelete(id);
            res.status(200).json({ success: true, message: 'Successfully deleted' });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Failed to delete' });
        }
    };

    export const getSingleUser = async (req, res, next) => {
      const id = req.params.id;
      try {
          const users = await User.findById(id);
          if (!users) {
              return res.status(404).json({ success: false, message: 'User not found' });
          }
          res.status(200).json({ success: true, message: 'Successful', data: desti });
      } catch (err) {
          res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
  };
  
  export const getAllUsers = async (req, res, next) => {
      const page = parseInt(req.query.page) || 0; // Default page is 0 if not provided
  
      try {
          const user = await User.find({}).skip(page * 8).limit(8);
          res.status(200).json({ success: true,  message: 'Successful', data: user });
      } catch (err) {
          res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
  };