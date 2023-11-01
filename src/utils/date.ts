export const secondToTime = (second: number): string => {
  const millisecond = second * 1000;
  const minutes = Math.floor(millisecond / (1000 * 60));
  const seconds = Math.floor((millisecond % (1000 * 60)) / 1000);

  return `${paddingZero(minutes)}:${paddingZero(seconds)}`;
};

export const secondToTimeDesc = (second: number): string => {
  const millisecond = second * 1000;
  const minutes = Math.floor(millisecond / (1000 * 60));
  const seconds = Math.floor((millisecond % (1000 * 60)) / 1000);

  const minutesDesc = minutes > 0 ? `${paddingZero(minutes)}分` : '';
  const secondsDesc = seconds > 0 ? `${paddingZero(seconds)}秒` : '';

  return `${minutesDesc}${secondsDesc}`;
};

export const paddingZero = (number: number): string => {
  return number >= 0 && number < 10 ? `0${number}` : `${number}`;
};

export const formatDate = (datePara: string | number, format: string): string => {
  if (!datePara) {
    return '';
  }

  const date = new Date(datePara);
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds()
  } as Record<string, number>;
  const w = [
    ['日', '一', '二', '三', '四', '五', '六'],
    ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  ];
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  if (/(w+)/.test(format)) {
    format = format.replace(RegExp.$1, w[RegExp.$1.length - 1][date.getDay()]);
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(
        RegExp.$1,
        (RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(`${o[k]}`.length)) as string
      );
    }
  }

  return format;
};
