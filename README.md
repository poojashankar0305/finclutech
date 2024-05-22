Folder contains two sub folder
1. ui - This is for Frontend which is developed in angular (Used Proxy server to for security purpose to not expose backend Path)
2. api - This is for backend develoed in Node JS

after cloning the project we have to run the both ui and api servers differently
eg. 
1. open cmd for ui
   - execute **npm i**
   - run command **npm start**
   - Front end server is started and running on **http://localhost:4200/**

2. open cmd for api
   - execute **npm i**
   - run command **npm start**
   - Front end server is started and running on **http://localhost:3000/**

In Front end added login page with credentials as below
username: admin
password: admin

the above user is created in DB and authtication also done from backend side. (Dump is also committed in the Main Folder - **finclutechDBDump**)




