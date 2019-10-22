import Conf from './conf';

const api = {
  getSystemList: `${Conf.host}/system/list`,
  addSystem: `${Conf.host}/system/add`,
  getSystem: `${Conf.host}/system/get`,
  getTipList: `${Conf.host}/tips/list`,
  updateTipStatus: `${Conf.host}/tips/status/update`,
  getTipListUnmack: `${Conf.host}/api/tips`,
  addTip: `${Conf.host}/api/tips/add`,
  searchUser: '/xxx',
  publish: `${Conf.host}/document/publish`,
  addDocument: `${Conf.host}/api/document/add`,
  getDocumentList: `${Conf.host}/api/document/list`,
  updateDocumentStatus: `${Conf.host}/document/status/update`,
  addTipList: `${Conf.host}/api/tips/list/add`,
  addDocList: `${Conf.host}/api/doc/list/add`,
};

export default api;
