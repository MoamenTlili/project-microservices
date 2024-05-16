const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const { ObjectId } = require('mongodb');

// Load the gRPC proto file
const PROTO_PATH = path.join(__dirname, 'protos', 'users.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const usersProto = grpc.loadPackageDefinition(packageDefinition);

// Create gRPC client
const client = new usersProto.users.Users('localhost:50052', grpc.credentials.createInsecure());


function createUser(name, email) {
    const user = {
      name: name,
      email: email
    };
  
    client.createUser(user, (error, response) => {
      if (error) {
        console.error('Error creating user:', error.message);
        // Log additional error details if available
        if (error.details) {
          console.error('Error details:', error.details);
        }
      } else {
        console.log('Response:', response); // Log the entire response object
        console.log('User created successfully:', response.user);
      }
    });
}


function deleteUser(userId) {
    const request = {
      userId: userId
    };
  
    client.deleteUser(request, (error, response) => {
      if (error) {
        console.error('Error deleting user:', error.message);
        // Log additional error details if available
        if (error.details) {
          console.error('Error details:', error.details);
        }
      } else {
        console.log('Response:', response); 
        console.log('User deleted successfully');
      }
    });
}


function updateUser(userId, updatedName, updatedEmail) {
    const request = {
      userId: userId, 
      name: updatedName,
      email: updatedEmail
    };
  
    client.updateUser(request, (error, response) => {
      if (error) {
        console.error('Error updating user:', error.message);
        if (error.details) {
          console.error('Error details:', error.details);
        }
      } else {
        console.log('Response:', response); 
        console.log('User updated successfully');
      }
    });
}


function getUserById(userId) {
  const request = {
    userId: userId,
  };

  client.GetUser(request, (error, response) => { 
    if (error) {
      console.error('Error getting user by ID:', error.message);
      if (error.details) {
        console.error('Error details:', error.details);
      }
    } else {
      console.log('Response:', response);
      console.log('User retrieved successfully:', response.user);
    }
  });
}


// Example usage "CREATE":
//createUser('Dave Chappelle', 'Dave@gmail.com');

// Example usage "DELETE":
// deleteUser('6644932977d9c2896f849480');

// Example usage "UPDATE":
// updateUser('663e14a3751c7e96fec31477', 'Jane Doe', 'jane@example.com');

// Example usage: Get user by ID
// getUserById('6645c60fccf409c65ef6fc2a');
