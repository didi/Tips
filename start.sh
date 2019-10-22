# 启动脚本
cd docsm-sdk
npm i
npm run build
cp ../docsm-ui/public/docsm.js ../demo/static

cd ../docsm-web
npm i
npm start

cd ../demo
npm i
npm start

cd ../docsm-ui
npm i
npm start

if [[ $? -ne 0 ]]; then
  echo "启动失败"
  exit $?
fi

echo -e "启动成功"