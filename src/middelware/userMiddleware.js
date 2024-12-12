import User from '../models/userModel.js'


export const userAuthByEmail = async(req,res ,next)=>{

    const {email}=req.body;
    const user =await User.findOne({email})

    if(!user){
        return res.status(404).json({message: "user not found"})
    }
return next();

}


export const userAuthById = async (req, res, next) => {
    try {
      const { id } = req.body;
  
      if (!id) {
        return res.status(400).json({ message: 'User ID is required' });
      }
      const user = await User.findById(id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      req.user = user;
  
  
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };