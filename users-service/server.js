// Import necessary packages
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');

// Load the gRPC proto file
const PROTO_PATH = path.join(__dirname, 'protos', 'users.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const usersProto = grpc.loadPackageDefinition(packageDefinition);

// Connect to MongoDB
const mongoClient = new MongoClient('mongodb://localhost:27017/library');

mongoClient.connect().then(async () => {
  const db = mongoClient.db('library');
  const usersCollection = db.collection('users');

  async function createUser(call, callback) {
    const user = call.request;
    try {
      const result = await usersCollection.insertOne(user);
      if (result && result.ops && result.ops.length > 0) {
        const createdUser = result.ops[0];
        callback(null, { user: createdUser });
      } else {
        callback({
          code: grpc.status.INTERNAL,
          message: 'Error creating user: Insertion result is empty'
        });
      }
    } catch (error) {
      console.error('Error creating user:', error.message);
      callback({
        code: grpc.status.INTERNAL,
        message: 'Error creating user: ' + error.message
      });
    }
  }

//service logic
  async function getUser(call, callback) {
    const userId = call.request.userId;
    console.log('User ID:', userId); // Add this line to log the user ID
    try {
      const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
      console.log('Retrieved User:', user); // Add this line to log the retrieved user
      if (!user) {
        callback({
          code: grpc.status.NOT_FOUND,
          message: 'User not found'
        });
      } else {
        callback(null, { user });
      }
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        message: 'Error getting user: ' + error.message
      });
    }
  }


  async function deleteUser(call, callback) {
    const userId = call.request.userId;
    try {
      const result = await usersCollection.deleteOne({ _id: new ObjectId(userId) });
      if (result.deletedCount === 0) {
        callback({
          code: grpc.status.NOT_FOUND,
          message: 'User not found'
        });
      } else {
        callback(null, {});
      }
    } catch (error) {
      callback({
        code: grpc.status.INTERNAL,
        message: 'Error deleting user: ' + error.message
      });
    }
  }


  async function updateUser(call, callback) {
    const { userId, name, email } = call.request;
    console.log('Received user ID for update:', userId);
    try {
      console.log('Updating user with ID:', userId);
      const result = await usersCollection.updateOne({ _id: new ObjectId(userId) }, { $set: { name, email } });
      console.log('Update result:', result);
      if (result.modifiedCount === 0) {
        callback({
          code: grpc.status.NOT_FOUND,
          message: 'User not found'
        });
      } else {
        callback(null, {});
      }
    } catch (error) {
      console.error('Error updating user:', error);
      callback({
        code: grpc.status.INTERNAL,
        message: 'Error updating user: ' + error.message
      });
    }
  }

  // Create gRPC server
  const server = new grpc.Server();

  // Add service implementations to the server
  server.addService(usersProto.users.Users.service, {
    createUser,
    getUser,
    deleteUser,
    updateUser,
  });



  
  server.bindAsync('0.0.0.0:50052', grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('Error starting gRPC server:', err);
      return;
    }
    console.log('gRPC server started on port', port);
    server.start();
  });

}).catch(error => {
  console.error('Error connecting to MongoDB:', error);
});