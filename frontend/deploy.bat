@echo off

set DIST_FOLDER=build
set BUCKET_NAME=teacherlink-staging

echo Building application...
call npm run build

echo Deleting old files from bucket %BUCKET_NAME%...
aws s3 rm s3://%BUCKET_NAME% --recursive

echo Uploading new files from %DIST_FOLDER% to bucket %BUCKET_NAME%...
aws s3 sync %DIST_FOLDER% s3://%BUCKET_NAME%

echo Deployment complete!
pause