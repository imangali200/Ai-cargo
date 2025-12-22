import { v2 as cloudinary } from 'cloudinary';

console.log(
  process.env.JWT_SECRET,
  process.env.CLOUDINAR_API_KEY,
  process.env.CLOUDINARY_API_SECRET
);

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINAR_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})



export default cloudinary