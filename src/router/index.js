import Vue from 'vue'
import Router from 'vue-router'
import dd from 'dingtalk-jsapi';


Vue.use(Router)
const router = new Router({
  // mode: 'history',
  routes: [
    { path: '/', redirect: { name: 'trackList' } },
    { path: '/trackList', props: (route) => ({ active: route.query.active }), name: 'trackList', meta: { title: '审批列表' }, component: resolve => require(['@/views/trackList.vue'], resolve) },
    { path: '/paymentDetail/:id', props: true, name: 'paymentDetail', meta: { title: '支出报销审批' }, component: resolve => require(['@/views/paymentDetail.vue'], resolve) },
    { path: '/backDetail/:id', props: true, name: 'backDetail', meta: { title: '回款确认审批' }, component: resolve => require(['@/views/backDetail.vue'], resolve) },
  ]
})

router.beforeEach((to, from, next) => {
  dd.biz.navigation.setTitle({
    title: to.meta.title,//控制标题文本，空字符串表示显示默认文本
  });
  next()
})

export default router