const path = require('path');
const child = require('child_process').execFile;

const spawnProcess = async (process, params) => {
  return new Promise((resolve, reject) => {
    child(process, params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const generateCertificate = async (email) => {
  const options = {
    'C': 'CO',
    'ST': 'Bogota',
    'L': 'Bogota',
    'O': 'Universidad de Los Andes',
    'OU': 'Internacionalizacion',
    'CN': 'www.uniandes.edu.co',
    'emailAddress': email
  };
  const openSSLDir = path.join(process.cwd(), 'external', 'openSSL');
  const createCert = ['req', '-x509', '-newkey', 'rsa:2048', '-keyout', 'certificate/llavePrivada.key', '-out', 'certificate/certificado.crt', '-days', '365', '-nodes', '-config', path.join(openSSLDir, 'openssl.cnf'),
    '-subj', `/${Object.entries(options).map(e => `${e[0]}=${e[1]}`).join('/')}/`];
  const openSSL = path.join(openSSLDir, 'openssl.exe');

  await spawnProcess(openSSL, createCert);

  const serialCert = ['x509', '-serial', '-noout', '-in', 'certificate/certificado.crt'];
  const serial = await spawnProcess(openSSL, serialCert);
  return serial.substring(7);
};

module.exports = { generateCertificate };
