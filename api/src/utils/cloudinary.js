import { v2 as cloudinary } from "cloudinary";

import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View Credentials' below to copy your API secret
});

// Upload an image

const uploadOnCloudinary = async (localFilePath) => {
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
    return response;
  } catch (err) {
    //not uploaded successfully -
    fs.unlinkSync(localFilePath); //remove the locally saved temporary file as the uploaded operation got failed
    console.log("ERROR in cloudinary: ", err);
    return null;
  }
};

// const uploadResult = await cloudinary.uploader
//   .upload(
//     "https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg",
//     {
//       public_id: "shoes",
//     }
//   )
//   .catch((error) => {
//     console.log(error);
//   });

export { uploadOnCloudinary };
