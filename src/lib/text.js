'use strict'

/**
 * Shorten a string with ellipsis in the middle
 * 
 * @example
 * 'This is a really long string' => 'This i ... string'
 * 
 * @param  {String} name [description]
 * @return {[type]}      [description]
 */
export const flankTruncateString = str => {
    
    if ( str.length < 60 ) return str
    
    let quarterLen = Math.min( 22, ( str.length / 4 ) )
    
    return str.substring( 0, quarterLen ) +
        ' ... ' + str.substring( str.length - quarterLen )
    
}
