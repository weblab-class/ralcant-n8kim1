function newNavbarItem(text, url) {
  const itemLink = document.createElement('a');
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
    navbarDiv.appendChild(newNavbarItem('About','/about'));
    navbarDiv.appendChild(newNavbarItem('Rules ', '/rules'));
    navbarDiv.appendChild(newNavbarItem('Scores', '/self_leaderboard'));
    navbarDiv.appendChild(newNavbarItem('Logout ', '/logout'));
  }
}
