const moment = require('moment');

export const reverseDate = (inputString) => {
    const charArray = inputString.split('-');
    const reversedArray = charArray.reverse();
    const reversedString = reversedArray.join('/');
    
    return reversedString;
}

export const formattedDate = (value) => {
    const date = moment(value).format('DD/MM/YYYY');
    return date;
}