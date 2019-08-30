
export enum Method {
  QUEUE = 'queue',
  GET = 'get'
}

export enum Entity {
  PERSON = 'person',
  COURSE_UNIT = 'course-unit',
  DEGREE_PROGRAM = 'degree-program',
  RELATION_INSTITUTION = 'relation-institution',
  RELATION_CONTACT = 'relation-contact',
  RELATIONSHIP_CONTENT_TYPE = 'relation-content-type',
  ACADEMIC_YEAR = 'academic-year',
  SUBJECT_AREA = 'subject-area',
  FUNDING = 'funding',
  PAYMENT = 'payment'
}

export enum Action {
  LIST = 'list',
  GET = 'get',
  SAVE = 'save',
  GET_GENDER_BY_CODE = 'get-gender-id-by-code',
  GET_LANGUAGE_ID_BY_ISOCODE = 'get-language-id-by-isocode',
  GET_NATIONALITY_ID_BY_ISOCODE = 'get-nationality-id-by-isocode',
  GET_COUNTRY_ID_BY_ISOCODE = 'get-country-id-by-isocode'
}

export interface Options {
  hostname: string;
  port: number;
  path: string;
  method: string;
  key: any;
  cert: any;
  headers: {
    'Content-Type': string;
    'Content-Length': string;
  };
}

export interface Data {
  method: Method;
  entity: Entity,
  action: string,
  data: string;
}

export interface Person {
  id: number;
  surname: string;
  first_name: string;
  fullname: string;
  phone_2: string;
  title: string;
  gender: {
    id: number;
    name_eng: string;
    name_fra: string;
    name_deu: string;
    name_ita: string;
    name_spa: string;
  };
  date_of_birth: string;
}
