"use strict";

const api = require('./build/index');
const fs = require("fs");

let actualState = 0;

let selectFileBtn = document.getElementById('btn-select-file');
let selectFile = document.getElementById('input-select-file');

document.getElementById('polyglot-footer')
  .addEventListener('click', () => {
    require('electron').shell.openExternal('https://polyglot.site');
  });

document.getElementById('btn-crear')
  .addEventListener('click', () => {
    if (actualState !== 1) {
      actualState = 1;
      selectFileBtn.classList.remove('disabled');
      selectFile.removeAttribute('disabled');
    }
  });

document.getElementById('btn-editar')
  .addEventListener('click', () => {
    if (actualState !== 2) {
      actualState = 2;
      selectFileBtn.classList.remove('disabled');
      selectFile.removeAttribute('disabled');
    }
  });

selectFile.addEventListener("change", function () {
  const file = this.files[0];

  fs.readFile(file.path, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }
    processFile(data);
  });

  const processFile = (content) => {
    console.log(content);
  }
});


(async function () {

  async function testCreate() {
    const createUser = {
      'customfield10': "test",
      // 'entity': "person",
      'person.country_of_birth.id': 15,
      'person.date_of_birth': "28/04/1980",
      'person.email': "mro@uniandes.edu.co",
      'person.fax': "1234567",
      // 'person.first_name': "Mariana",
      'person.gender.id': 2,
      'person.groups': "1,2,3,4",
      'person.iddoc_expired_on': "10/06/1979",
      'person.iddoc_issued_by': "fabian wulf",
      'person.iddoc_issued_on': "10/06/1978",
      'person.iddoc_number': "1234567",
      'person.iddoc_type': "1",
      'person.matriculation_id': "123456",
      'person.mobile': "1234567",
      'person.national.id': "123456",
      'person.nationality.id': 1,
      'person.phone': "12345",
      'person.phone_2': "123467",
      'person.place_of_birth': "Pasto, NA",
      'person.preferred_language.id': 2,
      'person.privacy_consent': "1",
      'person.remarks': "Person remarks",
      'person.second_nationality.id': 2,
      'person.surname': "Rodriguez",
      'person.title': "Ms"
    };
    const r = await api.create("person", createUser);
    console.log(r);
  }

  async function testGet() {
    const fields = ["person.first_name", "person.surname", "person.date_of_birth", "person.matriculation_ida"];
    console.log(await api.getAll('person', fields, 2));
  }

  // await testGet();

  // console.log('start');
  // document.getElementById('but').addEventListener('click', _ => console.log('hola'));
});