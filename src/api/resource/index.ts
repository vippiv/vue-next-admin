import request from '/@/utils/request';

export function resourceMgtApi() {
    return {
        getResource: (params?: object) => {
            return request({
                url: '/rsg/resource',
                method: 'get',
                params,
            });
        },
        save: (params?: object) => {
            return request({
                url: '/rsg/resource/save',
                method: 'post',
                data: params
            });
        },
        getTableSectionList: (params?: object) => {
            return request({
                url: '/rsg/table',
                method: 'get',
                params,
            });
        },
    };
}
