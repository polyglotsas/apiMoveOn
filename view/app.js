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
let rowHandlerFunctions = {};


const zip = (keys, values) => {
  return keys.reduce((o, v, i) => {
    if (v.trim() !== 'id') {
      o[v] = values[i];
    }
    return o;
  }, {});
};

const validateToLoad = () => {
  if (actualState !== 0 && actualEntity) {
    selectFileBtn.classList.remove('disabled');
    selectFile.removeAttribute('disabled');
  }
};

const changeState = (nState) => {
  if (actualState !== nState) {
    actualState = nState;
    validateToLoad();
  }
};

const clearNode = (node) => {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
};

const parseDataFile = (content) => {
  const rows = content.split('\n').map(s => s.split(';')).filter(r => r.length !== 0 && r[0] !== '');
  const header = rows.shift();
  return rows.map(r => ({ id: r[0], ...zip(header, r) }));
};

const rowClickHandler = (data) => {
  return () => {
    console.log(data);
  };
};

const changeEntity = (entity) => {
  actualEntity = entity;
  validateToLoad();
};

function fileEventHandler() {
  const file = this.files[0];

  const processFile = (content) => {
    const addRow = (d) => {
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

      return tr;
    };

    data = parseDataFile(content);

    clearNode(tableBody);

    data.forEach(d => tableBody.append(addRow(d)));

    fabSend.classList.remove('hidden');
    rowHandlerFunctions = {};
  };

  fs.readFile(file.path, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }
    processFile(data);
  });
}

const sendRequest = () => {
  const tableRows = doc.querySelectorAll('table > tbody > tr > td:nth-child(2)');

  const setRowState = (i, state, data) => {
    const icon = doc.createElement('i');
    icon.classList.add('material-icons');
    icon.textContent = state === 'Error' ? 'close' : 'check';
    tableRows[i].textContent = '';
    tableRows[i].appendChild(icon)
    tableRows[i].appendChild(doc.createTextNode(state));
    tableRows[i].parentElement.classList.add(state);

    if (i in rowHandlerFunctions) {
      tableRows[i].parentElement.removeEventListener('click', rowHandlerFunctions[i]);
    }
    rowHandlerFunctions[i] = rowClickHandler(data);
    tableRows[i].parentElement.addEventListener('click', rowHandlerFunctions[i]);
  };

  const toggleLoader = (toggle) => {
    const functions = toggle ? ['add', 'remove'] : ['remove', 'add'];

    tableContainer.children[0].classList[functions[0]]('hidden');
    tableContainer.children[1].classList[functions[1]]('hidden');
  };

  const doRequest = (content) => {
    (async () => {
      const { errors, success } = await api.bulkSave(actualEntity, content, actualState === 2);

      errors.forEach(e => setRowState(e.index, 'Error', e));
      success.forEach(s => setRowState(s.index, 'Correcto', s));

      toggleLoader(false);
    })();
  };

  toggleLoader(true);
  doRequest(data.map(d => { delete d['id']; return d; }));
};

const openLink = (link) => {
  return () => require('electron').shell.openExternal(link);
};

btnCrear.addEventListener('click', () => changeState(1));
btnEditar.addEventListener('click', () => changeState(2));
selectEntities.addEventListener('change', () => changeEntity(selectEntities.value));

selectFile.addEventListener("change", fileEventHandler);
fabSend.addEventListener('click', sendRequest);

polyglotFooter.addEventListener('click', openLink('https://polyglot.site'));


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
