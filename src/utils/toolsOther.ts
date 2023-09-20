// 字节单位转换
export function getfilesize (size: number, unit: string) {
    var num = 1024.0; //byte
    unit = unit && unit.toUpperCase();
    if (unit === 'B') {
        return size + 'B';
    } else if (unit === 'K') {
        return (size / num).toFixed(2) + 'K';
    } else if (unit === 'M') {
        return (size / Math.pow(num, 2)).toFixed(2) + 'M';
    } else if (unit === 'G') {
        return (size / Math.pow(num, 3)).toFixed(2) + 'G';
    } else if (unit === 'T') {
        return (size / Math.pow(num, 4)).toFixed(2) + 'T';
    }

    if (size < num) {
        return size + 'B';
    }
    if (size < Math.pow(num, 2)) {
        return (size / num).toFixed(2) + 'K';
    } //kb
    if (size < Math.pow(num, 3)) {
        return (size / Math.pow(num, 2)).toFixed(2) + 'M';
    } //M
    if (size < Math.pow(num, 4)) {
        return (size / Math.pow(num, 3)).toFixed(2) + 'G';
    } //G
    return (size / Math.pow(num, 4)).toFixed(2) + 'T'; //T
}