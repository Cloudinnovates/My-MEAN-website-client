(function () {
  angular
  .module('mySiteApp')
  .service('authentication', authentication);

  authentication.$inject = ['$q', '$http', '$window', '$log'];
  function authentication ($q, $http, $window, $log) {

    //----------------------------
    //--- local authentication ---
    //----------------------------
    var register = function(user) {
      return $http.post('/api/register', user)
      .success(function (data) {
        console.log('called register - success');
        console.log(data.token);
        saveToken('auth', JSON.stringify(data.token));
      })
      .error(function (err) {
              // Erase the token if the user fails to log in
              console.log('called register - error');
              removeToken('auth');
            });
    };


    var login = function(user) {
      return $http.post('/api/login', user)
      .success(function(data) {
        saveToken('auth', JSON.stringify(data.token));
      })
      .error(function (err) {
              // Erase the token if the user fails to log in
              console.log('called register - error');
              removeToken('auth');
            });
    };


    var unlinkLocal = function() {
      console.log("unlinkLocal: ");
      var deferred = $q.defer();

      getUserByToken('auth')
      .success(function(data) {
        console.log('unlink user ');

        if(data !== null && data === 'invalid-data') {
          removeToken('auth');
          removeCookie('userCookie');
          //TODO call logout to remove sessio data from redis
          deferred.reject(null);
        }

        //var userData = JSON.parse(data);
        console.log('********************************************************');
        console.log('******************************************************** unlinkLocal user:');
        console.log('********************************************************');
        console.log(data);
        if(data) {
          var userData = JSON.parse(data);
          console.log(userData);
          var user = userData.user;
          console.log(user);

          if(user._id) {

            $http.get('/api/unlink/local/' + user._id)
            .success(function (data) {
              console.log("unlink");
              console.log(data);
              deferred.resolve(data);
            })
            .error(function(e) {
              console.log(e);
              deferred.reject(null);
            });
          }
        } else {
          removeToken('auth');
          removeCookie('userCookie'); 
            //TODO remove session logout
            deferred.reject(null);
          }
        })
      .error(function(e) {
        console.log('getUserByToken error ');
        console.log(e);
        removeToken('auth');
        removeCookie('userCookie');
        //TODO remove session logout
        deferred.reject(null);
      });

      return deferred.promise;
    };

    function isAuthLocalLoggedIn () {
      console.log("reading token: ");
      var deferred = $q.defer();

      getUserByToken('auth')
      .success(function(data) {
        console.log('isAuthLocalLoggedIn user ');
        var user = JSON.parse(data);
        console.log('user:');
        console.log(user);
          //return getUserById(data.user._id);
          if(user) {
            deferred.resolve(true);
          } else {
            deferred.resolve(false);
          }
        })
      .error(function(e) {
        console.log('isAuthLocalLoggedIn error ');
        console.log(e);
        deferred.resolve(false);
      });

      return deferred.promise;
    }

    //-----------------------------
    //--- 3dauth authentication ---
    //-----------------------------
    function isAuth3dLoggedIn () {
      console.log("reading 3dauth: ");
      var deferred = $q.defer();

      getUserByToken('3dauth')
      .success(function(data) {
        console.log('isAuth3dLoggedIn user ');
        var user = JSON.parse(data);
        console.log('user:');
        console.log(user);
          //return getUserById(data.user._id);
          if(user) {
            deferred.resolve(true);
          } else {
            deferred.resolve(false);
          }
        })
      .error(function(e) {
        console.log('isAuth3dLoggedIn error ');
        console.log(e);
        deferred.resolve(false);
      });

      return deferred.promise;
    }

    //---------------------------------------
    //--- local and 3dauth authentication ---
    //---------------------------------------
    //function to call the /users/:id REST API
    var getUserById = function (id) {
      return $http.get('/api/users/' + id);
    };

    var logout = function() {
      //TODO remove session data - logout
      removeToken('auth');
      removeCookie('userCookie');
      removeCookie('connect.sid');
    };

    var isLoggedIn = function() {
      var deferred = $q.defer();

      $q.all([isAuthLocalLoggedIn(), isAuth3dLoggedIn()])
      .then(function(results) {
        console.log("Isloggedin called");
        var r0 = results[0];
        var r1 = results[1];
        console.log(r0);
        console.log(r1);
        deferred.resolve(r0 || r1);
        //return false;
      }, function(error) {
        deferred.resolve(false);
        //return false;
      }).catch(function(err){
        deferred.resolve(false);
      });
      return deferred.promise;
    };

    var saveToken = function (key, token) {
      $window.sessionStorage[key] = token;
    };

    var getTokenRedis = function () {
      return $http.get('/api/sessionToken'); 
    };


    var decodeJwtToken = function(jwtToken) {
      //TODO add an if(jwtToken) or something like that. But remember to use $q or similar here!
      return $http.get('/api/decodeToken/' + jwtToken);
    };


    // //EXPERIMENTAL
    // var getLoggedUser = function() {
    //   console.log("reading token: ");
    //   var deferred = $q.defer();
    //   var thirdauthData = {};

    //   getTokenRedis()
    //   .success(function(tokenData) {
    //     console.log('token obtained from redis');     
    //     console.log("sessionToken");
    //     if(tokenData && tokenData.data) {
    //       console.log(tokenData.data);
    //       var tokenObj = JSON.parse(tokenData.data);
    //       console.log("tokenobj: " + tokenObj);
    //       if(tokenObj) {
    //         var token = tokenObj.token;
    //         console.log("real token is: " + token);
    //         saveToken('auth', token);


    //         getUserByToken('auth')
    //         .success(function(data) {
    //           console.log('getUserByToken user ');

    //           if(data !== null && data === 'invalid-data') {
    //             removeToken('auth');
    //             removeCookie('userCookie');
    //             //TODO remove session data with logout
    //             deferred.reject(null);
    //           }

    //           //var userData = JSON.parse(data);
    //           console.log('********************************************************');
    //           console.log('******************************************************** user:');
    //           console.log('********************************************************');
    //           console.log(data);
    //           if(data) {
    //             var userData = JSON.parse(data);
    //             console.log(userData);
    //             var user = userData.user;
    //             console.log(user);

    //             if(user._id) {
    //               getUserById(user._id)
    //               .success(function(data) {
    //                 console.log("Obtained user by its id");
    //                 console.log("getUserByToken finished with local user");
    //                 console.log(data);

    //                 console.log("updated user with local infos:");
    //                 console.log(user);

    //                 deferred.resolve(JSON.stringify(user));
    //               })
    //               .error(function(e) {
    //                 console.log("Impossible to retrieve user by its id");
    //                 console.log("getUserByToken finished without local user");
    //                 deferred.resolve(JSON.stringify(user));
    //               });
    //             }
    //           } else {
    //             removeToken('auth');
    //             removeCookie('userCookie');
    //               //TODO remove logout
    //               deferred.reject(JSON.stringify({}));
    //             }
    //           })
    //           .error(function(e) {
    //             console.log('getUserByToken error ');
    //             console.log(e);
    //             removeToken('auth');
    //             removeCookie('userCookie');
    //             //TODO remove logout
    //             deferred.reject(JSON.stringify({}));
    //           });
    //           console.log("getUserByToken finished returning...");
    //       }
    //     }
    //   }).error(function(e) {
    //       console.log(error);
    //       deferred.reject(null);
          
    //   });
    //   console.log("getLoggedUser finished returning...");
    //   return deferred.promise;
    // };

    var getLoggedUser = function() {
      console.log("reading token: ");
      var deferred = $q.defer();
      var thirdauthData = {};

      getUserByToken('auth')
      .success(function(data) {
        console.log('getUserByToken user ');

        if(data !== null && data === 'invalid-data') {
          removeToken('auth');
          removeCookie('userCookie');
          //TODO remove session data with logout
          deferred.reject(null);
        }

        //var userData = JSON.parse(data);
        console.log('********************************************************');
        console.log('******************************************************** user:');
        console.log('********************************************************');
        console.log(data);
        if(data) {
          var userData = JSON.parse(data);
          console.log(userData);
          var user = userData.user;
          console.log(user);

          if(user._id) {
            getUserById(user._id)
            .success(function(data) {
              console.log("Obtained user by its id");
              console.log("getUserByToken finished with local user");
              console.log(data);

              console.log("updated user with local infos:");
              console.log(user);

              deferred.resolve(JSON.stringify(user));
            })
            .error(function(e) {
              console.log("Impossible to retrieve user by its id");
              console.log("getUserByToken finished without local user");
              deferred.resolve(JSON.stringify(user));
            });
          }
        } else {
          removeToken('auth');
          removeCookie('userCookie');
            //TODO remove logout
            deferred.reject(JSON.stringify({}));
          }
        })
      .error(function(e) {
        console.log('getUserByToken error ');
        console.log(e);
        removeToken('auth');
        removeCookie('userCookie');
        //TODO remove logout
        deferred.reject(JSON.stringify({}));
      });
      console.log("getUserByToken finished returning...");
      return deferred.promise;
    };

    //-----------------------------------
    //--- others functions - not exposed
    //-----------------------------------
    function getToken(key) {
      return $window.sessionStorage[key];
    }
    function getUserByToken(key) {
      console.log("getUserByToken called method");
      var sessionToken = getToken(key); 
      if(sessionToken) {
        console.log("getUserByToken sessionToken :" + sessionToken);
        var token = sessionToken; //JSON.parse(sessionToken);
        console.log("getUserByToken token ");
        console.log(token);
        return decodeJwtToken(token);
      } else {
        return decodeJwtToken();
      }
    }
    function removeToken(key) {
      $window.sessionStorage.removeItem(key);
    }
    function removeCookie(key) {
      //TODO remove this function 
      //$cookies.remove(key);
    }
    
    return {
      register : register,
      login : login,
      unlinkLocal : unlinkLocal,
      getUserById : getUserById,
      logout : logout,
      getLoggedUser : getLoggedUser,
      isLoggedIn : isLoggedIn,
      saveToken : saveToken,
      getTokenRedis : getTokenRedis,
      decodeJwtToken : decodeJwtToken
    };
  }
})();