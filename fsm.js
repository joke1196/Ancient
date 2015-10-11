

var FSM = (function(){
  var instance;
  function init() {

    // Private methods
    function privateMethod(){
        console.log( "I am private" );
    }
    //Private variables
    var privateVariable = "Im also private";

    return {
      // Public methods and variables
      publicMethod: function () {

      },
      publicVars: "Public"

    };

  };
  return {

  // Get the Singleton instance if one exists
  // or create one if it doesn't
  getInstance: function () {

    if ( !instance ) {
      instance = init();
    }

    return instance;
  }

};

})();
