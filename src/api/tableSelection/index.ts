import request from '/@/utils/request';

export function tableSelectionApi() {
    return {
        getResource: (params?: object) => {
            return request({
                url: '/tableSelection/tableResource',
                method: 'get',
                params,
            });
        },
        getTableSectionList: (params?: object) => {
            return request({
                url: '/tableSelection/table',
                method: 'get',
                params,
            });
        },
    };
}
