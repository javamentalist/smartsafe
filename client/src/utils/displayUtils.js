import bytes from 'bytes'
import dateFormat from 'dateformat'

export const formatBytes = (sizeInbytes) => {
  return bytes(sizeInbytes, {
    decimalPlaces: 2,
    fixedDecimals: false,
    thousandsSeparator: ' ',
    unitSeparator: ' '
  });
}

export const formatDate = (date, format = 'd mmm yyyy, HH:MM:ss') => {
  return dateFormat(date, format);
}