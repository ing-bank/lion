'use strict';

module.exports.getPositionByOffset = (offset, source) => {
    let line = 1;
    let column = 0;
    
    if (offset > source.length)
        throw Error('end cannot be more then length ' + offset + ', ' + source.length);
    
    for (let i = 0; i < offset; i++) {
        if (source[i] === '\n' && i !== offset - 1) {
            line++;
            column = 0;
        } else {
            column++;
        }
    }
    
    return {
        line,
        column,
        index: offset - 1,
    };
};
