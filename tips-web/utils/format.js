exports.formatTipList = function (tipsInfo) {
  const tipList = [];
  const infoList = tipsInfo.list;
  infoList.forEach(function (item) {
    if (item.list && item.list.length > 0) {
      item.list.forEach(function (it) {
        const tip = {
          id: it.id,
          tipType: it.tipType,
          location: it.location,
          router: item.pathname,
          createDate: (new Date()).toString(),
          status: 0,
          interval: it.interval,
          lastRedactor: tipsInfo.lastRedactor,
          contentMap: {},
        };
        Object.keys(it).forEach(i => {
          if (i.indexOf('title') > -1 || i.indexOf('content') > -1) {
            tip.contentMap[i] = it[i];
          }
        });
        tipList.push(tip);
      });
    }
  });
  return tipList;
};

exports.formatDocList = function (docInfo) {
  const docList = [];
  const infoList = docInfo.list;
  infoList.forEach(function (item) {
    if (item.list && item.list.length > 0) {
      item.list.forEach(function (it) {
        const doc = {
          id: it.id,
          tipType: 'doc', // 提示类型
          status: 0,
          isPublish: false,
          router: item.pathname,
          createDate: (new Date()).toString(),
          lastRedactor: docInfo.lastRedactor,
          contentMap: {},
        };
        Object.keys(it).forEach(i => {
          if (i.indexOf('content') > -1) {
            doc.contentMap[i] = it[i];
          }
        });
        docList.push(doc);
      });
    }
  });
  return docList;
};

