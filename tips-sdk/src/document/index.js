import Utils from '../utils';
import Config from '../config';

class Document {
  // 插入文案
  setDocument(elem, documentId, data) {
    if (elem && elem.getAttribute('doc-tag') !== (`${Config.language}-${documentId}`) && data && data.content) {
      elem.setAttribute('doc-tag', `${Config.language}-${documentId}`);
      const content = data.content;
      elem.innerHTML = Utils.filterTag(content);
    }
  }
}

export default new Document();
