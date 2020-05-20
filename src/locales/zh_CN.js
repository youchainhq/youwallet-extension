import _ from "lodash";
_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

const zh_CN = {
  "key":"zh",
  "language":"语言",
  "create":"创建",
  "import":"导入",
  "password":"密码",
  "password_placeholder":"请输入密码",
  "prev":"上一步",
  "next":"下一步",
  "back":"后退",
  "reset":"恢复",
  "login":"登录",
  "deposit":"存入",
  "turnOut":"转出",
  "send":"转账",
  "detail":"详情",
  "more":"更多",
  "complete":"完成",
  "count":"数量",
  "total":"总量",
  "balance":"余额",
  "setting":"设置",
  "info":"信息",
  "logout":"退出",
  "show":"显示",
  "from":"来自",
  "to":"至",
  "to_placeholder":"接收地址",
  "gas":"矿工费",
  "normal":"普通",
  "faster":"比较快",
  "fast":"快",
  "copy":"复制",
  "copy_success":"复制成功！",
  "save":"保存",
  "search":"搜索",
  "search_result":"搜索结果",
  "view_more":"查看更多",
  "view_from_youchain":"在YOUChain中查看",
  "type_select":"选择类型",
  "file_select":"选择文件",
  "file_placeholder":"请选择文件",
  "privateKey":"私钥",
  "jsonFile":"JSON文件",
  "confirm":"确认",
  "cancel":"取消",
  "insufficient_funds":"余额不足",

  "network":{
    "main":"有链主网络",
    "test":"有链测试网络",
    "localhost":"Localhost 8283",
    "custom":"自定义 RPC"
  },

  "network_main_tip":"主网待启动，敬请期待",

  "welcome":"欢迎使用 YOUWallet",
  "welcome_desc":"YOUWallet 允许你保存 YOU 和其他代币，并可以在 Dapp 中使用 YOUWallet",
  "create_wallet":"创建新的钱包",
  "reset_wallet":"从助记词还原钱包",

  "password_title":"为钱包创建密码",
  "password_new_title":"新密码（至少8位，包含大、小写字母及数字）",
  "password_confirm_title":"确认密码",
  "password_new_error":"密码输入有误",
  "password_confirm_error":"两次密码输入不一样",
  "password_error":"密码错误",

  "mnemonic":"助记词",
  "mnemonic_desc":"请复制下方助记词，并将在下一步中按顺序确认这些助记词（点击复制）",
  "mnemonic_confirm_title":"确认你的助记词",
  "mnemonic_confirm_desc":"请按正确的顺序确认助记词",
  "mnemonic_warning":"不要对任何人展示助记词以免账户被盗取",
  "mnemonic_error":"顺序错误",

  "reset_title":"从助记词还原钱包",
  "reset_input_title":"请输入12个助记词恢复已有钱包",
  "reset_input_placeholder":"每个助记词之间使用空格分隔",

  "login_password":"请输入密码",

  "transactions":"交易记录",
  "transactions_queue":"队列",
  "transactions_empty":"目前还没有交易",
  "transactions_clear":"清空交易记录",
  "transactions_clear_success":"清空记录成功",
  "transactions_sent":"发送",
  "transactions_status":{
    0:"失败",
    1:"进行中",
    2:"确认中",
    3:"成功"
  },

  "account_my":"我的账户",
  "account_new":"新账户",
  "account_create":"创建账户",
  "account_import":"导入账户",
  "account_info":"账户信息",
  "account_remove":"移除账户",
  "account_export":"导出私钥",
  "account_name":"账户名称",
  "account_name_error":"请输入账户名称",
  "account_private_key":"请输入你的私钥",
  "account_import_warning":"你要导入的账号已存在！",
  "account_import_error":"导入账户失败",
  "account_private_key_show":"显示密钥",
  "account_private_key_password":"输入密码",
  "account_private_key_password_placeholder":"输入你的密码",
  "account_private_key_warning":"注意：为防止资产丢失，请勿公开你的私钥",
  "account_private_key_copy":"这是你的私钥（点击复制）",
  "account_mnemonic_title":"请输入助记词",
  "account_mnemonic_placeholder":"每个助记词之间使用空格分隔",

  "account_remove_confirm":"确认移除当前账号吗？",

  "token_add":"添加代币",
  "token_hide":"隐藏代币",
  "token_search":"代币搜索",
  "token_custom":"自定义代币",
  "token_address":"代币地址",
  "token_symbol":"代币符号",
  "token_decimal":"精确到小数点",
  "token_confirm":"确定添加这些代币吗？",
  "token_submit":"确认添加代币",
  "token_exist":"代币已存在",

  "turnOut_title":"发送",
  "turnOut_tip":_.template("只能发送 {{value}} 给一个 YOUChain 地址"),
  "turnOut_submit":"确认发送",
  "turnOut_total":"总计(含矿工费)",
  "advanced_options":"高级选项",

  "deploy_title":"部署合约",
  "deploy_detail":"详情",
  "deploy_data":"数据",
  "deploy_data_title":"十六进制数据:",

  "gas_diy":"自定义Gas",
  "gas_total":"总计",
  "gas_total_bak":"(含矿工费)",
  "gas_reset":"重置",
  "gas_types":{
    "slow":"慢",
    "normal":"普通",
    "fast":"快"
  },

  "deposit_title":"存入YOU",
  "deposit_name":"直接存入YOU",
  "deposit_desc":"如果你已经有了一些 YOU，可以直接转入你的新钱包。",
  "deposit_exchange":"在交易所中购买",
  "deposit_faucet":"YOUChain 测试网络-水管",
  "deposit_faucet_button":"从水管获取测试YOU",

  "setting_language":"当前语言",
  "privacy_policy":"隐私政策",
  "privacy_policy_filename":"隐私政策.docx",

  "use_terms":"服务协议",
  "use_terms_filename":"服务协议.docx",
  "about":"关于",

  "custom_name":"网络名称",
  "custom_rpc_url":"新增 RPC URL",
  "custom_networkId":"NetworkId (选填)",
  "custom_symbol":"符号 (选填)",
  "custom_explorer_url":"Block Explorer URL (选填)",
  "custom_save_success":"保存成功！",
};

export default zh_CN;