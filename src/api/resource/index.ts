import request from '/@/utils/request';

export function resourceMgtApi () {
    return {
        getResource: (params?: object) => {
            return request({
                url: '/resource',
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
        }
    };
}
