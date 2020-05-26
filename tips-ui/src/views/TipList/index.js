import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, Breadcrumb, notification, Spin, Tabs } from 'antd';
import $ from 'jquery';
import SystemHeader from '../../component/SystemHeader';
import TipListTable from '../../component/TipListTable';
import DocumentListTable from'../../component/DocumentListTable';
import api from '../../api';

const TabPane = Tabs.TabPane;

class EditTips extends Component {
  constructor(props) {
    super(props);

    this.state = {
      system: {},
      loading: false,
      systemName: this.props.match.params.name,
      tipListOrigin: [],
      documentListOrigin: [],
      isPublish: 1, // 默认显示已发布
    }
  }

  componentDidMount () {
    this.setState({
      loading: true,
    }, () => {
      this.getSystem();
      this.getTipList();
      this.getDocumentList();
    });
  }

  getSystem () {
    const { systemName } = this.state;
    $.ajax({
      url: `${api.getSystem}?systemName=${systemName}`,
      dataType: 'json',
      success: (res) => {
        if (res.code === 200) {
          this.setState({
            system: res.data ? res.data : {},
            loading: false,
          });
        }
      },
      error: () => {
        this.setState({
          loading: false,
        }, () => {
          notification.error({
            message: '数据获取失败',
          });
        });
      },
    });
  }

  getTipList = () => {
    const { systemName } = this.state;
    this.setState({
      loading: true,
    });
    $.ajax({
      url: `${api.getTipList}?systemName=${systemName}`,
      dataType: 'json',
      success: (res) => {
        if (res.code === 200) {
          this.setState({
            tipListOrigin: res.data ? res.data : [],
            loading: false,
          });
        } else {
          this.setState({
            tipListOrigin: [],
            loading: false,
          });
        }
      },
      error: () => {
        this.setState({
          loading: false,
        }, () => {
          notification.error({
            message: '数据获取失败',
          });
        });
      }
    });
  }

  getDocumentList = () => {
  const { systemName } = this.state;
    this.setState({
      loading: true,
    });
    $.ajax({
      url: `${api.getDocumentList}?systemName=${systemName}`,
      dataType: 'json',
      success: (res) => {
        if (res.code === 200) {
          this.setState({
            documentListOrigin: res.data ? res.data.documentList : [],
            isPublish: res.data ? res.data.isPublish : 0,
            loading: false,
          });
        }
        this.setState({
          loading: false,
        });
      },
      error: () => {
        this.setState({
          loading: false,
        }, () => {
          notification.error({
            message: '数据获取失败',
          });
        });
      }
    });
  }

  updateTipList = (list) => {
    this.setState({
      tipListOrigin: list,
    });
  }

  updateDocumentList = (list) => {
    this.setState({
      documentListOrigin: list,
    });
  }

  render () {
    const { system, systemName, loading, tipListOrigin, documentListOrigin, isPublish } = this.state;
    const tipList = {}, documentList = {};
    tipListOrigin.forEach( (item) => {
      if (!tipList[item.router]) {
        tipList[item.router] = [];
      }
      tipList[item.router].push(item);
    });

    documentListOrigin.forEach( (item) => {
      if (!documentList[item.router]) {
        documentList[item.router] = [];
      }
      documentList[item.router].push(item);
    });
    return (
      <Spin spinning={loading}>
        <Card title={
            <Breadcrumb>
              <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
              <Breadcrumb.Item>{systemName}</Breadcrumb.Item>
            </Breadcrumb>
          }
        >
        <SystemHeader system={system} />
          <Tabs defaultActiveKey="1" style={{marginTop: 20}}>
            <TabPane tab="提示信息列表" key="1">
              <TipListTable
                tipList={tipList}
                tipListOrigin={tipListOrigin}
                getTipList={this.getTipList}
                systemName={systemName}
                updateTipList={this.updateTipList}
                api={api}
                system={system}
              />
            </TabPane>
            <TabPane tab="文档信息列表" key="2">
              <DocumentListTable
                documentList={documentList}
                documentListOrigin={documentListOrigin}
                getDocumentList={this.getDocumentList}
                systemName={systemName}
                updateDocumentList={this.updateDocumentList}
                api={api}
                isPublish={isPublish}
                system={system}
              />
            </TabPane>
          </Tabs>
        </Card>
      </Spin>
    );
  }
}

export default EditTips;
