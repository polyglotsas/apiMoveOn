'use strict';

const api = require('../build/index');
const fs = require('fs');
const { app_content, lists } = require('../settings');

// eslint-disable-next-line no-undef
const doc = document;

const selectFileBtn = doc.getElementById('btn-select-file');
const selectFile = doc.getElementById('input-select-file');
const tableHeader = doc.querySelector('.mdc-data-table__header-row');
const tableBody = doc.getElementById('table-body-entities');
const polyglotFooter = doc.getElementById('polyglot-footer');
const btnCrear = doc.getElementById('btn-crear');
const btnEditar = doc.getElementById('btn-editar');
const selectEntities = doc.getElementById('select-entities');
const fabSend = doc.getElementById('fab-send');
const tableContainer = doc.querySelector('#state-container');


let actualState = 0;
let actualEntity = undefined;
let data = [];
let rowHandlerFunctions = {};


const zip = (keys, values) => (
  keys.reduce((o, v, i) => {
    if (v.trim() !== 'id') {
      o[v] = values[i];
    }
    return o;
  }, {})
);

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
    data = [];
    clearNode(tableHeader);
    clearNode(tableBody);
  }
};

const clearNode = (node) => {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
};

const parseDataFile = (content) => {
  const rows = content.split('\n').map(s => s.trim().split(app_content.separator)).filter(r => r.length !== 0 && r[0] !== '');
  const header = rows.shift();
  const parse = (r) => {
    let rta = {};
    if (actualState === 1) {
      rta['id'] = r[0];
    }
    rta = { ...rta, ...zip(header, r) };
    return rta;
  };
  return rows.map(r => parse(r));
};

const rowClickHandler = (data) => () => console.log(data);

const changeEntity = (entity) => {
  actualEntity = entity;
  validateToLoad();
};

function fileEventHandler() {
  const file = this.files[0];

  const processFile = (content) => {
    let hasAddedHeader = false;
    const addCell = (tr, text, className = '', type = 'td', attrs = {}) => {
      const cell = doc.createElement(type);
      Object.keys(attrs).forEach(k => cell.setAttribute(k, attrs[k]));
      cell.classList.add('mdc-data-table__cell');
      if (className) {
        cell.classList.add(className);
      }
      cell.append(doc.createTextNode(text));

      tr.append(cell);
    };
    const addRow = (d, completeRows = false) => {
      const tr = doc.createElement('tr');
      tr.classList.add('mdc-data-table__row');
      if (completeRows) {
        if (!hasAddedHeader) {
          clearNode(tableHeader);

          hasAddedHeader = true;
          Object
            .keys(d)
            .forEach(k => {
              addCell(tableHeader, k.substring(k.indexOf('.') + 1).replace(/_/g, ' ').replace(/\./g, ' - '), 'mdc-data-table__header-cell', 'th', { role: 'columnheader', scope: 'col' });
            });
        }
        Object
          .values(d)
          .forEach(v => {
            addCell(tr, v);
          });
      } else {
        clearNode(tableHeader);
        addCell(tableHeader, 'Entidad', 'mdc-data-table__header-cell', 'th', { role: 'columnheader', scope: 'col' });
        addCell(tableHeader, 'Estado', 'mdc-data-table__header-cell', 'th', { role: 'columnheader', scope: 'col' });

        addCell(tr, d.id);
        addCell(tr, 'Pendiente');
      }

      return tr;
    };

    data = parseDataFile(content);

    clearNode(tableBody);

    data.forEach(d => tableBody.append(addRow(d, actualState === 2)));

    fabSend.classList.remove('hidden');
    rowHandlerFunctions = {};
  };

  fs.readFile(file.path, app_content.encoding, (err, data) => {
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
    tableRows[i].appendChild(icon);
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
      try {
        const { errors, success } = await api.bulkSave(actualEntity, content, actualState === 2);

        errors.forEach(e => setRowState(e.index, 'Error', e));
        success.forEach(s => setRowState(s.index, 'Correcto', s));

        toggleLoader(false);
      } catch (error) {
        toggleLoader(false);
        console.error(error);
      }
    })();
  };

  const fromList = (data) => {
    const type = data.k.substring(data.k.indexOf('.') + 1);
    if (type in lists && data.v in lists[type]) {
      return { k: data.k, v: lists[type][data.v] };
    }
    return data;
  };

  const readyData = data.map(d => {
    const rta = Object.entries(d)
      .filter(([k]) => k !== 'id')
      .map(([k, v]) => {

        k = k.trim().toLowerCase();
        const prefix = k.startsWith(actualEntity) ? '' : `${actualEntity}.`;
        let key = k.replace(/\s/g, '.');
        if (k.toLowerCase() !== `${actualEntity} id`.toLowerCase()) {
          key = `${prefix}${k}`.trim().replace(/\s/g, '_');
        }
        return fromList({ k: key, v });
      })
      .reduce((o, de) => {
        o[de['k']] = de['v'];
        return o;
      }, {});
    return rta;
  });

  toggleLoader(true);
  console.log(readyData);
  doRequest(readyData);
};

const openLink = (link) => () => require('electron').shell.openExternal(link);

btnCrear.addEventListener('click', () => changeState(1));
btnEditar.addEventListener('click', () => changeState(2));
selectEntities.addEventListener('change', () => changeEntity(selectEntities.value));

selectFile.addEventListener('change', fileEventHandler);
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
