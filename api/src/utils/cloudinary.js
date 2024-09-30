import { v2 as cloudinary } from "cloudinary";
// import dotenv from "dotenv";
import fs from "fs";
// dotenv.config(); // Ensure this is at the top
// Configuration
// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// cloudinary.config({
//   cloud_name: "dbqyok2i8",
//   api_key: "289577841652863",
//   api_secret: "P3eD80mw3CX-__olEF_zF4YcKCI",
// });

// Upload an image

const uploadOnCloudinary = async (localFilePath) => {
  console.log("Uploading file on cloudinary...");
  console.log(process.env.CLOUDINARY_CLOUD_NAME);
  console.log(process.env.CLOUDINARY_API_KEY);
  console.log(process.env.CLOUDINARY_API_SECRET);

  try {
    if (!localFilePath) {
      return null;
    }
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    //file has been uploaded successfully
    console.log(
      "File is uploaded on CLOUDINARY SUCCESSFULLY..! \n and response is : ",
      response,
      "\n and the url is ",
      response.url
    );
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file after successfully upload the image
    return response;
  } catch (err) {
    //not uploaded successfully -
    fs.unlinkSync(localFilePath); //remove the locally saved temporary file as the uploaded operation got failed
    console.log("ERROR in cloudinary: ", err);
    return null;
  }
};

export { uploadOnCloudinary };
