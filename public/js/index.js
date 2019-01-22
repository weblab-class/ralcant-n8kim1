const API_ENDPOINT_START = 'https://flappytim.herokuapp.com';
function main() {
    get('/api/whoami', {}, function(user) {
      renderNavbar(user);
      renderName(user);
      //console.log(user.name);
      
      //renderStories(user);
    });
  }
  
  main();
  