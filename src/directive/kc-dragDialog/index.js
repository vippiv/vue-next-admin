import drag from './drag';

const install = function (Vue) {
	Vue.directive('kc-drag-dialog', drag);
};

if (window.Vue) {
	window['kc-drag-dialog'] = drag;
	Vue.use(install); // eslint-disable-line
}

drag.install = install;
export default drag;
