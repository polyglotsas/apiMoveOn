import { Action, Data, Entity, Method } from "./models";

const { callAPI } = require('./api');
const settings = require('../settings');

const keyPath = settings.certificate.privateKey;
const certPath = settings.certificate.certificate;


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
    'data': JSON.stringify({ 'entity': entity, ...data })
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

async function bulkSave(entity: Entity, data: object[], willEdit = false) {
  const errors: { error: any, data: object }[] = [];
  const success: { data: any }[] = [];
  let functionToApply: (entity: Entity, data: object) => Promise<{ data: any }> = !willEdit ? save : edit;

  data.forEach(async o => {
    try {
      const r = await functionToApply(entity, o);
      success.push(r);
    } catch (error) {
      errors.push({ error, data: o });
    }
  });
  return { errors, success };
}

module.exports = { getAll, create: save, bulkCreate: bulkSave }
