import { Options, Data } from "./models";

const fs = require('fs');
const https = require('https');
const parseString = require('xml2js').parseString;
const querystring = require('querystring');
const settings = require('../settings');

// ---------------------------------------------------------

function doRequest(options: Options, postData: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res: any) => {
      // cumulate data
      let body: any[] = [];
      res.on('data', (chunk: any) => body.push(chunk));

      // resolve on end
      res.on('end', () => {
        try {
          resolve(Buffer.concat(body).toString());
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', (e: any) => reject(e));

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

function getFromXML(xml: string): any {
  return new Promise((resolve, reject) => {
    parseString(xml, (err: any, result: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

async function callAPI(postData: Data, keyPath: string, certPath: string) {
  const stringData = querystring.stringify(postData);

  const options: Options = {
    hostname: settings.url.hostname,
    port: 443,
    path: settings.url.path,
    method: 'post',
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
    headers: {
      'Content-Type': settings.ContentType,
      'Content-Length': stringData.length
    }
  };

  const dataQueue = await doRequest(options, stringData);
  const resQueue = await getFromXML(dataQueue);
  const responseQueue = resQueue.rest.queue[0];

  if (responseQueue.status[0] === 'success') {
    const queueId = JSON.parse(responseQueue.response).queueId;
    const data = querystring.stringify({ method: 'get', id: queueId });
    options.headers["Content-Length"] = data.length;
    const responseString = await doRequest(options, data);
    const response = await getFromXML(responseString);

    const result = response.rest.get[0].response[0].data[0];
    const status = response.rest.get[0].status[0];

    if (status === 'success') {
      return result;
    } else {
      throw result;
    }
  }
  else {
    throw responseQueue;
  }
}

module.exports = {
  callAPI
};
