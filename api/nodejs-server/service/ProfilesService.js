'use strict';
const lodb = require('lodb');
const db = lodb('./data/db.json');
const uuid = require('uuid');
const TABLE = 'profiles';

// AWS
const AWS = require('aws-sdk');
const REGION = 'us-east-2';

AWS.config.update({
  region: REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const ddb = new AWS.DynamoDB.DocumentClient({region: REGION});



/**
 * Delete a right holder's profile with the given ID
 *
 * id Integer The rights holder's unique profile ID
 * no response value expected for this operation
 **/ 
exports.deleteProfile = function(id) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'id': id
      }
    };
    // Call DynamoDB to delete the item from the table
    ddb.delete(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data);
        resolve('Profile removed');
      }
    });
  });
}


/**
 * Get a list of all right holder profiles
 *
 * returns profiles
 **/
exports.getAllProfiles = function() {
  return new Promise(function(resolve, reject) {
    let params = {
      "TableName": TABLE,
    }
    // Call DynamoDB to delete the item from the table
    ddb.scan(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data);
        resolve(data.Items);
      }
    });
  });
}


/**
 * Get a right holder's profile with the given ID
 *
 * id Integer The rights holder's unique profile ID
 * returns profile
 **/
exports.getProfile = function(id) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'id': id
      }
    };
    // Call DynamoDB to delete the item from the table
    ddb.get(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data);
        resolve(data);
      }
    });
  });
}


/**
 * Update right holder's email address with given ID
 *
 * id Integer The right holder's unique profile ID
 * email Email The rights holder's email address
 * returns Object
 **/
exports.patchProfileEmail = function(id,email) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'id': id
      },
      UpdateExpression: 'set email = :e',
      ExpressionAttributeValues: {
        ':e' : email.email
      },
      ReturnValues: 'UPDATED_NEW'
    };
    // Call DynamoDB to delete the item from the table
    ddb.update(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data.Attributes);
        resolve(data.Attributes);
      }
    });
  });
}


/**
 * Update right holder's first name with the given ID
 *
 * id Integer The rights holder's unique profile ID
 * firstName First-name The rights holder's first name
 * returns Object
 **/
exports.patchProfileFirstName = function(id,firstName) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'id': id
      },
      UpdateExpression: 'set firstName  = :f',
      ExpressionAttributeValues: {
        ':f' : firstName.firstName
      },
      ReturnValues: 'UPDATED_NEW'
    };
    // Call DynamoDB to delete the item from the table
    ddb.update(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data.Attributes);
        resolve(data.Attributes);
      }
    });
  });
}


/**
 * Update right holder's IPI number
 *
 * id Integer The right holder's unique profile ID
 * ipi Ipi The right holder's IPI number
 * returns Object
 **/
exports.patchProfileIPI = function(id,ipi) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'id': id
      },
      UpdateExpression: 'set ipi = :i',
      ExpressionAttributeValues: {
        ':i' : ipi.ipi
      },
      ReturnValues: 'UPDATED_NEW'
    };
    // Call DynamoDB to delete the item from the table
    ddb.update(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data.Attributes);
        resolve(data.Attributes);
      }
    });
  });
}


/**
 * Update right holder's last name with the given ID
 *
 * id Integer The rights holder's unique profile ID
 * lastName Last-name The rights holder's last name
 * returns Object
 **/
exports.patchProfileLastName = function(id,lastName) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'id': id
      },
      UpdateExpression: 'set lastName  = :l',
      ExpressionAttributeValues: {
        ':l' : lastName.lastName
      },
      ReturnValues: 'UPDATED_NEW'
    };
    // Call DynamoDB to delete the item from the table
    ddb.update(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data.Attributes);
        resolve(data.Attributes);
      }
    });
  });
}


/**
 * Update list of media for the given right holder
 *
 * id Integer The right holder's unique profile ID
 * mediaId MediaIds The unique ID of the given media
 * returns profile
 **/
exports.patchProfileMedia = function(id,mediaId) {
  return new Promise(function(resolve, reject) {
    // let mediaOld = (db('profiles').find({ id: id }).value()).media;
    // let mediaString = mediaOld + "," + mediaId;
    // // convert to an array of sorted numbers
    // let mediaValue = mediaString.split(',').map(Number).sort();
    // db('profiles').find({ id: id }).assign({ media: [...new Set(mediaValue)] });
    // db.save();
    // let profile = db('profiles').find({ id: id }).value();
    // if (profile.media != mediaOld) {
    //   resolve("Media added: " + profile.media);
    // } else {
    //   resolve();
    // }
    let params = {
      TableName: TABLE,
      Key: {
        'id': id
      },
      UpdateExpression: 'set media = :m',
      ExpressionAttributeNames: {'media' : 'Sum'}, // TODO
      ExpressionAttributeValues: {
        ':m' : Number(mediaId.media)
      },
      ReturnValues: 'UPDATED_NEW'
    };
    // Call DynamoDB to delete the item from the table
    ddb.update(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data.Attributes);
        resolve(data.Attributes);
      }
    });
  });
}


/**
 * Update right holder's role with the given ID       (Or list of roles including copyright, performance, and/or recording)
 *
 * id Integer The right holder's unique profile ID
 * contributorRole Contributor Role The right holder's role
 * returns Object
 **/
exports.patchProfileContributorRole = function(id,contributorRole) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'id': id
      },
      UpdateExpression: 'set contributorRole  = :r',
      ExpressionAttributeValues: {
        ':r' : contributorRole.contributorRole
      },
      ReturnValues: 'UPDATED_NEW'
    };
    // Call DynamoDB to delete the item from the table
    ddb.update(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data.Attributes);
        resolve(data.Attributes);
      }
    });
  });
}


/**
 * Update the wallet address of a right holder
 *
 * id Integer The right holder's unique profile ID
 * wallet Wallet The right holder's wallet address
 * returns Object
 **/
exports.patchProfileWallet = function(id,wallet) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'id': id
      },
      UpdateExpression: 'set wallet  = :f',
      ExpressionAttributeValues: {
        ':f' : wallet.wallet
      },
      ReturnValues: 'UPDATED_NEW'
    };
    // Call DynamoDB to delete the item from the table
    ddb.update(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data.Attributes);
        resolve(data.Attributes);
      }
    });
  });
}


/**
 * This method creates a new profile
 *
 * body Profile request
 * returns profile
 **/
exports.postProfile = function(body) {
  return new Promise(function(resolve, reject) {
    let params = {
      "TableName": TABLE,
    }
    // Call DynamoDB to delete the item from the table
    ddb.scan(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        // Create unique ID value
        let ID_VALUE = data.Count + 1;

        let params = {
          TableName: TABLE,
          Item: {
            'id': ID_VALUE,
            'ipi': body.ipi,
            'contributorRole': body.contributorRole,
            'wallet': body.wallet,
            'media': body.media,
            'firstName': body.firstName,
            'email': body.email,
            'lastName': body.lastName
          }
        };
        ddb.put(params, function(err, data) {
          if (err) {
            console.log("Error", err);
            resolve();
          } else {
            console.log("Success", data);
            resolve(data);
          }
        });
      }

    });
  });
}


/**
 * This method updates a profile
 *
 * id Integer The rights holder's unique profile ID
 * body Profile request
 * returns profile
 **/
// AWS updateItem
exports.updateProfile = function(id,body) {
  return new Promise(function(resolve, reject) {
    let params = {
      TableName: TABLE,
      Key: {
        'id': id
      },
      UpdateExpression: 'set ipi  = :i, contributorRole = :r, wallet = :w, media = :m, firstName = :f, email = :e, lastName = :l',
      ExpressionAttributeValues: {
        ':i' : body.ipi,
        ':r' : body.contributorRole,
        ':w' : body.wallet,
        ':m' : body.media,
        ':f' : body.firstName,
        ':e' : body.email,
        ':l' : body.lastName
      },
      ReturnValues: 'UPDATED_NEW'
    };
    // Call DynamoDB to delete the item from the table
    ddb.update(params, function(err, data) {
      if (err) {
        console.log("Error", err);
        resolve();
      } else {
        console.log("Success", data.Attributes);
        resolve(data.Attributes);
      }
    });
  });
}

