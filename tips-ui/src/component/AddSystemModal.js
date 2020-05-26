import React, { Component } from 'react';
import $ from 'jquery';
import{ Modal, Form, notification, Input, Select, Icon, Row, Col } from 'antd';
import _ from 'lodash';
import Utils from '../utils';
import Conf from '../conf';

const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;
const { languageList } = Conf;

class AddSystemModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [{id: '0001', name: 'admin'}],
      memberList: this.props.info.memberList || [{lang: 'zh_CN'}],
      visibleAuto: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps, this.props)) {
      this.setState({
        memberList: nextProps.info.memberList || [{lang: 'zh_CN'}],
      });
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
       	const { url } = this.props;
       	let { memberList } = this.state;
       	memberList = _.filter(memberList, item => item.lang);
        if (memberList && memberList.length > 0) {
          this.setState({
            loading: true,
          }, () => {
            values.creator = values.creator.join(',');
            values.memberList = memberList;
            if (values.domain.indexOf('http://') > -1) {
              values.domain = values.domain.split('//')[1];
            }
            values.lastRedactor= Utils.username;
            $.ajax({
              url: url.addSystem,
              type: 'POST',
              dataType: 'json',
              data: JSON.stringify(values),
              contentType: 'application/json',
              success: (res) => {
                if (res.code === 200) {
                  notification.success({
                    message: '保存成功！'
                  });
                  this.props.onCancel();
                  this.props.getReload();
                }
              },
              error: () => {
                notification.error({
                  message: '保存失败',
                });
                this.props.onCancel();
              }
            });
          });
        } else {
          notification.error({
            message: '语言为必填项'
          });
        }
      }
    });
  }

  handleCancel = () => {
    this.props.form.resetFields();
    this.setState({
      memberList: [{}],
    });
    this.props.onCancel();
  }

  searchUser = (value) => {
    if (value && value.length > 2) {
      const { url } = this.props;
      $.ajax({
        url: `${url.searchUser}?username=${value}`,
        dataType: 'json',
        success: (res) => {
          this.setState({
            userList: res,
          });
        },
        error: () => {
          notification.error({
            message: '用户名查询失败',
          });
        }
      });
    }
  }

  addMemberItem = () => {
    const { memberList } = this.state;
    memberList.push({});
    this.setState({
      memberList,
    });
  }

  delMemberItem = (index) => {
    const { memberList } = this.state;
    if (memberList.length > 1) {
      memberList.splice(index, 1);
      this.setState({
        memberList,
      });
    }
  }

  updateMemberItem = (index, value, key) => {
    const { memberList } = this.state;
    memberList[index][key] = value;
    this.setState({
      memberList,
    });
  }

  render () {
    const { visible, info } = this.props;
    const { userList, memberList, visibleAuto } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const defaultCss = `
      .dd-tooltip-inner-title {
        background-color: #373737;
        padding: 8px 10px;
        border-radius: 6px;
      }
      .dd-tooltip-inner-content {
        background-color: #373737;
        padding: 8px 10px;
        border-radius: 6px;
      }
      .dd-tooltip-arrow-plus {
        border-color: #373737;
        display: block;
      }`;

    return (
      <Modal
        visible={visible}
        onOk={this.handleSubmit}
        onCancel={this.handleCancel}
        width={700}
      >
        <Form onSubmit={this.handleSubmit} style={{marginTop: 50, padding: '0 40px'}} className="systemInfo-form">
          <FormItem
	          {...formItemLayout}
	          label={<span>系统名<Icon type="question-circle" data-tip-id="home-name" style={{cursor: 'pointer'}} /></span>}
          >
	          {getFieldDecorator('name', {
	            rules: [{
	              message: '请输入系统名',
	            }, {
	              required: true, message: '系统名只能是由数字、英文字母、下划线、横杠组成',
                validator: (rule, value, callback) => {
                  const reg = /[a-z]|[A-Z]|[0-9]|-|_/g;
                  if (!reg.test(value)) {
                    callback('系统名只能是由数字、英文字母、下划线、横杠组成');
                  }
                  callback();
                }
	            }],
              initialValue: info.name || '',
	          })(
	            <Input disabled={info.name ? true : false} placeholder="请输入系统名" />
	          )}
	        </FormItem>
	        <FormItem
	          {...formItemLayout}
	          label={<span>域名<Icon type="question-circle" data-tip-id="home-domain" style={{cursor: 'pointer'}} /></span>}
	        >
	          {getFieldDecorator('domain', {
	            rules: [{
	              required: true, message: '请输入域名，不用以http://开头',
	            }],
	            initialValue: info.domain || '',
	          })(
	            <Input placeholder="请输入域名，不用以http://开头" />
	          )}
	        </FormItem>
	        <FormItem
	          {...formItemLayout}
	          label="描述"
	        >
	          {getFieldDecorator('description', {
	            rules: [{
	              required: false, message: '请输入描述信息',
	            }],
	            initialValue: info.description || '',
	          })(
	            <TextArea rows={2} placeholder="请输入描述信息" />
	          )}
	        </FormItem>
        	<FormItem
	          {...formItemLayout}
	          label="管理员"
	        >
	          {getFieldDecorator('creator', {
	            rules: [{
	              required: true, message: '请输入管理员名称',
	            }],
	            initialValue: info.creator ? info.creator.split(',') : [],
	          })(
	            <Select
	            	showSearch
	            	mode="multiple"
	            	placeholder="请输入管理员邮箱前缀"
	            >
	            	{
	            		userList.map(item => <Option key={item.id} value={item.name}>{item.name}</Option>)
	            	}
	            </Select>
	          )}
	        </FormItem>
	        <FormItem
	          {...formItemLayout}
	          label={<span><span style={{color: '#f5222d', fontSize: 14, fontFamily: 'SimSun'}}>* </span>多语言<Icon type="question-circle" data-tip-id="home-100" style={{cursor: 'pointer'}} /></span>}
	        >
            {
              _.map(memberList, (item, index) => {
                return (
                  <Row key={index} gutter={10}>
                    <Col span={8}>
                      <Select
                        value={item.lang}
                        showSearch
                        onChange={(value) => { this.updateMemberItem(index, value, 'lang')}}
                        placeholder="请选择语言"
                      >
                        {
                          _.map(languageList, (it, i) => <Option key={i} value={it.lang}>{it.label}</Option>)
                        }
                      </Select>
                    </Col>
                    <Col span={15}>
                      <Select
                        value={item.username ? item.username.split(',') : []}
                        showSearch
                        mode="multiple"
                        onChange={(value) => { this.updateMemberItem(index, value.join(','), 'username')}}
                        placeholder="请输入管理员名称"
                      >
                        {
                          _.map(userList, it => <Option key={it.id} value={it.name}>{it.name}</Option>)
                        }
                      </Select>
                    </Col>
                    <Col span={1}>
                      <Icon type="minus-circle" style={{color: '#f97370', cursor: memberList.length > 1 ? 'pointer' : 'not-allowed'}} onClick={ () => { this.delMemberItem(index) }} />
                    </Col>
                  </Row>
                );
              })
            }
          	<div><Icon type="plus-circle" style={{color: '#34a637', cursor: 'pointer'}} onClick={this.addMemberItem} /></div>
	        </FormItem>
          <a onClick={() => {this.setState({visibleAuto: !visibleAuto})}}>+高级自定义</a>
          {
            visibleAuto
            &&
            <div>
              <FormItem
                {...formItemLayout}
                label="容器CSS"
              >
                {getFieldDecorator('containerCss', {
                  rules: [{
                    required: false, message: '请输入容器的CSS样式代码',
                  }],
                  initialValue: info.containerCss || defaultCss,
                })(
                  <TextArea rows={6} placeholder="请输入容器的CSS样式代码" />
                )}
                <div style={{color: 'orange', lineHeight: '20px'}} data-tip-id="modal-00">只允许修改如上css类中的样式<span style={{color: 'red'}}>【不要设置位置属性】</span>，不允许修改类名，不允许新增，删除后显示本平台提供默认样式</div>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="标题显示长度"
              >
                {getFieldDecorator('titleSize', {
                  rules: [{
                    required: false, message: '请输入标题显示长度',
                  }],
                  initialValue: info.titleSize || '',
                })(
                  <Input placeholder="请输入标题显示长度，可配置标题长度超过多少个字符后显示" />
                )}
              </FormItem>
            </div>
          }
      	</Form>
      </Modal>
    );
  }
}

export default Form.create()(AddSystemModal);
