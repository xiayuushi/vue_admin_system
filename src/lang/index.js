import Vue from 'vue'
import VueI18N from 'vue-i18n'
import Cookie from 'js-cookie'

// import Element from 'element-ui'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

Vue.use(VueI18N)

const i18n = new VueI18N({
  locale: Cookie.get('lang') || 'en',
  /* 语言包通常需要前后端人员配合参与制作，因此使用cookie来存储字段比较合适，因为cookie存储会主动参与接口请求 */
  messages: {
    zh: {
      test: '工作日历',
      ...zhLocale
    },
    en: {
      test: 'Work Calendar',
      ...enLocale
      /*
      1、配置英文语言，只需在此处设置键值对（key:value） key为使用时的$t('key')，值为翻译成英文时的值
      例如，此处的 test: 'Work Calendar'， 在需要使用i18n国际化翻译处理成英文时，只需要在组件插值语法中 {{ $t("test") }}使用即可
      2、如果已经配备好语言包对象，只需像使用element-ui的语言包一样，导入并在相应的messages对象的标识对象内使用 "..."展开语言包对象即可
      后续，只需要在原先使用中文的地方，将原先的变量的xxx改成语言包中的key:value中的value值，再插值语法中使用 {{ $t("语言包对象内的key") }}
      */
    }
  }
})

/* element-ui 针对 i18n 做的兼容处理（为方便整合，将此处代码挪到了项目入口src/main.js中） */
// Vue.use(Element, {
//   i18n: (key, value) => i18n.t(key, value)
// })

export default i18n
