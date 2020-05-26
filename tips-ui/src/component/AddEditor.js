import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, notification } from 'antd';
import AceEditor from 'react-ace';
import $ from 'jquery';
import 'brace/mode/json'; // 语言
import 'brace/theme/github'; // 背景色
import Utils from '../utils';

class AddEditor extends Component {
  static propTypes = {
    url: PropTypes.string,
    systemInfo: PropTypes.object,
    onCancel: PropTypes.func,
    getTipList: PropTypes.func,
    visible: PropTypes.bool,
  };

  state = {
    value: '',
  }

  handleSubmit = () => {
    const { url, systemInfo } = this.props;
    const { value } = this.state;
    let list = [];
    if (value) {
      try {
        list = JSON.parse(value);
        $.ajax({
          url: url,
          type: 'POST',
          dataType: 'json',
          data: JSON.stringify({
            systemName: systemInfo.name,
            list: list,
            lastRedactor: Utils.username,
          }),
          contentType: 'application/json',
          success: (res) => {
            if (res.code === 200) {
              notification.success({
                message: '保存成功！'
              });
              this.props.onCancel();
              this.props.getTipList();
            }
          },
          error: () => {
            notification.error({
              message: '保存失败',
            });
            this.props.onCancel();
          }
        });
      } catch(e) {
        notification.error({
          message: 'JSON格式错误！',
        });
        return;
      }
    }
  }

  handleCancel = () => {
    this.props.onCancel();
  }

  onChange = (value) => {
    this.setState({
      value,
    });
  }

  render() {
    const { visible, type } = this.props;
    const { value } = this.state;
    return (
      <Modal
        title={<span>批量新增{type === 'doc' ? '【文档内容】' : '【提示内容】'}</span>}
        visible={visible}
        onOk={this.handleSubmit}
        onCancel={this.handleCancel}
        width={700}
      >
        <AceEditor
          mode="json"
          theme="github"
          onChange={this.onChange}
          value={value}
          tabSize={4}
          name="UNIQUE_ID_OF_DIV"
          editorProps={{ $blockScrolling: true }}
          fontSize={14}
          style={{ width: '100%', height: 400 }}
        />
      </Modal>
    );
  }
}

export default AddEditor;
