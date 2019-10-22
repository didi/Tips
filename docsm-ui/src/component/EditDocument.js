import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input, Button, notification } from 'antd';
import $ from 'jquery';
import _ from 'lodash';
import api from '../api';
import Utils from '../utils';
import Conf from '../conf';

const FormItem = Form.Item;
const { TextArea } = Input;
const { languageList } = Conf;

class EditDocument extends Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    record: PropTypes.object,
    onCancel: PropTypes.func.isRequired,
    systemInfo: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      btnLoading: false,
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({
      btnLoading: true,
    }, () => {
      this.props.form.validateFields((errors, values) => {
        if (errors) {
          this.setState({
            btnLoading: false,
          });
          return;
        }
        const data = {
          tipType: 'doc',
          systemName: this.props.systemInfo.name,
          ...values,
          lastRedactor: Utils.username,
          isPublish: false,
        };
        $.ajax({
          url: api.addDocument,
          type: 'POST',
          dataType: 'json',
          contentType: 'application/json',
          data: JSON.stringify(data),
          success: (res) => {
            if (res.code === 200) {
              notification.success({
                message: '保存成功！'
              });
              this.handleCancel();
              this.props.getDocumentList();
            } else {
              notification.error({
                message: '提交失败！'
              });
            }
            this.setState({
              btnLoading: false,
            });
          },
          error: () => {
            notification.error({
              message: '提交失败！'
            });
            this.setState({
              btnLoading: false,
            });
          }
        });
      });
    });
  }

  handleCancel = () => {
    this.props.form.resetFields();
    this.props.onCancel();
  }

  render() {
    const { btnLoading } = this.state;
    const { visible, record, form, systemInfo } = this.props;
    const { getFieldProps } = form;
    const formItemLayout = {
      labelCol: {span: 8},
      wrapperCol: {span: 12},
    };
    const idProps = getFieldProps('id', {
      rules: [{
        required: true, message: '请填写文档id',
      }],
      initialValue: record.id,
    });
    const hrefProps = getFieldProps('router', {
      rules: [{
        required: true, message: '请填写文档所在页面的路由',
      }],
      initialValue: record.router,
    });
    let contentPropsList = [];
    let memberItems = [];
    if (systemInfo.creator && systemInfo.creator.indexOf(Utils.username) !== -1) {
      memberItems = systemInfo.memberList;
    } else if (systemInfo.memberList) {
      memberItems = _.filter(systemInfo.memberList, item => item.username && item.username.indexOf(Utils.username) > -1);
    }
    contentPropsList = _.map(memberItems, item => {
      return {
        labelName: _.find(languageList, {lang: item.lang}).label,
        contentProps: getFieldProps(`${item.lang}_content`, {
          rules: [{
            required: false, message: '请填写文档内容',
          }],
          initialValue: record[`${item.lang}_content`],
        }),
      };
    });
    return (
      <Modal
        title="编辑文档信息"
        visible={visible}
        footer={null}
        width={800}
        onCancel={this.handleCancel}
      >
      <Form horizontal="true" onSubmit={this.handleSubmit}>
        <FormItem
          label="文档Id"
          {...formItemLayout}
        >
          <Input {...idProps} placeholder="请填写提示的Id" disabled={record.id ? true : false} />
        </FormItem>
        <FormItem
          label="文档所在页面的路由"
          {...formItemLayout}
        >
          <Input {...hrefProps} placeholder="请填写文档所在页面的路由：/path" disabled={record.router ? true : false} />
        </FormItem>
        {
          _.map(contentPropsList, (item, index) => {
            return (
              <FormItem
                label={`${item.labelName}文档内容`}
                {...formItemLayout}
                key={index}
              >
                <TextArea {...item.contentProps} placeholder="请填写文档内容" />
              </FormItem>
            );
          })
        }
        <FormItem wrapperCol={{ span: 16, offset: 8 }}>
          <Button onClick={ () => { this.props.onCancel(); }}>取消</Button>
          <Button type="primary" htmlType="submit" loading={btnLoading} style={{marginLeft: 20}}>提交</Button>
        </FormItem>
      </Form>
      </Modal>
    );
  }
}

export default Form.create()(EditDocument);
