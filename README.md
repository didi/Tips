# DocsM - DOCumentS Management platform

> [English Introduction](./README_en.md)

## DocsM是什么？
DocsM是一个静态文案管理平台。用于修改Web页面的静态文案，支持文案国际化，并提供提示信息的UI展示。它的目的是解决前端开发者频繁的静态文案修改问题，避免因为简单的文案修改而发起复杂的上线流程。
## DocsM可以做什么？
下面是一个简单的演示，展现了接入文案管理平台后你可以通过如下的方式去修改页面上的文案信息。
- 提示内容文案修改
<img src="./doc/static/tips.gif">
有权限的用户可以看到，在页面的右下角有一个开关按钮，打开按钮页面上会出现编辑的红色按钮，点开按钮即可修改提示文案信息，提交保存后刷新页面即可看到修改后的内容。同时提示信息的容器UI展示也是平台提供。

- 页面内容文案修改提示内容文案修改
<img src="./doc/static/docs.gif">
页面内容文案的修改方式和提示信息修改一样，但是不同的是多了一个发布的操作，因为页面内容要比提示的要求更严格一些，修改后会直接影响用户的直接观感。所以这里我们对线上和线下环境做了区分，未发布前只可以在线下环境看到，详情请戳[这里](./doc/onlineAndOffline)。

- 文案国际化
<img src="./doc/static/international.gif">
在demo演示中提供了中文和英文两个版本的语言，点击按钮可以看到不同语言内容的切换。

## 如何查看demo
- 安装node环境，版本v8及已上
- 安装数据库mongodb，版本v4
- 创建 `docsm` 数据库
- 启动项目：`sh start.sh`
- 在浏览器打开localhost:8090 ---> 点击新增项目 ---> 创建项目，系统名：docsm，多语言：中文和英文，提交保存 ---> 点击导航栏的demo，跳到demo页可进行文案修改

## 如何部署使用

### 部署

#### docsm-web 

- 简单介绍：该模块是一个简单的Web层，提供文案数据的增删改查接口，即所有的UI操作接口都调用这里。在上面有提到有权限的用户才可以直接对文案进行编辑，所以平台涉及到权限控制的地方都需要用户信息，这里由于每个公司机构关于用户信息的管理都有自己的一套机制，所以需要使用者单独实现。实现完成后将服务部署即可。
- 部署
- 第一步：修改`docsm-web/src/config/index.js`中的MongoDB数据地址，和真实服务的端口；
- 第二步：将服务部署；
- 第三步：启动服务，`npm run start`;
#### docsm-ui
- 简单介绍：该模块为管理前端模块，在这里对接入平台的文案信息进行管理。同样也需要调用Web层的关于用户信息操作的接口，这部分需要自己单独实现。
- 部署
- 第一步：打包，`npm run build`；
- 第二步：将打包后的静态文件部署至nginx或其它静态文件服务；
#### docsm-sdk
- 简单介绍：该模块是用webpack管理的一个`js SDK`，我们在上面图片中看到的关于修改文案的操作都在此模块实现，该模块打包后的文件最终以CDN服务的形式引用在接入平台中。
- 部署
- 第一步：修改`docsm-sdk/src/config/index.js`中的server地址，改为`docsm-web`服务的地址；
- 第二步：我们使用webpack对SDK进行管理，在`webpack.config.js`文件中写了打包后的路径，你只用去修改里面的路径，即可打包至你自己的目录；
- 第三步：将打包后的sdk进行部署到CDN服务；
### 使用
当上面的部署流程都完成，服务可以正常访问后，我们就可以让需要文案管理的服务接入使用了。
#### 第一步：创建接入系统

在文案管理平台创建要接入平台的服务信息，如下图所示：
<img src="./doc/static/createSystem.png">

表单字段解释：

- 系统名：要接入的系统的唯一标识；
- 域名：要接入系统的线上域名；
- 管理员：可以对系统文案进行修改的成员；
- 多语言：创建系统需要支持的语言版本，每个语言可以设置不同的管理员；

#### 第二步：引用SDK

在接入系统中引入SDK文件，并设置在创建系统时填写的系统名，放在<head>中（存在文档修改，为了避免页面空白，如果系统中不使用文档修改功能，可以不放在<head>中）。代码如下：
```
<script type="text/javascript" data-service="xxx" src="/docsm.js"></script>
```
参数解释：
- `data-service`：此处传入第一步创建时填写的系统唯一标识；
- `src`：此处地址为`docsm-sdk`打包后静态文件的部署地址；

#### 第三步：调用SDK

在接入系统的前端代码中调用初始化函数，传入当前系统登录用户名和语言类型，代码如下：
```
try {
  if (window.DocsM && Object.prototype.toString.call(window.DocsM.init) === '[object Function]') {
    window.DocsM.init(username, language);
  } else {
    document.addEventListener("DocsMSDKReady", function() {
      window.DocsM.init(username, language);
    }, false);
  }
} catch(e) {
  console.log(e);
}
```
可选语言的标识：
| 语言 | key |
| :------| :------ |
| 中文（中国）| zh_CN |
| 英文（澳新）| en_US |
| 日文 |  ja_JP |
| 西班牙文（墨西哥）|  es_MX |
| 葡萄牙文（巴西）| pt_BR |

#### 第四步：埋点

在接入系统的前端代码中埋点，以前端页面路由为维度，每个路由下埋点的id不能重复。
```
<span data-tip-id="demo-1" class="btn">按钮</span>
<span data-tip-id="demo-2">docsm是一个静态文案管理系统。用于修改Web端页面的静态文案，支持文案国际化，并提供提示信息的UI展示。</span>
```
#### 第五步：切换语言

调用切换语言代码如下：
```
try {
  window.DocsM.changeLanguage(language);
} catch(e) {
  console.log(e);
}
```
已上涉及到代码的都可查看[demo](./demo/static/index.html)中如何使用,其它一些附加功能请看[这里](./doc/otherFUnc.md)
