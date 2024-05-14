'use strict';

module.exports = ({tokens, ...program}) => {
    const ast = {
        type: 'File',
        
        program: {
            ...program,
            directives: [],
        },
        
        comments: [],
        tokens,
    };
    
    return ast;
};
