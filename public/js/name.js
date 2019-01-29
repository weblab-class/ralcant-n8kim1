function updateList(list, message){
   const newElement = document.createElement('li');
   const text = document.createElement('h2');
   text.innerText = message;
   newElement.appendChild(text)
   list.appendChild(newElement);
}
function create(type, id, text, className, href){
   const newElement = document.createElement(type);
   newElement.id = id;
   newElement.innerText = text;
   newElement.className = className;
   newElement.href = href;
   return newElement
}
function renderName(user){
    const nameContainer = document.getElementById("name-container");
    const nameHeader = document.createElement('h1')

    const welcome_message = document.getElementById("first_message");
    const welc_Header = document.createElement('h1');

    const nameContainer_about = document.getElementById('name-container_about');
    const nameHeader_about = document.createElement('h1');

    const nameContainer_rules = document.getElementById('name-container_rules');
    const nameHeader_rules = document.createElement('h1')

    const nameContainer_game = document.getElementById('name-container_game');
    const nameHeader_game = document.createElement('h1');

    const messageContainer = document.getElementById("sub_message")

    const overlay = document.getElementById('overlay');

    if (user._id !== undefined) {
        if (window.localStorage.getItem('seenRules') === "false") { 
        const list = document.getElementById('list');
        updateList(list, "You do not talk about the TIM club");
        updateList(list, "You DO NOT talk about the TIM club");
        updateList(list, "You can select between 5 different levels of difficulty, each of them will determine the number of different keys you'll be using." );
        updateList(list, "Try to keep TIM alive by pressing the specific keys that appear on the screen." );
        updateList(list, "You can also see your TOP 5 scores of you and the TOP 5 scores of everyone when you clik 'See my scores' when you lose.");
        
        overlay.style.display = "block";
        }

        if (nameContainer != null) {
          nameHeader.innerText = "Hello, " + user.name;
          nameContainer.appendChild(nameHeader);
        }
        if(nameContainer_about !== null){
           nameHeader_about.innerText = "How is it going, " + user.name + "?";
           nameContainer_about.appendChild(nameHeader_about);
        }
        if(nameContainer_rules !== null){
           nameHeader_rules.innerText = "Wanna play then, " + user.name + "?"
           nameContainer_rules.appendChild(nameHeader_rules);
        }
        if(nameContainer_game !== null){
            nameHeader_game.innerText = "You got this, " + user.name + "!";
            nameContainer_game.appendChild(nameHeader_game);
        }


        welc_Header.innerText = "Welcome to Flappy TIM";
        welcome_message.appendChild(welc_Header);

        const start_button = create('a', null, "START", "button allign_center_start", "/game");
        document.body.appendChild(start_button);

        const rules_button = create('a', null, "Rules", "button allign_center_rules", "/rules");
        document.body.appendChild(rules_button);

        const about_button = create('a', null, "About", "button allign_center_about", "/about")
        document.body.appendChild(about_button);
        
     }
     else{
        const welc_Header = create('h1', null, "Flappy TIM", "center", null);
        welcome_message.appendChild(welc_Header);

        const messageHeader = create('h2', null, "You better be ready to press any key", "center", null);
        messageContainer.appendChild(messageHeader);

        const login_button = create('a', null, "Login", "button allign_center_start", "/auth/google");
        document.body.appendChild(login_button)
        window.localStorage.setItem('seenRules', "false");
     }
}
function on() {
   document.getElementById("overlay").style.display = "block";
}
 
function off() {
   document.getElementById("overlay").style.display = "none";
   window.localStorage.setItem('seenRules', "true");
}
