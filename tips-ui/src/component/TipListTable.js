import React, { Component } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import moment from 'moment';
import { Table, Button, Popconfirm, notification} from 'antd';
import _ from 'lodash';
import Utils from '../utils';
import EditTip from './EditTip';
import AddEditor from './AddEditor';
import Conf from '../conf';
import api from '../api';

const { languageList } = Conf;

const locations = {
  topRight: '左上方',
  bottomRight: '左下方',
  topLeft: '右上方',
  bottomLeft: '右下方',
  top: '上方',
  bottom: '下方',
  left: '左方',
  right: '右方',
};

const tipTypes = {
  tip: '悬浮',
  pop: '气泡',
};

class TipListTable extends Component {

  static propTypes = {
    updateTipList: PropTypes.func,
  };

  state = {
    visible: false,
    editorVisible: false,
    record: {},
  };

  handleUpdate = (record) => {
    const { systemName, api, tipListOrigin } = this.props;
    $.ajax({
      url: api.updateTipStatus,
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify({
        systemName: systemName,
        id: record.id,
        tipType: record.tipType,
        router: record.router,
        lastRedactor: Utils.username,
      }),
      contentType: 'application/json',
      success: (res) => {
        if (res.code === 200) {
          for (let i = 0; i < tipListOrigin.length; i++) {
            if (tipListOrigin[i].id === record.id &&
              tipListOrigin[i].router === record.router &&
              record.tipType === tipListOrigin[i].tipType) {
              if (tipListOrigin[i].status === 0) {
                tipListOrigin[i].status = 1;
              } else {
                tipListOrigin[i].status = 0;
              }
              break;
            }
          }
          this.props.updateTipList(tipListOrigin);
          notification.success({
            message: '状态修改成功！'
          });
        } else {
          notification.error({
            message: '状态修改失败！'
          });
        }
      },
      error: () => {
        notification.error({
          message: '状态修改失败！'
        });
      }
    });
  }

  showEdit = (record) => {
    if (record) {
      this.setState({
        visible: true,
        record,
      });
    } else {
      this.setState({
        visible: true,
      });
    }
  }

  onCancel = () => {
    this.setState({
      visible: false,
      editorVisible: false,
    });
  }

  expandedRowRender = (record) => {
    const columns = [
      {
        title: '语言',
        dataIndex: 'lang',
        width: 200,
      },
      {
        title: '标题',
        dataIndex: 'title',
        width: 500,
      },
      {
        title: '内容',
        dataIndex: 'content',
      },
    ];
    const contentData = [];
    Object.keys(record).forEach(item => {
      const obj = _.find(languageList, {lang: `${item.split('_content')[0]}`}) || _.find(languageList, {lang: `${item.split('_title')[0]}`});
      if (obj && !_.find(contentData, {lang: obj.label})) {
        contentData.push({
          lang: obj.label,
          content: record[`${obj.lang}_content`],
          title: record[`${obj.lang}_title`],
        });
      }
    });
    return (
      <Table
        columns={columns}
        dataSource={contentData}
        pagination={false}
        rowKey={ record => record.lang}
      />
    );
  }

  showAddEditor = () => {
    this.setState({
      editorVisible: true,
    });
  }

  render() {
    const { tipList, getTipList, system } = this.props;
    const { visible, record, editorVisible } = this.state;
    const columns = [
      {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '类型',
        dataIndex: 'tipType',
        width: 80,
        key: 'tipType',
        render: (value) => {
          return tipTypes[value];
        },
      },
      {
        title: '位置',
        dataIndex: 'location',
        key: 'location',
        width: 100,
        render: (key) => {
          return locations[key];
        },
      },
      {
        title: '最后修改时间',
        dataIndex: 'createDate',
        key: 'createDate',
        render: (text) => {
          return text ? moment(new Date(text).valueOf()).format('YYYY-MM-DD HH:mm:ss') : '';
        },
      },
      {
        title: '最后修改人',
        dataIndex: 'lastRedactor',
        key: 'lastRedactor',
      }
    ];
    let memberItems = [];
    if (system.creator && system.creator.indexOf(Utils.username) !== -1) {
      memberItems = system.memberList;
    } else if (system.memberList) {
      memberItems = _.filter(system.memberList, item => item.username && item.username.indexOf(Utils.username) > -1);
    }
    if (memberItems.length > 0) {
      columns.push({
        title: '操作',
        width: 150,
        render: (record) => {
          const { status } = record;
          return (
            <div>
              <Popconfirm title={status === 0 ? '确定要屏蔽吗？' : '确定要取消屏蔽吗？'} onConfirm={() => this.handleUpdate(record)}>
                <a>{status === 0 ? '屏蔽' : '取消屏蔽'}</a> |&nbsp;
              </Popconfirm>
              <a onClick={ () => { this.showEdit(record); }}>修改</a>
            </div>
          );
        },
      });
    }
    return (
      <div style={{marginTop: 20}}>
        <div style={{margin: '20px 0'}}>
          {memberItems.length > 0 && <Button type="primary" onClick={this.showEdit}>新增</Button>}
          {memberItems.length > 0 && <Button type="primary" onClick={this.showAddEditor} style={{marginLeft: 20}}>批量新增</Button>}
        </div>
        {
          Object.keys(tipList).length > 0
          ?
          Object.keys(tipList).filter(item => item && item !== 'undefined').map((item, index) => {
            return (
              <div key={index}>
                <h2>{item}</h2>
                <Table
                  columns={columns}
                  dataSource={tipList[item]}
                  rowKey={ record => record.id + record.router + record.tipType}
                  expandedRowRender={this.expandedRowRender}
                />
              </div>
            );
          })
          :
          '暂无提示信息'
        }
        <EditTip
          record={record}
          visible={visible}
          getTipList={getTipList}
          systemInfo={system}
          onCancel={this.onCancel}
        />
        <AddEditor
          visible={editorVisible}
          getTipList={getTipList}
          systemInfo={system}
          onCancel={this.onCancel}
          url={api.addTipList}
          type="tip"
        />
      </div>
    );
  }
}

export default TipListTable;
