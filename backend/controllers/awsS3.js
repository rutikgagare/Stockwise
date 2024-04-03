const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} = require("@aws-sdk/client-s3");
const uniqid = require("uniqid");

const uploadImageToAWS = async (req, res) => {

  try {
    const file = req.file;

    if (!file) {
      throw new Error("File not found");
    }

    const s3Client = new S3Client({
      region: "ap-south-1",
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
    });

    const randomId = uniqid();
    const ext = file.originalname.split(".").pop();
    const newFilename = randomId + "." + ext;
    const bucketName = process.env.BUCKET_NAME;

    const result = await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: newFilename,
        ACL: "public-read",
        Body: file.buffer,
        ContentType: file.mimetype,
      })
    );

    return res.status(200).json({ key: newFilename });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteImageFromAWS = async (req, res) => {

  const key = req.params.key;
  const bucketName = process.env.BUCKET_NAME;


  try {
    const s3Client = new S3Client({
      region: "ap-south-1",
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
    });

    const result = await s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      })
    );

    res.status(200).json({
      message: `Successfully deleted object ${key} from bucket ${bucketName}`,
    });
  } catch (err) {
    res.status(500).json({
      error: `Error deleting object ${key} from bucket ${bucketName}`,
    });
  }
};

// const listObjectsInBucket = async (req, res) => {
//   try {
//     const bucketName = process.env.BUCKET_NAME;
//     const s3Client = new S3Client({
//       region: "ap-south-1",
//       credentials: {
//         accessKeyId: process.env.S3_ACCESS_KEY,
//         secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
//       },
//     });

//     const params = {
//       Bucket: bucketName,
//     };

//     const data = await s3Client.send(new ListObjectsV2Command(params));
//     const objectKeys = data.Contents.map((object) => object.Key);
//     res.status(200).json({ objectKeys });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

module.exports = { uploadImageToAWS, deleteImageFromAWS };
