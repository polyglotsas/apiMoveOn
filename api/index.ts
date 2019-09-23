import { Action, Data, Entity, Method } from "./models";

const { callAPI } = require('./api');
const settings = require('../settings');

const keyPath = settings.certificate.privateKey;
const certPath = settings.certificate.certificate;


const asyncForEach = async (array: any[], cbk: (d: any, n: number, a: any[]) => any) => {
  for (let i = 0; i < array.length; i++) {
    await cbk(array[i], i, array);
  }
};

const removeKeysWithoutValue = (obj: object): object => {
  return Object.entries(obj)
    .filter(([k, v]) => v !== '')
    .reduce((o: any, e: any): object => { o[e[0]] = e[1]; return o; }, {});
};


async function getAll(entity: Entity, args: string[], page: number, rows = 50) {
  if (rows > 50) {
    throw `Max row per page is 50. Actual ${rows}`;
  }

  const postData: Data = {
    method: Method.QUEUE,
    entity: entity,
    action: Action.LIST,
    data: JSON.stringify({
      filters: JSON.stringify({ rules: [] }),
      visibleColumns: args.join(';'),
      locale: "eng",
      sidx: "person.first_name",
      sord: "asc",
      sortName: "person.first_name",
      sortOrder: "asc",
      page: page,
      rows: rows
    })
  };

  try {
    const res = await callAPI(postData, keyPath, certPath);
    if (res.rows) {
      return { data: res.rows, page: { total: res.total, actual: res.page } };
    } else {
      throw res;
    }
  } catch (error) {
    throw error;
  }
}

async function save(entity: Entity, data: object): Promise<{ data: any }> {
  const postData = {
    'method': Method.QUEUE,
    'entity': entity,
    'action': Action.SAVE,
    'data': JSON.stringify({ 'entity': entity, ...removeKeysWithoutValue(data) })
  };

  try {
    const res = await callAPI(postData, keyPath, certPath);

    if (res.id && res.id[0] !== 'nil') {
      return { data: res.id };
    } else {
      throw res;
    }
  } catch (error) {
    throw error;
  }

}

async function edit(entity: Entity, data: object): Promise<{ data: any }> {
  if (!(`${entity}.id` in data)) {
    throw "Entity has no id attribute";
  }
  return save(entity, data);
}

async function bulkSave(entity: Entity, data: object[], willEdit = false): Promise<{ errors: any[], success: any[] }> {
  const errors: { index: number, error: any, data: object }[] = [];
  const success: { index: number, data: any }[] = [];
  let functionToApply: (entity: Entity, data: object) => Promise<{ data: any }> = !willEdit ? save : edit;

  await asyncForEach(data, async (o, i) => {
    try {
      const r = await functionToApply(entity, o);
      success.push({ index: i, ...r });
    } catch (error) {
      errors.push({ index: i, error, data: o });
    }
  });

  return { errors, success };
}

module.exports = { getAll, create: save, bulkSave }
