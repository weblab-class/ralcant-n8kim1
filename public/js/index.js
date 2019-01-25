const API_ENDPOINT_START = 'https://flappytim.herokuapp.com';
function main() {
    get('/api/whoami', {}, function(user) {
      renderNavbar(user);
      renderName(user);
      const seenRules = window.localStorage.getItem('seenRules');

      console.log(seenRules)
      if (!seenRules){
        window.localStorage.setItem('seenRules', "false");
      }

      //console.log(user.name);
      
      //renderStories(user);
    });
  }
  
  main();
  