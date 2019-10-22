import React, { Component } from 'react';
import _ from 'lodash';
import Conf from '../conf';

class SystemHeader extends Component {
  render () {
  const { system } = this.props;
  const { languageList } = Conf;
    return (
      <div>
        <h3><span data-tip-id="100">系统信息</span></h3>
        <div>系统名：<span>{system.name}</span></div>
        <div>域名：<span>{system.domain}</span></div>
        <div>系统描述：<span>{system.description}</span></div>
        <div>管理员：<span>{system.creator}</span></div>
        <div>语言种类：
          <span>
          {
          _.map(system.memberList, (item, index) => <span style={{paddingRight: 20}} key={index}>{_.find(languageList, {lang: item.lang}).label}{item.username ? `- ${item.username}` : ''}</span>)
          }
          </span>
        </div>
      </div>
    )
  }
}

export default SystemHeader;
