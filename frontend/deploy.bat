@echo off

set DIST_FOLDER=dist
set BUCKET_NAME=teacherlink-staging

echo Deleting old files from bucket %BUCKET_NAME%...
aws s3 rm s3://%BUCKET_NAME% --recursive

echo Uploading new files from %DIST_FOLDER% to bucket %BUCKET_NAME%...
aws s3 sync %DIST_FOLDER% s3://%BUCKET_NAME% --acl public-read

echo Deployment complete!
pause