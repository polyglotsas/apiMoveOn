"use strict";

const api = require('../build/index');
const fs = require("fs");

const doc = document;

const selectFileBtn = doc.getElementById('btn-select-file');
const selectFile = doc.getElementById('input-select-file');
const tableBody = doc.getElementById('table-body-entities');
const polyglotFooter = doc.getElementById('polyglot-footer');
const btnCrear = doc.getElementById('btn-crear');
const btnEditar = doc.getElementById('btn-editar');
const selectEntities = doc.getElementById('select-entities');
const fabSend = doc.getElementById('fab-send');
const tableContainer = doc.querySelector('#state-container');


let actualState = 0;
let actualEntity = undefined;
let data;

const isNumber = (key) => {
  const data = [
    'person.country_of_birth.id',
    'person.gender.id',
    'person.nationality.id',
    'person.preferred_language.id',
    'person.second_nationality.id',
  ];

  return data.includes(key);
};

const zip = (keys, values) => {
  return keys.reduce((o, v, i) => {
    if (v.trim() !== 'id') {
      if (isNumber(v)) {
        o[v] = +values[i];
      } else {
        o[v] = values[i];
      }
    }
    return o;
  }, {});
};

polyglotFooter.addEventListener('click', () => {
  require('electron').shell.openExternal('https://polyglot.site');
});

btnCrear.addEventListener('click', () => {
  if (actualState !== 1) {
    actualState = 1;
    validateToLoad();
  }
});

btnEditar.addEventListener('click', () => {
  if (actualState !== 2) {
    actualState = 2;
    validateToLoad();
  }
});

selectEntities.addEventListener('change', () => {
  actualEntity = selectEntities.value;
  validateToLoad();
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
    const rows = content.split('\n').map(s => s.split(';')).filter(r => r.length !== 0 && r[0] !== '');
    const header = rows.shift();
    data = rows.map(r => ({ id: r[0], ...zip(header, r) }));

    while (tableBody.firstChild) {
      tableBody.removeChild(tableBody.firstChild);
    }

    data.forEach(d => {
      const tr = doc.createElement('tr');
      tr.classList.add('mdc-data-table__row');
      const tdEntity = doc.createElement('td');
      tdEntity.classList.add('mdc-data-table__cell');
      tdEntity.append(doc.createTextNode(d.id));
      const tdState = doc.createElement('td');
      tdState.classList.add('mdc-data-table__cell');
      tdState.append('Pendiente');

      tr.append(tdEntity);
      tr.append(tdState);

      tableBody.append(tr);
    });

    fabSend.classList.remove('hidden');
  };
});

fabSend.addEventListener('click', () => {
  const tableRows = doc.querySelectorAll('table > tbody > tr > td:nth-child(2)');

  const doRequest = (content) => {
    (async () => {
      const { errors, success } = await api.bulkSave(actualEntity, content, actualState === 2);

      errors.forEach(e => tableRows[e.index].textContent = 'Error');
      success.forEach(s => tableRows[s.index].textContent = 'Correcto');

      tableContainer.children[0].classList.remove('hidden');
      tableContainer.children[1].classList.add('hidden');
    })();
  };

  tableContainer.children[0].classList.add('hidden');
  tableContainer.children[1].classList.remove('hidden');

  doRequest(data.map(d => {
    delete d['id'];
    return d;
  }));

});

function validateToLoad() {
  if (actualState !== 0 && actualEntity) {
    selectFileBtn.classList.remove('disabled');
    selectFile.removeAttribute('disabled');
  }
}

// -----------------------------------------------------------------


(() => {
  const data = [
    'Person',
    'Contact',
    'Stay',
    'Catalogue Course',
    'Address',
    'Relation',
    'Framework',
    'Contact Role',
    'Institution',
    'Grant',
    'Course Unit',
    'Degree Program',
    'Relation Institution',
    'Relation Contact',
    'Relation Content Type',
    'Academic Year',
    'Subject Area',
    'Funding',
    'Payment'
  ].sort();

  data.forEach(entity => {
    let option = doc.createElement('option');
    option.setAttribute('value', entity.split(' ').join('-').toLowerCase());
    option.appendChild(doc.createTextNode(entity));

    selectEntities.appendChild(option);
  });
})();
