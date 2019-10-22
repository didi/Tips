import React, { Component } from 'react';
import $ from 'jquery';
import{ Card, Spin, notification, Row, Col, Icon, Tabs } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';
import _ from 'lodash';
import './index.css';
import AddSystemModal from '../../component/AddSystemModal';
import api from '../../api';
import Utils from '../../utils';

const { TabPane } = Tabs;

class Home extends Component {

  constructor (props) {
    super(props);

    this.state = {
      systemList: [],
      loading: false,
      visible: false,
      info: {},
    };
  }

  componentDidMount () {
    this.getReload();
  }

  getReload = () => {
    this.setState({
      loading: true,
    }, () => {
      $.ajax({
        url: api.getSystemList,
        'Content-type': 'application/json',
        dataType: 'json',
        success: (res) => {
          if (res.code === 200) {
            this.setState({
              systemList: res.data ? res.data : [],
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
    });
  }

  showAddModal = () => {
    this.setState({
      visible: true,
    });
  }

  editSystemInfo = (info) => {
    this.setState({
      info,
      visible: true,
    });
  }

  onCancel = () => {
    this.setState({
      info: {},
      visible: false,
    });
  }

  render () {
    const { loading, systemList, visible, info } = this.state;
    let mySystemList = []
    if (systemList && systemList.length > 0) {
      mySystemList = _.filter(systemList, item => {
        const memberItems = _.filter(item.memberList, it => it.username && it.username.indexOf(Utils.username) > -1)
        return (item.creator && item.creator.indexOf(Utils.username) > -1) || (memberItems && memberItems.length > 0);
      });
    }
    return (
      <Spin spinning={loading}>
        <Tabs>
          <TabPane tab="我的服务" key="1">
            <Row>
              {
                _.map(mySystemList, (item, index) => {
                  const time = moment(new Date(item.createDate).valueOf()).format('YYYYMMDD HHmmss');
                  return (
                    <Col span={6} key={index}>
                      <Card
                        title={<Link to={`/detail/${item.name}`}>{item.name}</Link>}
                        className="card-plus"
                        extra={ item.creator && item.creator.indexOf(Utils.username) !== -1 ? <span onClick={() => this.editSystemInfo(item)} data-tip-id="home-1"><Icon type="edit" /></span> : <span />}
                      >
                        <div className="card-content" data-tip-id={`home-${item.name}`}>{item.description}</div>
                        <div className="card-footer">
                        <div>管理员：{item.creator.split(',').length > 1 ? `${item.creator.split(',')[0]}...` : item.creator}</div>
                        <div>{moment(time).fromNow()}</div>
                        </div>
                      </Card>
                    </Col>
                  )
                })
              }
              <Col span={6}>
                <Card className="card-plus" style={{textAlign: 'center', paddingTop: '13%'}}>
                  <span className="add-btn" onClick={this.showAddModal}>
                  <Icon type="plus-square" theme="outlined" />&nbsp;新增项目
                  </span>
                </Card>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="全部服务" key="2">
            <Row>
              {
                _.map(systemList, (item, index) => {
                  const time = moment(new Date(item.createDate).valueOf()).format('YYYYMMDD HHmmss');
                  return (
                    <Col span={6} key={index}>
                      <Card
                        title={<Link to={`/detail/${item.name}`}>{item.name}</Link>}
                        className="card-plus"
                        extra={ item.creator && item.creator.indexOf(Utils.username) !== -1 ? <span onClick={() => this.editSystemInfo(item)} data-tip-id="home-1"><Icon type="edit" /></span> : <span />}
                      >
                        <div className="card-content" data-tip-id={`home-${item.name}`}>{item.description}</div>
                          <div className="card-footer">
                          <div>管理员：{item.creator.split(',').length > 1 ? `${item.creator.split(',')[0]}...` : item.creator}</div>
                          <div>{moment(time).fromNow()}</div>
                        </div>
                      </Card>
                    </Col>
                  )
                })
              }
              <Col span={6}>
              <Card className="card-plus" style={{textAlign: 'center', paddingTop: '13%'}}>
                <span className="add-btn" onClick={this.showAddModal}>
                  <Icon type="plus-square" theme="outlined" />&nbsp;新增项目
                </span>
              </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
        <AddSystemModal
          visible={visible}
          onCancel={this.onCancel}
          url={api}
          getReload={this.getReload}
          info={info}
        />
      </Spin>
    );
  }
}

export default Home;
