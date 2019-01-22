function newNavbarItem(text, url) {
  const itemLink = document.createElement('a');
  // itemLink.className = 'nav-item nav-link logout ';
  itemLink.className = 'nav-item nav-link';
  itemLink.innerHTML = text;
  itemLink.href = url;

  return itemLink
}
function renderNavbar(user) {
  const navbarDiv = document.getElementById('nav-item-container');
  navbarDiv.appendChild(newNavbarItem('Home ', '/'));
  // NOTE: this check is a lowkey hack
  if (user._id !== undefined) {
    //navbarDiv.appendChild(newNavbarItem('Profile', '/u/profile?'+user._id));
    navbarDiv.appendChild(newNavbarItem('Logout ', '/logout'));
    navbarDiv.appendChild(newNavbarItem('Rules ', '/rules'));
    //navbarDiv.appendChild(newNavbarItem('Home ', '/'));
    navbarDiv.appendChild(newNavbarItem('About','/about'))
  } else {
   // navbarDiv.appendChild(newNavbarItem('Login', '/auth/google'));  
  }
}

// function renderNavbar(user){
//   const navbarDiv = document.getElementById('nav-item-container');
//   if (user._id !== undefined){
//     //const newnav = document.createElement('nav');
//     //new 
//     const x = (
//       <nav class="navbar navbar-expand-lg navbar-light bg-light">
//         {/* <a class="navbar-brand" href="#">Navbar</a> */}
//         <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
//           <span class="navbar-toggler-icon"></span>
//         </button>
//         <div class="collapse navbar-collapse" id="navbarNav">
//           <ul class="navbar-nav">
//             <li class="nav-item active">
//               <a class="nav-link" href="/">Home <span class="sr-only">(current)</span></a>
//             </li>
//             <li class="nav-item">
//               <a class="nav-link" href="/rules">Rules</a>
//             </li>
//             <li class="nav-item">
//               <a class="nav-link" href="/about">About</a>
//             </li>
//             <li class="nav-item">
//               <a class="nav-link disabled" href="/logout">Logout</a>
//             </li>
//           </ul>
//         </div>
//       </nav>
//     )
//     navbarDiv.appendChild(x);
//   } else {
//     navbarDiv.appendChild(newNavbarItem('Login', '/auth/google'));  
//   }

// }
  