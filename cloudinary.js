const cloudinary = require('cloudinary').v2;
const  {CloudinaryStorage}  = require('multer-storage-cloudinary');
const fs =require("fs");

cloudinary.config({
    cloud_name : process.env.cloud_name,
    api_key : process.env.cloud_api_key,
    api_secret: process.env.cloud_api_secret
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder : 'WANDERLUST_MINI',
    allowedFormats : ["jpg","png","jpeg"], // supports promises as well
  },
});

module.exports = {cloudinary,storage};