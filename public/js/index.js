const API_ENDPOINT_START = 'https://flappytim.herokuapp.com';
function main() {
    get('/api/whoami', {}, function(user) {
      renderNavbar(user);
      renderName(user);
      const seenRules = window.localStorage.getItem('seenRules');

      console.log(seenRules);
      if (!seenRules){
        window.localStorage.setItem('seenRules', "false");
      }

      // const seenGameOver = window.localStorage.getItem('seenGameOver');

      // console.log(seenGameOver);
      // if (!seenGameOver) {
      //   window.localStorage.setItem('seenGameOver', "false");
      // }

      //console.log(user.name);
      
      //renderStories(user);
    });
  }
  
  main();
  