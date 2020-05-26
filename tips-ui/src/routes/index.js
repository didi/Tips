import React, { Component } from 'react';
import { Spin } from 'antd';
import { HashRouter as Router, Route } from 'react-router-dom';
import BasicLayout from '../layouts';
import Utils from '../utils';

class RouterApp extends Component {
	render () {
		return (
			<div>
				{
					Utils.logined
					?
					<Router>
						<Route path="/" component={BasicLayout} />
					</Router>
					:
					<Spin />
				}
			</div>
		);
	}
}

export default RouterApp;
