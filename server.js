const express = require('express');
const robot = require('robotjs');
const app = express();
const port = 4000;

// ✅ 修复：去掉引号，加上index默认页
app.use(express.static(__dirname, {
  index: ["index.html"]
}));
app.use(express.json());

// 按键接口，支持单个修饰键 或者 修饰键数组
app.post('/press', (req, res) => {
  const { key, modifier } = req.body;
  if (!key) return res.send({ ok: false, msg: "缺少按键" });
  try {
    if(modifier && modifier.length > 0){
      robot.keyTap(key, modifier);
    }else{
      robot.keyTap(key);
    }
    res.send({ ok: true, key, modifier });
  } catch (e) {
    res.send({ ok: false, msg: e.message });
  }
});

// 打字接口
app.post('/type', (req,res)=>{
  const {text} = req.body;
  robot.typeString(text);
  res.send({ok:true});
})

// 鼠标移动
app.post('/mouse/move', (req,res)=>{
  const {dx, dy} = req.body;
  const pos = robot.getMousePos();
  robot.moveMouse(pos.x + dx, pos.y + dy);
  res.send({ok:true});
})

// 鼠标点击
app.post('/mouse/click', (req,res)=>{
  const {button} = req.body;
  robot.mouseClick(button);
  res.send({ok:true});
})

// 滚轮
app.post('/mouse/scroll', (req,res)=>{
  const {delta} = req.body;
  robot.scrollMouse(delta,0);
  res.send({ok:true});
})

app.listen(port, '0.0.0.0', () => {
  console.log(`✅ 服务启动，局域网访问：http://192.168.1.136:${port}`);
});
