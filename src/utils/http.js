/**
 * scoket url
 */
// export const ws = 'ws://118.178.17.15:9091'; //正式服
export const ws = 'ws://118.178.17.15:9092';

/**
 * 登录接口
 * params:  mobile , password
 */

export const login = '/member/login';

/**
 * 登出接口
 */
export const loginOut = '/member/quit'

/**
 * 我的站内信
 */
export const myInnerMessage = 'member/myInnerMessage';

/**
 * 站内信详情
 */
export const myInnerMessageDetail = 'member/myInnerMessageDetail';

/**
 * 删除站内信
 */
export const deleteInnerMessage = 'member/deleteInnerMessage';


/**
 * 修改密码
 */
export const mPassword = 'member/changePassword';

/**
 * 申请成为商家
 */
export const beSeller = 'member/fillSellerInfo'

// -----------------------买家中心-----------------------
/**
 * 获取个人信息资料
 */
export const profile = 'member/profile';
/**
 * 更改个人信息
 */
export const updateProfile = 'member/updateProfile';

/**
 * 绑定专员
 */
export const bindSalesman = 'member/bindSalesman';

/**
 * 我的订单
 * currentPage   //当前页面
 * pageCount     //每页个数
 */
export const myOrders = 'order/myOrders';

/**
 * 取消订单
 * orderId   
 */
export const deleteOrder = 'order/delete';

/**
 * 评价订单
 * orderId:12016062603  id
 * vote:4.3    评分
 */
export const voteOrder = 'order/vote';

/**
 * 我的购物车
 * currentPage   //当前页面
 * pageCount     //每页个数
 */
export const myCarts = 'order/myCars';

/**
 * 删除购物车
 * carId
 */
export const deleteCart = 'order/deleteCar';

/**
 * 购物车下单
 * carId
 */
export const translateCart = 'order/translate';

/**
 * 购物车批量下单
 * carId
 */
export const translateAllCart = 'order/translateAll';


/**
 * 买家不锈钢求购发布
 */
export const publishIron = 'iron/buy'

/**
 * 买家不锈钢求购列表
 * currentPage   //当前页面
 * pageCount     //每页个数
 * status // 0 进行中  1 已确认  2 已取消  -1 所有
 */
export const myBuyList = 'iron/myBuy';


/**
 * 买家不锈钢求购详情
 * ironId   //id
 */
export const myBuyDetail = 'iron/myBuyDetail';


/**
 * 点击中标
 * ironBuyId  
 * supplyId
 */
export const selectSupply = 'iron/selectSupply';


/**
 * 加工求购信息发布
 */
export const publishHanding = 'handing/buy'


/**
 * 买家加工报价管理 列表
 * currentPage   //当前页面
 * pageCount     //每页个数
 * status // 0 进行中  1 已确认  2 已取消  -1 所有
 */
export const bmyHandingBuys = 'handing/myBuy';

/**
 * 买家加工报价管理详情
 * ironId   //id
 */
export const bmyHandingBuyDetail = 'handing/myBuyDetail';

/**
 * 点击中标
 * ironBuyId  
 * supplyId
 */
export const hselectSupply = 'handing/selectSupply';

/**
 * 积分
 */
export const bIntegral = 'member/myIntegral';



// -----------------------卖家中心-----------------------
/**
 * 获取个卖家人信息资料
 */
export const sprofile = 'seller/profile';
/**
 * 修改卖家个人信息资料
 */
export const updatesProfile = 'seller/updateProfile';

/**
 * 我的订单
 * currentPage   //当前页面
 * pageCount     //每页个数
 */
export const commingOrders = 'seller/commingOrders';

/**
 * 忽略订单
 * orderId   
 */
export const scelOrder = 'seller/cancelOrder';

/**
 * 删除订单
 * orderId   
 */
export const sdelOrder = 'seller/deleteOrder';

/**
 * 确认订单
 * orderId   
 */
export const sconfOrder = 'seller/confirmOrder';

/**
 * 卖家不锈钢求购列表
 * currentPage   //当前页面
 * pageCount     //每页个数
 * status // 0 进行中  1 已确认  2 已取消  -1 所有
 */
export const myIronBuys = 'seller/myIronBuys';

/**
 * 卖家不锈钢求购详情
 * ironId   //id
 */
export const sMyBuyDetail = 'seller/myIronBuyDetail';

/**
 * 卖家点击报价
 * ironId:PmPNOklFbltl
 * price:123123
 * msg:123123123
 */
export const offerIronBuy = 'seller/offerIronBuy';

/**
 * 卖家点击忽略报价
 * Ironid
 */
export const missIronBuyOffer = 'seller/missIronBuyOffer';

/**
 * 卖家加工报价管理 列表
 * currentPage   //当前页面
 * pageCount     //每页个数
 * status // 0 进行中  1 已确认  2 已取消  -1 所有
 */
export const myHandingBuys = 'seller/myHandingBuys';

/**
 * 卖家加工报价管理详情
 * ironId   //id
 */
export const myHandingBuyDetail = 'seller/myHandingBuyDetail';

/**
 * 卖家点击报价
 * handingId:PmPNOklFbltl
 * price:123123
 * msg:123123123
 */
export const offerHandingBuy = 'seller/offerHandingBuy';

/**
 * 卖家店铺现货列表
 * currentPage  
 * pageCount
 */
export const shopProducts = 'iron/myProducts';

/**
 * 卖家店铺现货更新
 * ironId  
 * price
 * numbers
 */
export const updateProduct = 'iron/updateProduct';

/**
 * 卖家店铺现货删除
 * ironId  
 */
export const deleteProduct = 'iron/deleteProduct';

/**
 * 卖家店铺加工列表
 * currentPage  
 * pageCount
 */
export const shopMachining = 'handing/myProducts';

/**
 * 卖家店铺加工更新
 * ironId  
 * price
 * numbers
 */
export const updateMachining = 'handing/updateProduct';

/**
 * 卖家店铺加工删除
 * ironId  
 */
export const deleteMachining = 'handing/deleteProduct';

/**
 * 积分
 */
export const sIntegral = 'seller/myIntegral';

/**
 * 发布不锈钢锈钢信息
 */
export const ironPush = 'iron/push';

/**
 * 发布不锈钢锈钢信息
 */
export const handingPush = 'handing/push';

/**
 * 获取关注列表
 * GET
 */
export const followList = 'member/ironSubscribe';

/**
 * 保存关注
 * post
 */
export const saveFollow = 'member/ironSubscribe';