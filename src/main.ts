import { createApp } from 'vue';
import pinia from '/@/stores/index';
import App from '/@/App.vue';
import router from '/@/router';
import { directive } from '/@/directive/index';
import { i18n } from '/@/i18n/index';
import dayjs from 'dayjs';
import other from '/@/utils/other';

import ElementPlus from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import '/@/theme/index.scss';
import VueGridLayout from 'vue-grid-layout';
import component from './components/index'

const app = createApp(App);
app.provide('$dayjs', dayjs); // 定义全局方法

directive(app);
other.elSvg(app);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(pinia).use(router).use(ElementPlus).use(i18n).use(VueGridLayout).use(component).mount('#app');
