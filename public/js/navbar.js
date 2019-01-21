function newNavbarItem(text, url) {
  const itemLink = document.createElement('a');
  itemLink.className = 'nav-item nav-link logout';
  itemLink.innerHTML = text;
  itemLink.href = url;

  return itemLink
}

function renderNavbar(user) {
  const navbarDiv = document.getElementById('nav-item-container');

  // NOTE: this check is a lowkey hack
  if (user._id !== undefined) {
    //navbarDiv.appendChild(newNavbarItem('Profile', '/u/profile?'+user._id));
    navbarDiv.appendChild(newNavbarItem('Logout ', '/logout'));
    navbarDiv.appendChild(newNavbarItem('Home', '/'));
  } else {
    //navbarDiv.appendChild(newNavbarItem('Login', '/auth/google'));
  }
}
  