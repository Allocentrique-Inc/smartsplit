import { CognitoUserPoolEvent, Handler, Context, Callback } from 'aws-lambda';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
const AWS = require('aws-sdk');
const cognitoIdentityService = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18', region: 'us-east-2'});

module.exports.getUserByAttribute = async (attributeName, attributeValue) => {
  const params = {
      UserPoolId: "us-east-2_PRLNO62fN",
      // Filter: `${attributeName} = "${attributeValue}"`,
  }
  try {
      const data = await cognitoIdentityService.listUsers(params).promise()
      console.log('Error', data.Users)
      return data.Users
  } catch (error) {
      console.log('Error: getUserByAttribute', error)
  }
}