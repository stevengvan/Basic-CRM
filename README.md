# Basic CRM

A simple customer relation management system that allows the user to add, remove, and update customers. This was built with the MEVN stack (MongoDB, Express, Vue, and Node) and is deployed on Netlify for the frontend and Render for the backend. Additionally all images are uploaded to Cloudinary. The project was made to learn how to use Vue at first, but grew into learning how to use MongoDB with Vue.

## Demo

A website was made that deploys the repo. It can be found in the following link:
[https://stevengvan-basic-crm.netlify.app](https://stevengvan-basic-crm.netlify.app) Please do not add actual information to the application as this project was only made for learning.

## Running the app locally

If forking the repo, note that frontend and backend components of the app are separated into two different folders. The client folder focuses on the frontend aspect, while the server folder focuses on the backend.

To run the app locally, it is recommended to have two terminals opened to save time. Users must first navigate to the server folder and then enter

```sh
npm run start
```

in the terminal to start the server. Then users can navigate to the client folder and enter

```sh
npm run dev
```

## Project Setup

The following items are required before proceeding:

- Create MongoDB Atlas account
- Create a database and collection
- Create Cloudinary account

Note that when creating a database and collection, you will need to whitelist your IP address. Document on this process is found [here](https://www.mongodb.com/docs/atlas/security/add-ip-address-to-list/).

Install all packages for client and server folders using the command below:

```sh
npm install
```

The main backend script will be `server.js`. An env file will need to be made with the following variables:

- NODE_ENV_MONGODB_URL : [MongoDB Cluster URL](https://www.mongodb.com/docs/drivers/node/current/quick-start/create-a-connection-string/#std-label-node-quick-start-connection-string)
- NODE_ENV_MONGODB_DB: MongoDB Database's name
- NODE_ENV_MONGODB_COLLECTION: MongoDB Collection's name
- NODE_ENV_CLOUDINARY_NAME: [Cloudinary environment name](https://cloudinary.com/documentation/cloudinary_credentials_tutorial#video_tutorial)
- NODE_ENV_CLOUDINARY_API_KEY: [Cloudinary API key](https://cloudinary.com/documentation/cloudinary_credentials_tutorial#video_tutorial)
- NODE_ENV_CLOUDINARY_API_SECRET: [Cloudinary Secret key](https://cloudinary.com/documentation/cloudinary_credentials_tutorial#video_tutorial)

Additionally, the `baseURL` in `./client/components/apiURL.js` will need to be changed to the localhost URL. An example URL is readily available on the line below the uncommented `baseURL`. Note to change the port on the address as well if replacing the port number in `./server/server.js`.

### Compile and Minify for Production

Navigate to the client folder in the terminal and run the following command:

```sh
npm run build
```

Then run the command below to preview the build:

```sh
npm run preview
```

To deploy and host your own version of the application, you can use Render for the backend to create a web service and Netlify for the frontend hosting your static site. Note that you will need to whitelist the server's IP address hosting your backend to MongoDB (For Render: [Find IP addresses for hosted backend on Render](https://render.com/docs/static-outbound-ip-addresses))
