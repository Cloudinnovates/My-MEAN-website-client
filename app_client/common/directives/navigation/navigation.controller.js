(function () {

  angular
  .module('mySiteApp')
  .controller('navigationCtrl', navigationCtrl);

  navigationCtrl.$inject = ['$location', 'authentication'];
  function navigationCtrl($location, authentication) {
    var vm = this;

    vm.currentPath = $location.path();

    //used to show or hide links and buttons into the navigation bar
    
    authentication.isLoggedIn()
    .then(function(result) {
      console.log('Nav isLoggedIn local  Success: ' + result);
      vm.isLoggedIn =  result;
    },function(reason) {
      console.log('Nav isLoggedIn local  Failed: ' + reason);
      vm.isLoggedIn =  false;
    });

    vm.currentUser = {
      'name' : '' 
    };



     authentication.getLoggedUserExperimental()
      .then(function(data) {
        console.log("navigation called getLoggedUser");
        if(data) {
          console.log(data);
          console.log("navigation called data valid");
          var user = JSON.parse(data);
          console.log("navigation called getLoggedUser user parsed");
          console.log(user);
          if(user) {
            console.log("setting currentUser navigation.........................");
            if(user.local) {
              setCurrentUser(user.local);
            } else if(user.github) {
              setCurrentUser(user.github);
            } else if(user.facebook) {
              setCurrentUser(user.facebook);
            } else if(user.google) {
              setCurrentUser(user.google);
            } else if(user.twitter) {
              setCurrentUser(user.twitter);
            }
          }
        } else {
          console.log("navigation called getLoggedUser but data was null");
        }
      }, function(error){
          console.log(error);
      });



    // authentication.getTokenRedis('auth')
    // .then(function(tokenData) {
    //   console.log('token obtained from redis');     
    //   console.log("sessionToken");
    //   if(tokenData && tokenData.data) {
    //     console.log(tokenData.data);
    //     var tokenObj = JSON.parse(tokenData.data);
    //     console.log("tokenobj: " + tokenObj);
    //     if(tokenObj) {
    //       var token = tokenObj.token;
    //       console.log("real token is: " + token);
    //       authentication.saveToken('auth', token);

    //       authentication.getLoggedUser()
    //       .then(function(data) {
    //         console.log("navigation called getLoggedUser");
    //         if(data) {
    //           console.log(data);
    //           console.log("navigation called data valid");
    //           var user = JSON.parse(data);
    //           console.log("navigation called getLoggedUser user parsed");
    //           console.log(user);
    //           if(user) {
    //             console.log("setting currentUser navigation.........................");
    //             if(user.local) {
    //               setCurrentUser(user.local);
    //             } else if(user.github) {
    //               setCurrentUser(user.github);
    //             } else if(user.facebook) {
    //               setCurrentUser(user.facebook);
    //             } else if(user.google) {
    //               setCurrentUser(user.google);
    //             } else if(user.twitter) {
    //               setCurrentUser(user.twitter);
    //             }
    //           }
    //         } else {
    //           console.log("navigation called getLoggedUser but data was null");
    //         }
    //       }, function(error){
    //           console.log(error);
    //       });
    //     }
    //   }
    // }, function(error) {
    //   console.log(error);
    // });


    // authentication.getLoggedUser()
    // .then(function(data) {
    //   console.log("navigation called getLoggedUser");
    //   if(data) {
    //     console.log(data);
    //     console.log("navigation called data valid");
    //     var user = JSON.parse(data);
    //     console.log("navigation called getLoggedUser user parsed");
    //     console.log(user);
    //     if(user) {
    //       console.log("setting currentUser navigation.........................");
    //       if(user.local) {
    //         setCurrentUser(user.local);
    //       } else if(user.github) {
    //         setCurrentUser(user.github);
    //       } else if(user.facebook) {
    //         setCurrentUser(user.facebook);
    //       } else if(user.google) {
    //         setCurrentUser(user.google);
    //       } else if(user.twitter) {
    //         setCurrentUser(user.twitter);
    //       }
    //     }
    //   } else {
    //     console.log("navigation called getLoggedUser but data was null");
    //   }
    // }, function(error){
    //     console.log(error);
    // });

    function setCurrentUser(originData) {
      if(originData) {
        vm.currentUser = {
          name : originData.name
        };
      }
    }

    vm.logout = function() {
      authentication.logout();
      $location.path('/');
    };
  }
})();