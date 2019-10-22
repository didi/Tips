### Batch add
If you feel that manual input one by one is too cumbersome, you can try adding features in batches.

The new batch functions are divided into prompt content addition and document content addition. The corresponding JSON body is filled in the input box. In the JSON structure, the prefix corresponding to title and content is language. The specific prefix is as follows. Fill in according to the language you need.

#### Tips content adding JSON structure in batch:
```
[
  {
    "pathname": "/home", // 提示所在页面路由
    "list": [
      {
        "id": "home-1", // 埋点对应的id
        "tipType": "tip", // 悬浮提示
        "location": "top", // 显示位置，位置可以是top,left,bottom,right
        "zh_CN_title": "", // 提示标题，非必填
        "zh_CN_content": "编辑" // 提示主题内容必填
      },
      {
        "id": "home-1", // 埋点对应的id
        "tipType": "pop", // 气泡提示
        "location": "topRight", // 显示位置，位置可以是topRight,topLeft,bottomLeft,bottomRight
        "zh_CN_title": "编辑", // 气泡标题
        "zh_CN_content": "修改系统信息" // 气泡内容
      }
    ]
  }
]
```
#### Document content adding JSON structure in batch:
```
[
  {
    "pathname": "/home", // 提示所在页面路由
    "list": [
      {
        "id": "home-1", // 埋点对应的id
        "zh_CN_content": "提示管理" // 文档内容
      }
    ]
  }
]
```

