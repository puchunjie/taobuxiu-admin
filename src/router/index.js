import Vue from 'vue';
import Router from 'vue-router';
const index = resolve => require(['../components/common/index.vue'], resolve);
const mycart = resolve => require(['../components/buyer/cart/index.vue'], resolve);
const releasewtb = resolve => require(['../components/buyer/releaseWTB/index.vue'], resolve);
const releasewts = resolve => require(['../components/seller/releaseWTB/index.vue'], resolve);
const bOrders = resolve => require(['../components/buyer/order/index.vue'], resolve);
const sOrders = resolve => require(['../components/seller/order/index.vue'], resolve);
const bProduct = resolve => require(['../components/buyer/product/index.vue'], resolve);
const sProduct = resolve => require(['../components/seller/product/index.vue'], resolve);
const sMachining = resolve => require(['../components/seller/machining/index.vue'], resolve);
const bMachining = resolve => require(['../components/buyer/machining/index.vue'], resolve);
const shopProduct = resolve => require(['../components/seller/shopProduct/index.vue'], resolve);
const shopMachining = resolve => require(['../components/seller/shopMachining/index.vue'], resolve);
const companyManage = resolve => require(['../components/seller/company/index.vue'], resolve);
const main = resolve => require(['../components/common/main.vue'], resolve);
const integral = resolve => require(['../components/common/integral.vue'], resolve);
const account = resolve => require(['../components/common/account.vue'], resolve);
const userInfo = resolve => require(['../components/common/userInfo.vue'], resolve);
const mail = resolve => require(['../components/common/mail.vue'], resolve);
const login = resolve => require(['../components/common/login.vue'], resolve);
const beSeller = resolve => require(['../components/common/beSeller.vue'], resolve);
const jumpTo = resolve => require(['../components/seller/jump.vue'], resolve);
const folow = resolve => require(['../components/seller/folow/index.vue'], resolve);

Vue.use(Router);


export default new Router({
    mode: 'history',
    routes: [{
            path: '/nadmin/account/:identity',
            name: 'index',
            component: index,
            children: [{
                    path: 'beSeller',
                    name: 'beSeller',
                    component: beSeller
                },
                {
                    path: 'main',
                    name: 'main',
                    component: main
                },
                {
                    path: 'bOrders',
                    name: 'bOrders',
                    component: bOrders
                },
                {
                    path: 'sOrders',
                    name: 'sOrders',
                    component: sOrders
                },
                {
                    path: 'bProduct',
                    name: 'bProduct',
                    component: bProduct
                },
                {
                    path: 'sProduct',
                    name: 'sProduct',
                    component: sProduct
                },
                {
                    path: 'releasewtb',
                    name: 'releasewtb',
                    component: releasewtb
                },
                {
                    path: 'releasewts',
                    name: 'releasewts',
                    component: releasewts
                },
                {
                    path: 'mycart',
                    name: 'mycart',
                    component: mycart
                },
                {
                    path: 'bMachining',
                    name: 'bMachining',
                    component: bMachining
                },
                {
                    path: 'sMachining',
                    name: 'sMachining',
                    component: sMachining
                },
                {
                    path: 'shopProduct',
                    name: 'shopProduct',
                    component: shopProduct
                },
                {
                    path: 'shopMachining',
                    name: 'shopMachining',
                    component: shopMachining
                },
                {
                    path: 'integral',
                    name: 'integral',
                    component: integral
                },
                {
                    path: 'account',
                    name: 'account',
                    component: account
                },
                {
                    path: 'userInfo',
                    name: 'userInfo',
                    component: userInfo
                },
                {
                    path: 'mail',
                    name: 'mail',
                    component: mail
                },
                {
                    path: 'jumpTo',
                    name: 'jumpTo',
                    component: jumpTo
                },
                {
                    path: 'companyManage',
                    name: 'companyManage',
                    component: companyManage
                },
                {
                    path: 'folow',
                    name: 'folow',
                    component: folow
                }
            ]
        },
        {
            path: '/nadmin/login',
            name: 'login',
            component: login
        }
    ],
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    }
})