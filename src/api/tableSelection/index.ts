import request from '/@/utils/request';

export function tableSelectionApi() {
    return {
        getResource: (params?: object) => {
            return request({
                url: '/tableResource',
                method: 'get',
                params,
            });
        },
        save: (params?: object) => {
            return request({
                url: '/resource/save',
                method: 'post',
                data: params
            });
        },
        getTableSectionList: (params?: object) => {
            return request({
                url: '/table',
                method: 'get',
                params,
            });
        },
    };
}
