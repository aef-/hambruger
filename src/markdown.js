module.exports = {
  toH2: function( str ) {
    return '## ' + str;
  },

  toH3: function( str ) {
    return '### ' + str;
  },

  toUnorderedItem: function( str ) {
    return '* ' + str;
  },

  toEm: function( str ) {
    return '*' + str + '*';
  },

  toStrong: function( str ) {
    return '**' + str + '**';
  },

  toInlineCode : function( str ) {
    return '`' + str + '`';
  },

  toBlockCode: function( str ) {
    return '```' + str + '```';
  },

  newLine: function( ) {
    return '\n';
  }
};
