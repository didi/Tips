# 启动脚本
cd tips-sdk
npm i
npm run build
cp ../tips-ui/public/tips.js ../demo/static

cd ../tips-web
npm i
npm start

cd ../demo
npm i
npm start

cd ../tips-ui
npm i
npm start

if [[ $? -ne 0 ]]; then
  echo "启动失败"
  exit $?
fi

echo -e "启动成功"