'use strict';

const fs = require('fs');
const api = require('../../../build/index');
const { fileSettings, lists } = require('../../../settings');

// eslint-disable-next-line no-undef
const doc = document;

const selectFileBtn = doc.getElementById('btn-select-file');
const selectFile = doc.getElementById('input-select-file');
const tableNode = doc.querySelector('.mdc-data-table__table');
const polyglotFooter = doc.getElementById('polyglot-footer');
const btnCrear = doc.getElementById('btn-crear');
const btnEditar = doc.getElementById('btn-editar');
const selectEntities = doc.getElementById('select-entities');
const fabSend = doc.getElementById('fab-send');
const tableContainer = doc.querySelector('#state-container');


const clearNode = (node) => {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
};


class FileParser {
  static loadFile(file, actualState, cbk) {
    fs.readFile(file.path, fileSettings.encoding, (err, data) => {
      if (err) {
        throw err;
      }
      cbk(FileParser.parseDataFile(data, actualState));
    });
  }

  static zip(keys, values) {
    return keys.reduce((o, v, i) => {
      if (v.trim() !== 'id') {
        o[v] = values[i];
      }
      return o;
    }, {});
  }

  static parseDataFile(content, actualState) {
    const rows = content
      .split('\n')
      .map(s => s
        .trim()
        .split(fileSettings.separator))
      .filter(r => r.length !== 0 && r[0] !== '');
    const header = rows.shift();
    const parse = (r) => {
      let rta = {};
      if (actualState === 1) {
        rta['id'] = r[0];
      }
      rta = { ...rta, ...FileParser.zip(header, r) };
      return rta;
    };
    return rows.map(r => parse(r));
  }
}

class Table {
  constructor(tableNode) {
    this.header = tableNode.querySelector('thead');
    this.body = tableNode.querySelector('tbody');
    this.tableRows = [];
    this.rowHandlerFunctions = {};
    this.rowClickHandler = () => { };
  }

  setHeader(titles) {
    const tr = doc.createElement('tr');
    titles.forEach(title => {
      this.addCell(tr, title, 'th', 'mdc-data-table__header-cell', { role: 'columnheader', scope: 'col' });
    });
    this.header.appendChild(tr);
  }

  setBody(rows, onclick) {
    rows.forEach(r => {
      this.addRow(r, onclick);
    });
  }

  addCell(tr, text, type = 'td', className = '', attrs = {}) {
    const cell = doc.createElement(type);
    Object.keys(attrs).forEach(k => cell.setAttribute(k, attrs[k]));
    cell.classList.add('mdc-data-table__cell');
    if (className) {
      cell.classList.add(className);
    }
    cell.append(doc.createTextNode(text));

    tr.append(cell);
  }

  addRow(rowData, onclick) {
    const tr = doc.createElement('tr');
    this.tableRows.push(tr);
    if (onclick) {
      tr.addEventListener('click', onclick);
    }
    tr.classList.add('mdc-data-table__row');
    Object.values(rowData)
      .forEach(v => {
        this.addCell(tr, v);
      });
    this.body.appendChild(tr);
  }

  setData(data, onclick) {
    if (data.length > 0) {
      this.setHeader(Object.keys(data[0]));
      this.setBody(data, onclick);
    } else {
      this.clearTable();
    }
  }

  clearTable() {
    clearNode(this.header);
    clearNode(this.body);
  }

  setState(success, errors) {
    success.forEach(s => this.setRowState(s.index, 'Correcto', s));
    errors.forEach(e => this.setRowState(e.index, 'Error', e));
  }

  setRowState(i, state, data) {
    const stateCell = this.tableRows[i].querySelector('td:nth-child(2)');

    const icon = doc.createElement('i');
    icon.classList.add('material-icons');
    icon.textContent = state === 'Error' ? 'close' : 'check';
    stateCell.textContent = '';
    stateCell.appendChild(icon);
    stateCell.appendChild(doc.createTextNode(state));
    this.tableRows[i].classList.add(state);

    if (i in this.rowHandlerFunctions) {
      this.tableRows[i].removeEventListener('click', this.rowHandlerFunctions[i]);
    }
    this.rowHandlerFunctions[i] = this.rowClickHandler(data);
    this.tableRows[i].addEventListener('click', this.rowHandlerFunctions[i]);
  }
}

class Request {

  constructor(tableRef, stateRef, data) {
    this.tableRef = tableRef;
    this.stateRef = stateRef;
    this.data = data;
  }

  do(content) {
    (async () => {
      const { errors, success } = await api.bulkSave(this.stateRef.actualEntity, content, this.stateRef.actualState === 2);
      this.tableRef.setState(success, errors);
      this.stateRef.toggleLoader(false);
    })();
  }

  start() {
    const fromList = (data) => {
      const type = data.k.substring(data.k.indexOf('.') + 1);
      if (type in lists && data.v in lists[type]) {
        let key = data.k;
        if (!data['k'].endsWith('.id')) { //TODO: Check if key with .id
          key = `${data.k}.id`; 
        }
        return { k: key, v: lists[type][data.v].toString() };
      }
      return data;
    };

    const readyData = this.data.map(d => {
      const rta = Object.entries(d)
        .filter(([k]) => k !== 'id')
        .map(([k, v]) => {
          k = k.trim().toLowerCase();
          const prefix = k.startsWith(this.stateRef.actualEntity) ? '' : `${this.stateRef.actualEntity}.`;
          let key = k.replace(/\s/g, '.');
          if (k.toLowerCase() !== `${this.stateRef.actualEntity} id`.toLowerCase()) {
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

    this.stateRef.toggleLoader(true);
    // console.log(readyData);
    this.do(readyData);
  }
}

class State {
  constructor(tableRef) {
    this.actualState = 0;
    this.actualEntity = '';
    this.data = [];
    this.tableRef = tableRef;
    this.rowClickHandler = () => { };


    btnCrear.addEventListener('click', () => this.changeState(1));
    btnEditar.addEventListener('click', () => this.changeState(2));
    selectEntities.addEventListener('change', () => this.changeEntity(selectEntities.value));
    selectFile.addEventListener('change', this.fileHandler());
    fabSend.addEventListener('click', this.send());
  }

  validateToLoad() {
    if (this.actualState !== 0 && this.actualEntity) {
      selectFileBtn.classList.remove('disabled');
      selectFile.removeAttribute('disabled');
    }
  }

  changeState(nState) {
    if (this.actualState !== nState) {
      this.actualState = nState;
      this.validateToLoad();
      // TODO: Allow same file to upload
      this.data = [];
      this.tableRef.clearTable();
    }
  }

  changeEntity(nEntity) {
    if (this.actualEntity !== nEntity) {
      this.actualEntity = nEntity;
      this.validateToLoad();
      // TODO: Allow same file to upload
      this.data = [];
      this.tableRef.clearTable();
    }
  }

  fileHandler() {
    const self = this;
    return function () {
      const file = this.files[0];

      FileParser.loadFile(file, self.actualState, (data) => {
        self.data = data;
        self.tableRef.clearTable();
        if (self.actualState === 1) {
          self.tableRef.setData(self.data.map(d => ({ id: d.id, estado: 'Pendiente' })));
        } else {
          self.tableRef.setData(self.data);
        }

        fabSend.classList.remove('hidden');
        this.files = undefined;
      });
    };
  }

  toggleLoader(toggle) {
    const functions = toggle ? ['add', 'remove'] : ['remove', 'add'];

    tableContainer.children[0].classList[functions[0]]('hidden');
    tableContainer.children[1].classList[functions[1]]('hidden');
  }

  send() {
    return () => {
      const req = new Request(this.tableRef, this, this.data);
      req.start();
    };
  }
}



// -----------------------------------


new State(new Table(tableNode));


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

const openLink = (link) => () => require('electron').shell.openExternal(link);
polyglotFooter.addEventListener('click', openLink('https://polyglot.site'));
