// 云函数入口文件
const cloud = require('wx-server-sdk')
/**
 * 小程序客服消息自动回复文件
 * 
 */
cloud.init()
const db = cloud.database();
const $ = db.command.aggregate

const Value1 = '查询所有用户';
const Value2 = '清除我生成的密码';
const Value3 = '全部访问记录';
const Value4 = '全部登录次数';
const Value5 = '密码';
const Value6 = '网速测试工具';
const Value7 = '清除剩余用户';
const Value8 = '查询剩余用户';
const Value9 = '帮助';
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  if (fuzzyQuery(Value1, event.Content) || event.Content == '1') {
    let data = await db.collection("loginLog").aggregate()
      .group({
        _id: '$public',
        num: $.sum(1)
      })
      .end()
    let count_vip = 0
    let count_pt = 0;
    if (data.list.length > 0) {
      data.list.forEach(function (v) {
        if (v._id) {
          count_vip = v.num;
        } else {
          count_pt = v.num
        }
      })
    }
    await sendMessage('共有高级用户：' + count_vip + '位和普通用户：' + count_pt + '位', event.Content)
  } else if (fuzzyQuery(Value2, event.Content) || event.Content == '2') {
    let data = await db.collection("user").where({
      _openid: wxContext.OPENID
    }).remove()
    await sendMessage('已经清除您生成的' + data.stats.removed + '条登录密码', event.Content)
  } else if (fuzzyQuery(Value3, event.Content) || event.Content == '3') {
    await sendMessage('暂时没有记录', event.Content)
  } else if (fuzzyQuery(Value4, event.Content) || event.Content == '4') {
    let data = await db.collection("loginLog").get();
    let count = 0;
    data.data.forEach(function (v) {
      count += v.loginCount
    })
    await sendMessage('所有人总共登录次数为：' + count + '次', event.Content)
  } else if (fuzzyQuery(Value5, event.Content) || event.Content == '5') {
    let time = new Date()
    time.setHours(time.getHours() + 8);
    let ft = formatTimeDay(time);
    let rd = Math.floor((Math.random() * 9 + 1) * 100000);
    let public = Math.floor(Math.random() * 2) == 0 ? true : false
    let data = await db.collection("user").where({
      isUse: true
    }).get()
    if (data.data.length <= 5) {
      await db.collection("user").add({
        data: {
          public: public,
          pwd: rd,
          isUse: true,
          _openid: wxContext.OPENID,
          createtime: ft
        }
      })
      await sendMessage('当前登录密码：' + rd, event.Content)
    } else {
      let bj = Math.floor(Math.random() * data.data.length)
      await sendMessage('当前登录密码：' + data.data[bj].pwd, event.Content)
    }
  } else if (fuzzyQuery(Value6, event.Content) || event.Content == '6') {
    let data = await cloud.callFunction({
      name: 'getData',
      data: {
        NODEJS: 0
      }
    })
    if (data.errMsg == "callFunction:ok") {
      if (data.result.errmsg == "ok") {
        let pdata = JSON.parse(data.result.resp_data)
        await sendMessage("《网速测试工具》当前测试次数：" + pdata.countnetdata.total + " 次，当前访问人数： " + pdata.countuser.total + "  人。", event.Content);
      }
    }
  } else if (fuzzyQuery(Value7, event.Content) || event.Content == '7') {
    let data = await db.collection("user").where({
      isUse: true
    }).remove()
    await sendMessage('已经清除' + data.stats.removed + '条可登录，但是未使用的密码', event.Content)
  } else if (fuzzyQuery(Value8, event.Content) || event.Content == '8') {
    let data = await db.collection("user").where({
      isUse: true
    }).count()
    await sendMessage('当前有' + data.total + '条未使用的密码', event.Content)
  } else if (fuzzyQuery(Value9, event.Content) || event.Content == '9' || event.Content == '') {
    let help = [];
    help.push('回复对应数字，进行操作！！');
    help.push('1、' + Value1);
    help.push('2、' + Value2);
    help.push('3、' + Value3);
    help.push('4、' + Value4);
    help.push('5、' + Value5);
    help.push('6、' + Value6);
    help.push('7、' + Value7);
    help.push('8、' + Value8);
    let sendText = JSON.stringify(help)
    for (let i = 0; i < 20; i++) {
      sendText = sendText.replace('"', '').replace('[', '').replace(']', '').replace('，', '')
    }
    await send(sendText)
  } else {
    let 名言 = 随便取一句(名人名言)
    await send(名言)
  }
  return 'success'
}

//发送消息不存库
async function send(content) {
  const wxContext = cloud.getWXContext()
  await cloud.openapi.customerServiceMessage.send({
    touser: wxContext.OPENID,
    msgtype: 'text',
    text: {
      content: content,
    },
  })
}

//发送的记录存数据库
async function sendMessage(content, text) {
  const wxContext = cloud.getWXContext()
  await cloud.openapi.customerServiceMessage.send({
    touser: wxContext.OPENID,
    msgtype: 'text',
    text: {
      content: content,
    },
  })
  let time = new Date()
  time.setHours(time.getHours() + 8);
  let ft = formatTimeDay(time);
  await db.collection('message').add({
    data: {
      _openid: wxContext.OPENID,
      createTime: ft,
      sendMessage: content,
      setMessage: text,
    }
  })
}

//字段匹配
function fuzzyQuery(storageValue, keyWord) {
  if (keyWord.match(storageValue) != null) {
    return true
  }
  return false;
}


function 随便取一句(列表) {
  let 坐标 = Math.floor(Math.random() * 列表.length);
  return 列表[坐标];
}

let 名人名言 = [
  "伏尔泰曾经说过，不经巨大的困难，不会有伟大的事业。",
  "富勒曾经说过，苦难磨炼一些人，也毁灭另一些人。",
  "文森特·皮尔曾经说过，改变你的想法，你就改变了自己的世界。",
  "拿破仑·希尔曾经说过，不要等待，时机永远不会恰到好处。",
  "塞涅卡曾经说过，生命如同寓言，其价值不在与长短，而在与内容。",
  "奥普拉·温弗瑞曾经说过，你相信什么，你就成为什么样的人。",
  "吕凯特曾经说过，生命不可能有两次，但许多人连一次也不善于度过。",
  "莎士比亚曾经说过，人的一生是短的，但如果卑劣地过这一生，就太长了。",
  "笛卡儿曾经说过，我的努力求学没有得到别的好处，只不过是愈来愈发觉自己的无知。",
  "左拉曾经说过，生活的道路一旦选定，就要勇敢地走到底，决不回头。",
  "米歇潘曾经说过，生命是一条艰险的峡谷，只有勇敢的人才能通过。",
  "吉姆·罗恩曾经说过，要么你主宰生活，要么你被生活主宰。",
  "日本谚语曾经说过，不幸可能成为通向幸福的桥梁。",
  "海贝尔曾经说过，人生就是学校。在那里，与其说好的教师是幸福，不如说好的教师是不幸。",
  "杰纳勒尔·乔治·S·巴顿曾经说过，接受挑战，就可以享受胜利的喜悦。",
  "德谟克利特曾经说过，节制使快乐增加并使享受加强。",
  "裴斯泰洛齐曾经说过，今天应做的事没有做，明天再早也是耽误了。",
  "歌德曾经说过，决定一个人的一生，以及整个命运的，只是一瞬之间。",
  "卡耐基曾经说过，一个不注意小事情的人，永远不会成就大事业。",
  "卢梭曾经说过，浪费时间是一桩大罪过。",
  "康德曾经说过，既然我已经踏上这条道路，那么，任何东西都不应妨碍我沿着这条路走下去。",
  "克劳斯·莫瑟爵士曾经说过，教育需要花费钱，而无知也是一样。",
  "伏尔泰曾经说过，坚持意志伟大的事业需要始终不渝的精神。",
  "亚伯拉罕·林肯曾经说过，你活了多少岁不算什么，重要的是你是如何度过这些岁月的。",
  "韩非曾经说过，内外相应，言行相称。",
  "富兰克林曾经说过，你热爱生命吗？那么别浪费时间，因为时间是组成生命的材料。",
  "马尔顿曾经说过，坚强的信心，能使平凡的人做出惊人的事业。",
  "笛卡儿曾经说过，读一切好书，就是和许多高尚的人谈话。",
  "塞涅卡曾经说过，真正的人生，只有在经过艰难卓绝的斗争之后才能实现。",
  "易卜生曾经说过，伟大的事业，需要决心，能力，组织和责任感。",
  "歌德曾经说过，没有人事先了解自己到底有多大的力量，直到他试过以后才知道。",
  "达尔文曾经说过，敢于浪费哪怕一个钟头时间的人，说明他还不懂得珍惜生命的全部价值。",
  "佚名曾经说过，感激每一个新的挑战，因为它会锻造你的意志和品格。",
  "奥斯特洛夫斯基曾经说过，共同的事业，共同的斗争，可以使人们产生忍受一切的力量。",
  "苏轼曾经说过，古之立大事者，不惟有超世之才，亦必有坚忍不拔之志。",
  "王阳明曾经说过，故立志者，为学之心也；为学者，立志之事也。",
  "歌德曾经说过，读一本好书，就如同和一个高尚的人在交谈。",
  "乌申斯基曾经说过，学习是劳动，是充满思想的劳动。",
  "别林斯基曾经说过，好的书籍是最贵重的珍宝。",
  "富兰克林曾经说过，读书是易事，思索是难事，但两者缺一，便全无用处。",
  "鲁巴金曾经说过，读书是在别人思想的帮助下，建立起自己的思想。",
  "培根曾经说过，合理安排时间，就等于节约时间。",
  "屠格涅夫曾经说过，你想成为幸福的人吗？但愿你首先学会吃得起苦。",
  "莎士比亚曾经说过，抛弃时间的人，时间也抛弃他。",
  "叔本华曾经说过，普通人只想到如何度过时间，有才能的人设法利用时间。",
  "博曾经说过，一次失败，只是证明我们成功的决心还够坚强。 ",
  "拉罗什夫科曾经说过，取得成就时坚持不懈，要比遭到失败时顽强不屈更重要。",
  "莎士比亚曾经说过，人的一生是短的，但如果卑劣地过这一生，就太长了。",
  "俾斯麦曾经说过，失败是坚忍的最后考验。",
  "池田大作曾经说过，不要回避苦恼和困难，挺起身来向它挑战，进而克服它。",
  "莎士比亚曾经说过，那脑袋里的智慧，就像打火石里的火花一样，不去打它是不肯出来的。",
  "希腊曾经说过，最困难的事情就是认识自己。",
  "黑塞曾经说过，有勇气承担命运这才是英雄好汉。",
  "非洲曾经说过，最灵繁的人也看不见自己的背脊。",
  "培根曾经说过，阅读使人充实，会谈使人敏捷，写作使人精确。",
  "斯宾诺莎曾经说过，最大的骄傲于最大的自卑都表示心灵的最软弱无力。",
  "西班牙曾经说过，自知之明是最难得的知识。",
  "塞内加曾经说过，勇气通往天堂，怯懦通往地狱。",
  "赫尔普斯曾经说过，有时候读书是一种巧妙地避开思考的方法。",
  "笛卡儿曾经说过，阅读一切好书如同和过去最杰出的人谈话。",
  "邓拓曾经说过，越是没有本领的就越加自命不凡。",
  "爱尔兰曾经说过，越是无能的人，越喜欢挑剔别人的错儿。",
  "老子曾经说过，知人者智，自知者明。胜人者有力，自胜者强。",
  "歌德曾经说过，意志坚强的人能把世界放在手中像泥块一样任意揉捏。",
  "迈克尔·F·斯特利曾经说过，最具挑战性的挑战莫过于提升自我。",
  "爱迪生曾经说过，失败也是我需要的，它和成功对我一样有价值。",
  "罗素·贝克曾经说过，一个人即使已登上顶峰，也仍要自强不息。",
  "马云曾经说过，最大的挑战和突破在于用人，而用人最大的突破在于信任人。",
  "雷锋曾经说过，自己活着，就是为了使别人过得更美好。",
  "布尔沃曾经说过，要掌握书，莫被书掌握；要为生而读，莫为读而生。",
  "培根曾经说过，要知道对好事的称颂过于夸大，也会招来人们的反感轻蔑和嫉妒。",
  "莫扎特曾经说过，谁和我一样用功，谁就会和我一样成功。",
  "马克思曾经说过，一切节省，归根到底都归结为时间的节省。",
  "莎士比亚曾经说过，意志命运往往背道而驰，决心到最后会全部推倒。",
  "卡莱尔曾经说过，过去一切时代的精华尽在书中。",
  "培根曾经说过，深窥自己的心，而后发觉一切的奇迹在你自己。",
  "罗曼·罗兰曾经说过，只有把抱怨环境的心情，化为上进的力量，才是成功的保证。",
  "孔子曾经说过，知之者不如好之者，好之者不如乐之者。",
  "达·芬奇曾经说过，大胆和坚定的决心能够抵得上武器的精良。",
  "叔本华曾经说过，意志是一个强壮的盲人，倚靠在明眼的跛子肩上。",
  "黑格尔曾经说过，只有永远躺在泥坑里的人，才不会再掉进坑里。",
  "普列姆昌德曾经说过，希望的灯一旦熄灭，生活刹那间变成了一片黑暗。",
  "维龙曾经说过，要成功不需要什么特别的才能，只要把你能做的小事做得好就行了。",
  "郭沫若曾经说过，形成天才的决定因素应该是勤奋。",
  "洛克曾经说过，学到很多东西的诀窍，就是一下子不要学很多。",
  "西班牙曾经说过，自己的鞋子，自己知道紧在哪里。",
  "拉罗什福科曾经说过，我们唯一不会改正的缺点是软弱。",
  "亚伯拉罕·林肯曾经说过，我这个人走得很慢，但是我从不后退。",
  "美华纳曾经说过，勿问成功的秘诀为何，且尽全力做你应该做的事吧。",
  "俾斯麦曾经说过，对于不屈不挠的人来说，没有失败这回事。",
  "阿卜·日·法拉兹曾经说过，学问是异常珍贵的东西，从任何源泉吸收都不可耻。",
  "白哲特曾经说过，坚强的信念能赢得强者的心，并使他们变得更坚强。 ",
  "查尔斯·史考伯曾经说过，一个人几乎可以在任何他怀有无限热忱的事情上成功。 ",
  "贝多芬曾经说过，卓越的人一大优点是：在不利与艰难的遭遇里百折不饶。",
  "莎士比亚曾经说过，本来无望的事，大胆尝试，往往能成功。",
  "卡耐基曾经说过，我们若已接受最坏的，就再没有什么损失。",
  "德国曾经说过，只有在人群中间，才能认识自己。",
  "史美尔斯曾经说过，书籍把我们引入最美好的社会，使我们认识各个时代的伟大智者。",
  "冯学峰曾经说过，当一个人用工作去迎接光明，光明很快就会来照耀着他。",
  "吉格·金克拉曾经说过，如果你能做梦，你就能实现它。",
]





//生成日期格式
const formatTimeDay = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}