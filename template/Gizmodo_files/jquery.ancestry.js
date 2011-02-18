/*
Ancestry - jquery.ancestry.js
As discussed in the jQuery Development Google Group.
Released under the MIT license.

Involved: Michael Geary, Diego Perini, John-David Dalton, John Resig, and Nathan Hammond
Compiled: Nathan Hammond
*/

jQuery.comparePosition = function ( element, context) {
  jQuery.comparePosition =
  document.documentElement.compareDocumentPosition ?
      function ( element, context ) {
        return !!( element.compareDocumentPosition(context) & 8 );
      }
    : document.documentElement.contains ?
      function ( element, context ) {
        return element  != context && context.contains(element);
      }
    :
      function ( element, context ) {
        for ( ; element != context; element = element.parentNode )
          if ( !element ) return false;
        return true;
      };
  return jQuery.comparePosition( element, context );
}

jQuery.fn.ancestorOf = function ( context ) {
  return this.filter(function() {
    return jQuery.comparePosition( context, this );
  });
};
jQuery.fn.descendantOf = function ( context ) {
  return this.filter(function() {
    return jQuery.comparePosition( this, context );
  });
};

/*
Noted here if you wish to add parallel functionality to $()

if ( selector.nodeType ) {
  // Handle $(DOMElement,  context)
  if ( context &&  !jQuery.comparePosition( selector, context ) ) {
    return jQuery( [] );
  }
  // Handle $(DOMElement)
  this[0]  = selector;
  this.length = 1;
  return this;
}
*/