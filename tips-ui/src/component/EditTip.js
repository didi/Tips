import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input, Select, Radio, Button, notification, InputNumber } from 'antd';
import $ from 'jquery';
import _ from 'lodash';
import api from '../api';
import Utils from '../utils';
import Conf from '../conf';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const { languageList } = Conf;

class EditTip extends Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    record: PropTypes.object,
    onCancel: PropTypes.func.isRequired,
    systemInfo: PropTypes.object.isRequired,
    getTipList: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      btnLoading: false,
      tipType: 'tip',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.visible !== nextProps.visible) {
      this.setState({
        tipType: nextProps.record.tipType,
      });
    }
  }

  changeType = (e) => {
    this.setState({
      tipType: e.target.value,
      btnLoading: false,
    });
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
        if (values.tipType === 'pop' && values.interval === 0) {
          values.interval = 3650;
        }
        const data = {
          ...values,
          systemName: this.props.systemInfo.name,
          lastRedactor: Utils.username,
          isPublish: false,
        };
        $.ajax({
          url: api.addTip,
          type: 'POST',
          dataType: 'json',
          contentType: 'application/json',
          data: JSON.stringify(data),
          success: (res) => {
            if (res.code === 200) {
              notification.success({
              message: '保存成功！'
            });
            this.props.onCancel();
            this.props.getTipList();
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
          },
        });
      });
    });
  }

  render() {
    const { tipType, btnLoading } = this.state;
    const { visible, record, form, systemInfo } = this.props;
    const { getFieldProps } = form;
    const formItemLayout = {
      labelCol: {span: 8},
      wrapperCol: {span: 12},
    };
    const idProps = getFieldProps('id', {
      rules: [{
        required: true, message: '请填写提示id',
      }],
      initialValue: record.id,
    });
    const hrefProps = getFieldProps('router', {
      rules: [{
        required: true, message: '请填写提示所在页面的路由',
      }],
      initialValue: record.router,
    });
    const typeProps = getFieldProps('tipType', {
      rules: [{
        required: true, message: '请选择提示类型',
      }],
      initialValue: record.tipType,
      onChange: this.changeType,
    });
    const locationProps = getFieldProps('location', {
      rules: [{
        required: true, message: '请选择提示显示的位置',
      }],
      initialValue: record.location,
    });
    const intervalProps = getFieldProps('interval', {
      rules: [{
        required: tipType === 'pop' ? true : false, message: '请填写气泡弹出的周期频率',
      }],
      initialValue: record.interval === 3650 ? 0 : record.interval,
    })
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
        titleProps: getFieldProps(`${item.lang}_title`, {
          rules: [{
            required: false, message: '请填写提示标题',
          }],
          initialValue: record[`${item.lang}_title`],
        }),
        contentProps: getFieldProps(`${item.lang}_content`, {
          rules: [{
            required: false, message: '请填写提示内容',
          }],
          initialValue: record[`${item.lang}_content`],
        }),
      };
    })
    const tipLocations = {
      top: '上方',
      bottom: '下方',
      left: '左方',
      right: '右方',
    };
    const popLocations = {
      topRight: '左上方',
      topLeft: '右上方',
      bottomRight: '左下方',
      bottomLeft: '右下方',
    }
    return (
    <Modal
      title="编辑提示信息"
      visible={visible}
      footer={null}
      width={800}
      onCancel={this.props.onCancel}
    >
    <Form horizontal="true" onSubmit={this.handleSubmit}>
      <FormItem
        label="提示Id"
        {...formItemLayout}
      >
        <Input {...idProps} placeholder="请填写提示的Id" disabled={record.id ? true : false} />
      </FormItem>
      <FormItem
        label="提示所在页面的路由"
        {...formItemLayout}
      >
        <Input {...hrefProps} placeholder="请填写提示所在页面的路由：/path" disabled={record.router ? true : false} />
      </FormItem>
      <FormItem
        label="提示类型"
        {...formItemLayout}
      >
        <RadioGroup
          {...typeProps}
          disabled={record.tipType ? true : false}
        >
          <Radio value="tip">悬浮提示</Radio>
          <Radio value="pop">气泡提示</Radio>
        </RadioGroup>
      </FormItem>
      {
        _.map(contentPropsList, (item, index) => {
          return (
            <FormItem
              label={`${item.labelName}提示`}
              {...formItemLayout}
              key={index}
            >
              <Input {...item.titleProps} placeholder="请填写提示标题" />
              <TextArea {...item.contentProps} placeholder="请填写提示内容" />
            </FormItem>
          );
        })
      }
      <FormItem
        label="提示位置"
        {...formItemLayout}
      >
        <Select {...locationProps} placeholder="请选择提示显示的位置">
          {
          tipType === 'tip' ?
            Object.keys(tipLocations).map((item, index) => {
              return <Option value={item} key={index}>{tipLocations[item]}</Option>
            }) :
            Object.keys(popLocations).map((item, index) => {
              return <Option value={item} key={index}>{popLocations[item]}</Option>
            })
          }
        </Select>
      </FormItem>
      {
        tipType === 'pop'
        &&
        <FormItem
          label="气泡弹出周期"
          {...formItemLayout}
        >
          <InputNumber {...intervalProps} min={0} placeholder="请填写气泡弹出的周期频率" style={{width: 200}} />（天/次）<span style={{color: 'orange'}}>0表示只弹一次</span>
        </FormItem>
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

export default Form.create()(EditTip);
