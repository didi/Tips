import React, { Component } from 'react';
import { Layout, Menu, Icon, Dropdown } from 'antd';
import { Route, Switch, Redirect, Link } from 'react-router-dom';
import Home from '../views/Home';
import TipList from '../views/TipList';
import Utils from '../utils';
import './index.css';

const { Header, Content, Footer } = Layout;

class BasicLayout extends Component {

  state = {
    language: 'zh-CN',
  }

  componentDidMount() {
    try {
      const { language } = this.state;
      if (window.Tips && Object.prototype.toString.call(window.Tips.init) === '[object Function]') {
        window.Tips.init('admin', language);
      } else {
        document.addEventListener('TipsSDKReady', function() {
          window.Tips.init('admin', language);
        }, false);
      }
    } catch(e) {
      throw new Error(e);
    }
  }

  change = () => {
    try {
      const { language } = this.state;
      const currentLanguage = language === 'zh_CN' ? 'en_US' : 'zh_CN';
      this.setState({
        language: currentLanguage,
      });
      window.Tips.changeLanguage(currentLanguage);
    } catch(e) {
      throw new Error(e);
    }
  }

  render () {
    const { language } = this.state;
    const menu = (
      <Menu>
        <Menu.Item><a onClick={this.logout}>退出</a></Menu.Item>
      </Menu>
    );
    return (
      <Layout>
        <Header style={{ position: 'fixed', width: '100%', display: 'flex', zIndex: 9}}>
          <Link to="/home">
            <h2 className="logo">
              <Icon type="font-size" />&nbsp;文案管理
            </h2>
          </Link>
          <Menu
            theme="dark"
            mode="horizontal"
            style={{width: '80%'}}
            defaultSelectedKeys={['1']}
          >
            <Menu.Item key="1" className="list-item"><Link to="/home">首页</Link></Menu.Item>
            <Menu.Item key="2" className="list-item">
            <a href="http://localhost:4000/index.html" target="_blank">demo</a>
            </Menu.Item>
            <Menu.Item key="3" className="list-item">
            <span onClick={this.change}>{language === 'en_US' ? '中文' : '英文'}</span>
            </Menu.Item>
          </Menu>
          {
            Utils.username &&
            <Dropdown overlay={menu}>
              <a className="ant-dropdown-link" style={{display: 'inline-block', position: 'absolute', right: 10}}>
                <Icon type="user" />&nbsp;{Utils.username} <Icon type="down" />
              </a>
            </Dropdown>
          }
        </Header>
        <Content style={{marginTop: 64 }}>
          <div style={{ background: '#fff', padding: 24, minHeight: 'calc(100vh - 48px - 50px)' }}>
          <Switch>
            <Route path="/home" component={Home} />
            <Route path="/detail/:name" component={TipList} />
            <Redirect exact from="/" to="/home" />
          </Switch>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center', width: '100%' }}>文案管理  ©2018-{new Date().getFullYear()}</Footer>
      </Layout>
    );
  }
}

export default BasicLayout;
