const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

/**
 * Upload a file buffer to an R2 bucket
 * @param {Buffer} fileBuffer - The file content
 * @param {string} key - Object key (path/filename) in the bucket
 * @param {string} bucket - R2 bucket name
 * @param {string} contentType - MIME type
 * @returns {Promise<string>} The public URL of the uploaded file
 */
async function uploadToR2(fileBuffer, key, bucket, contentType) {
  await s3.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
  }));

  // Return the S3 endpoint-based URL (works if public access is enabled)
  return `${process.env.R2_ENDPOINT}/${bucket}/${key}`;
}

/**
 * Delete a file from an R2 bucket
 * @param {string} key - Object key to delete
 * @param {string} bucket - R2 bucket name
 */
async function deleteFromR2(key, bucket) {
  await s3.send(new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  }));
}

module.exports = { s3, uploadToR2, deleteFromR2 };
