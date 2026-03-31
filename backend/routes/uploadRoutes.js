const express = require("express")
const multer = require("multer")
const cloudinary = require("cloudinary").v2
const streaminfier = require("streamifier")

require("dotenv").config()

const router = express.Router()

// cloudinary configuiration

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// multer setup using memory storage
const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post("/", upload.single("image"), async (req, res) =>
{
    try {
        if (!req.file)
        {
            return res.status(400).json({message: "No file uploaded!"})
        }

        // function to handle the upload to cloudinary

        const streamUpload = (fileBuffer) =>
        {
            return new Promise((resolve, reject) =>
            {
                const stream = cloudinary.uploader.upload_stream((error, result) =>
                {
                    if (result)
                    {
                        resolve(result)
                    }
                    else
                    {
                        reject(error)
                    }
                    
                })

                //  use streamfier to convert the buffer into a readable stream pipe it to cloudinary

                streaminfier.createReadStream(fileBuffer).pipe(stream)

            })
        }

        //  call the stream upload function
        const result = await streamUpload(req.file.buffer)

        // respond with the image url 
        res.json({imageUrl: result.secure_url})

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"server Error"})
        
        
    }
})

module.exports = router;


