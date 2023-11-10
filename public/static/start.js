//配置坐席账号，
var extension = 'ggyy001';
//坐席密码，
var extensionpassword = 'ggyy001';
//分机所属公司id
var companyid = 50;

//fs端口
var freeswitchport = 53342;
//fs地址
var fshost = 'xcx.ldin.cc';
//fs内部地址
var fsinternal = '192.168.1.135';
//当前分机电话状态，0=未呼叫，1=正在呼叫
var iphonestatue = 0;
//是否自动接听电话
var isactiveanswer = true
//当前话机是否注册成功
var registered = false;
//页面加载后自动注册分机
var auToRegisterUsername = false;