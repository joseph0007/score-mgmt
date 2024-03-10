## Simple file system library

### Steps to setup
- Note: Node needs to be installed in the system prior to running the below commands.

- git clone https://github.com/joseph0007/filesystem.git
- cd filesystem
- npm i
- npm start

### API End points

#### Login
curl --location 'http://127.0.0.1:3000/api/v1/login' \
--header 'Content-Type: application/json' \
--header 'Cookie: jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDg4NzMyNzMsImV4cCI6MTcxMTQ2NTI3M30.zBfnYM3wUpP0HykYAa4Vi2BR9QMZCfOxL59uHomMKaE' \
--data-raw '{
    "email": "joe@gmail.com",
    "password": "123456"
}'

#### upload api
curl --location 'http://127.0.0.1:3000/api/v1/file/upload' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDg4NzMyNzMsImV4cCI6MTcxMTQ2NTI3M30.zBfnYM3wUpP0HykYAa4Vi2BR9QMZCfOxL59uHomMKaE' \
--header 'Cookie: jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDg4NzMyNzMsImV4cCI6MTcxMTQ2NTI3M30.zBfnYM3wUpP0HykYAa4Vi2BR9QMZCfOxL59uHomMKaE' \
--form 'file=@"/home/xyz/abc/file.tar.gz"'

#### list api
curl --location 'http://127.0.0.1:3000/api/v1/file/list' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDg4NzUxMDYsImV4cCI6MTcxMTQ2NzEwNn0.RxT-ILcci6zfRzeLEOLBGgnGr_nsUti00TOi3RJRo4s' \
--header 'Cookie: jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDg4NzUxMDYsImV4cCI6MTcxMTQ2NzEwNn0.RxT-ILcci6zfRzeLEOLBGgnGr_nsUti00TOi3RJRo4s'

#### delete api
curl --location --request DELETE 'http://127.0.0.1:3000/api/v1/file/delete' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDg4NzUxMDYsImV4cCI6MTcxMTQ2NzEwNn0.RxT-ILcci6zfRzeLEOLBGgnGr_nsUti00TOi3RJRo4s' \
--header 'Cookie: jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDg4NzUxMDYsImV4cCI6MTcxMTQ2NzEwNn0.RxT-ILcci6zfRzeLEOLBGgnGr_nsUti00TOi3RJRo4s' \
--data '{
    "filename": "file.tar"
}'