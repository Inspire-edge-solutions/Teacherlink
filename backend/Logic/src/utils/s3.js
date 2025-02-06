import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';

const s3 = new AWS.S3();

export const s3Upload = async (filePath, key) => {
  const fileContent = fs.readFileSync(filePath);
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: fileContent,
    ContentType: 'image/jpeg' // or other content type based on your file
  };

  try {
    const data = await s3.upload(params).promise();
    return data.Location;
  } catch (error) {
    console.error('S3 Upload Error:', error);
    throw new Error('Error uploading to S3');
  }
};