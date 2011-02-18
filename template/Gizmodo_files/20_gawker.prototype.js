// Base class inspired by base2 and Prototype
// source: http://ejohn.org/blog/simple-javascript-inheritance/
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

  // The base Class implementation (does nothing)
  this.gClass = function(){};
 
  // Create a new Class that inherits from this class
  gClass.extend = function(prop) {
    var _super = this.prototype;
   
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
   
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
           
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
           
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);       
            this._super = tmp;
           
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
   
    // The dummy class constructor
    function gClass() {
      // All construction is actually done in the init method
      if ( !initializing && this.initialize )
        this.initialize.apply(this, arguments);
    }
   
    // Populate our constructed prototype object
    gClass.prototype = prototype;
   
    // Enforce the constructor to be what we expect
    gClass.constructor = gClass;

    // And make this class extendable
    gClass.extend = arguments.callee;
   
    return gClass;
  };
})();

// Function binding
if ( Function.prototype.bind == undefined ) {	
	jQuery.extend( Function.prototype, {
		bind: function() {
			if ( arguments.length < 2 && ( typeof arguments[0] == "undefined" ) ) {
				return this;
			}
			var __method = this;

			// first argument was whe object scope
			var object = arguments[0];

			// following arguments should be saved
			var args = new Array();
			for (var i = 1, l = arguments.length; i < l; i++) {
				args[(i - 1)] = arguments[i];
			}

			return function() {
				var nuArgs = new Array();
				for (var i = 0, l = args.length; i < l; i++) {
					nuArgs[(nuArgs.length)] = args[i];
				}
				for (var i = 0, l = arguments.length; i < l; i++) {
					nuArgs[(nuArgs.length)] = arguments[i];
				}
				return __method.apply( object, nuArgs );
			}
		}
	});
}

if (!Array.prototype.indexOf) Array.prototype.indexOf = function(item, i) {
	i || (i = 0);
	var length = this.length;
	if (i < 0) i = length + i;
	for (; i < length; i++) {
		if (this[i] === item) return i;
	}
	return -1;
};
