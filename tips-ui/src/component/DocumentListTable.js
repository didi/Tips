import React, { Component } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import moment from 'moment';
import { Table, Button, Popconfirm, notification} from 'antd';
import _ from 'lodash';
import Utils from '../utils';
import EditDocument from './EditDocument';
import AddEditor from './AddEditor';
import Conf from '../conf';
import api from '../api';

const { languageList } = Conf;

class DocumentListTable extends Component {

  static propTypes = {
    updateDocumentList: PropTypes.func,
  };

  state = {
    visible: false,
    record: {},
    editorVisible: false,
  };

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

  handleUpdate = (record) => {
    const { systemName, api, documentListOrigin } = this.props;
    $.ajax({
      url: api.updateDocumentStatus,
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify({
        systemName: systemName,
        id: record.id,
        tipType: 'doc',
        router: record.router,
        lastRedactor: Utils.username,
      }),
      contentType: 'application/json',
      success: (res) => {
        if (res.code === 200) {
          for (let i = 0; i < documentListOrigin.length; i++) {
            if (documentListOrigin[i].id === record.id &&
              documentListOrigin[i].router === record.router) {
              if (documentListOrigin[i].status === 0) {
                documentListOrigin[i].status = 1;
              } else {
                documentListOrigin[i].status = 0;
              }
              break;
            }
          }
          this.props.updateDocumentList(documentListOrigin);
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

  publishDocument = () => {
  const { systemName, api } = this.props;
    $.ajax({
      url: api.publish,
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify({
        systemName: systemName,
        lastRedactor: Utils.username,
      }),
      contentType: 'application/json',
      success: (res) => {
        if (res.code === 200) {
          this.props.getDocumentList();
          notification.success({
            message: '发布成功！'
          });
        } else {
          notification.error({
            message: '发布失败！'
          });
        }
      },
        error: () => {
        notification.error({
          message: '发布失败！'
        });
      }
    });
  }

  expandedRowRender = (record) => {
    const columns = [
      {
        title: '语言',
        dataIndex: 'lang',
      },
      {
        title: '内容',
        dataIndex: 'content',
      },
    ];
    const contentData = [];
    Object.keys(record).forEach(item => {
      const obj = _.find(languageList, {lang: item.split('_content')[0]});
      if (obj) {
        contentData.push({
          lang: obj.label,
          content: record[item],
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
    const { documentList, getDocumentList, isPublish, system, documentListOrigin } = this.props;
    const { visible, record, editorVisible } = this.state;
    const columns = [
      {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '语言种类',
        key: 'languageType',
        render: (record) => {
          const labelList = [];
          Object.keys(record).forEach((item) => {
            const obj = _.find(languageList, {lang: item.split('_content')[0]});
            if (obj) {
              labelList.push(obj.label);
            }
          });
          return <span>{labelList.join(',')}</span>
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
      },
      {
        title: '状态',
        dataIndex: 'isPublish',
        key: 'isPublish',
        render: (value) => {
          if (value === false) {
            return <span style={{color: 'orange'}}>未发布</span>
          } else {
            return <span style={{color: '#64e291'}}>已发布</span>
          }
        },
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
      <div className="document-table">
        <div style={{margin: '20px 0', display: 'flex', justifyContent: 'space-between'}}>
          <div>
            {
              memberItems.length > 0 &&
              <div>
                <Button type="primary" onClick={this.showEdit}>新增</Button>
                <Button type="primary" onClick={this.showAddEditor} style={{marginLeft: 20}}>批量新增</Button>
              </div>
            }
          </div>
          <div>
            {
              (system.creator && system.creator.indexOf(Utils.username) !== -1 && documentListOrigin.length > 0)
              &&
              <Popconfirm
                placement="topRight"
                title="点击发布后修改的内容会同步到线上环境，发布之前请确认已在线下环境确认过是否符合预期"
                onConfirm={this.publishDocument}
                okText="发布"
                cancelText="取消"
                style={{maxWidth: 300}}
              >
                <Button
                  style={{backgroundColor: 'rgb(255, 205, 60)', border: 0, color: '#fff'}}
                  disabled={isPublish}
                >
                  发布
                </Button>
              </Popconfirm>
            }
            {
              (documentListOrigin.length > 0 && !isPublish)
              && <span style={{color: 'rgb(255, 205, 60)', paddingLeft: 10}}>存在未发布内容，管理员可进行发布</span>
            }
          </div>
        </div>
        {
          documentListOrigin.length > 0
          ?
          Object.keys(documentList).map((item, index) => {
            return (
              <div key={index}>
                <h2>{item}</h2>
                <Table
                  columns={columns}
                  dataSource={documentList[item]}
                  rowKey={ record => record.id + record.router}
                  expandedRowRender={this.expandedRowRender}
                />
              </div>
            );
          })
        :
        '暂无文案信息'
        }
        <EditDocument
          record={record}
          visible={visible}
          getDocumentList={getDocumentList}
          systemInfo={system}
          onCancel={this.onCancel}
        />
        <AddEditor
          visible={editorVisible}
          getTipList={getDocumentList}
          systemInfo={system}
          onCancel={this.onCancel}
          url={api.addDocList}
          type="doc"
        />
      </div>
    );
  }
}

export default DocumentListTable;

