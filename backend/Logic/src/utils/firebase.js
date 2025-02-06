import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import AWS from 'aws-sdk';

async function getFirebaseAuth() {
    const s3 = new AWS.S3();
    const bucketName = 'teacherlink-deployments-ap-south-1';
    const key = 'developement/firebase.json';

    const params = { Bucket: bucketName, Key: key };
    const response = await s3.getObject(params).promise();
    const serviceAccount = JSON.parse(response.Body.toString('utf-8'));

    let app;
    if (!getApps().length) {
        app = initializeApp({
            credential: cert(serviceAccount)
        });
    } else {
        app = getApps()[0];
    }

    return getAuth(app);
}

export { getFirebaseAuth };