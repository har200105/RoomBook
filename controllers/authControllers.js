import User from '../models/user'
import cloudinary from 'cloudinary'

import ErrorHandler from '../utils/errorHandler'
import catchAsyncErrors from '../middlewares/catchAsyncErrors'
import sendEmail from '../utils/sendEmail'

import absoluteUrl from 'next-absolute-url'
import crypto from 'crypto'


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})



const registerUser = catchAsyncErrors(async (req, res,next) => {

    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: 'shiddat',
        width: '150',
        crop: 'scale'
    });

    const { name, email, password } = req.body;

    const resetToken = crypto.randomBytes(20).toString('hex');
    const { origin } = absoluteUrl(req);
     const resetUrl = `${origin}/auth/verify/${resetToken}`;
     const message = `Your email verify url is as follow: \n\n ${resetUrl}`;

    try {
        
        await sendEmail({
            email,
            subject: 'RoomBook Email Verification',
            message
        });

    

        const user = await User.create({
            name,
            email,
            password,
            verified: false,
            avatar: {
                public_id: result.public_id,
                url: result.secure_url
            },
            verifyUserToken: resetToken
        });


        res.status(200).json({
            success: true,
            message: 'Account Registered successfully'
        });
    }

    catch (error) {
        return next(new ErrorHandler(error.message, 500))
    }

});


const verifyUser = catchAsyncErrors(async (req, res,next) => {
    

    const user = await User.findOne({ verifyUserToken: req.query.token });
    
    if (!user) {
        return next(new ErrorHandler('Invalid or Expired URL', 404));
    }

    await User.findOneAndUpdate({ verifyUserToken: req.query.token }, {
        $set: {
            verified: true,
            verifyUserToken:null
        }
    }).then(() => {
        res.status(201).json({ success: true, message: "User Verified Successfully" });
    });



});


const currentUserProfile = catchAsyncErrors(async (req, res) => {
    const user = await User.findById(req.user._id);
    res.status(200).json({
        success: true,
        user
    });
});

const updateProfile = catchAsyncErrors(async (req, res) => {

    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name;
        user.email = req.body.email;

        if (req.body.password) user.password = req.body.password;
    }


    if (req.body.avatar !== '') {
        const image_id = user.avatar.public_id;
        await cloudinary.v2.uploader.destroy(image_id);

        const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: 'shiddat',
            width: '150',
            crop: 'scale'
        })

        user.avatar = {
            public_id: result.public_id,
            url: result.secure_url
        }

    }

    await user.save();

    res.status(200).json({
        success: true
    })

})



const forgotPassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler('User not found with this email', 404))
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const { origin } = absoluteUrl(req);

    const resetUrl = `${origin}/password/reset/${resetToken}`;

    const message = `Your password reset url is as follow: \n\n ${resetUrl} \n\n\ If you have not requested this email, then ignore it.`

    try {
        await sendEmail({
            email: user.email,
            subject: 'RoomBook Password Recovery',
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`
        })


    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false })

        return next(new ErrorHandler(error.message, 500))
    }

})

const resetPassword = catchAsyncErrors(async (req, res, next) => {

    const resetPasswordToken = crypto.createHash('sha256').update(req.query.token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorHandler('Password reset token is invalid or has been expired', 400))
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password does not match', 400))
    }

    user.password = req.body.password

    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save();

    res.status(200).json({
        success: true,
        message: 'Password updated successfully'
    })

})


const allAdminUsers = catchAsyncErrors(async (req, res) => {

    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })

})


const getUserDetails = catchAsyncErrors(async (req, res) => {

    const user = await User.findById(req.query.id);

    if (!user) {
        return next(new ErrorHandler('User not found with this ID.', 400))
    }

    res.status(200).json({
        success: true,
        user
    });

})


const updateUser = catchAsyncErrors(async (req, res) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    }

    const user = await User.findByIdAndUpdate(req.query.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true
    })

})


const deleteUser = catchAsyncErrors(async (req, res) => {

    const user = await User.findById(req.query.id);

    if (!user) {
        return next(new ErrorHandler('User not found with this ID.', 400))
    }
    
    const image_id = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(image_id)


    await user.remove();

    res.status(200).json({
        success: true,
        user
    })

})


export {
    registerUser,
    currentUserProfile,
    updateProfile,
    forgotPassword,
    resetPassword,
    allAdminUsers,
    getUserDetails,
    updateUser,
    deleteUser,
    verifyUser
}