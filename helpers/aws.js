const AWS = require('aws-sdk');
const Promise = require('bluebird');
require('dotenv').config();

const p = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: 'us-west-1'
};

AWS.config.update(p);
var sqs = new AWS.SQS();

sqs.sendMessage = Promise.promisify(sqs.sendMessage);

const saveQuery = (userId, query) => {
  const params = {
    // DelaySeconds: 10,
    MessageAttributes: {
      'userId': {
        DataType: 'Number',
        StringValue: String(userId)
      }
    },
    MessageBody: query,
    // substitute the below url with the url of the Events queue to send to?
    QueueUrl: 'https://sqs.us-west-1.amazonaws.com/394283035579/queryTest'
  };
  return sqs.sendMessage(params)
    // .then(data => console.log('successful SQS message', data.MessageId))
    .catch(err => console.error('Error sending sqs message', err));
};

module.exports.saveQuery = saveQuery;