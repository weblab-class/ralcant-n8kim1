function renderName(user){
    const nameContainer = document.getElementById("name-container");
    const nameHeader = document.createElement('h1')

    const welcome_message_id = document.getElementById("welcome_message_id")
    const welcome_message = document.getElementById("first_message");
    const welc_Header = document.createElement('h1');

    //const startContainer = document.getElementById("start")
    //const start_button =document.createElement('a');

    const messageContainer = document.getElementById("sub_message")
    const messageHeader = document.createElement('h2');


    //const loginContainer = document.getElementById("login")
    //const login_button = document.createElement('a');
    //welc_Header.className = "welcome-text";
    if (user._id !== undefined) {
      //   welcome_message_id.className = "welcome_text";
        nameHeader.innerText = "Hello, " + user.name;
        nameContainer.appendChild(nameHeader);
        //nameContainer.appendChild(user.name); <- first try, incorrect
        welc_Header.innerText = "Welcome to Flappy TIM";
        welcome_message.appendChild(welc_Header);

        const start_button = document.createElement('a')
        start_button.className = "button allign_center_start"
        start_button.innerText = "START";
        start_button.href = "game";
        document.body.appendChild(start_button);

        const rules_button = document.createElement('a')
        rules_button.className = "button allign_center_rules";
        rules_button.innerText = "RULES";
        rules_button.href = "rules";
        document.body.appendChild(rules_button);

        const about_button = document.createElement('a')
        about_button.className ="button allign_center_about"
        about_button.innerText = "About";
        about_button.href = "about";
        document.body.appendChild(about_button);
     }
     else{
        welcome_message_id.className = "animated flip";
        welc_Header.innerText = "Flappy TIM!!!";
        welcome_message.appendChild(welc_Header);

        messageHeader.innerText = "You better be ready to press any key!!!"
        messageContainer.appendChild(messageHeader);

        const login_button = document.createElement('a')
        login_button.className = "button allign_center_start"
        login_button.innerText = "Login";
        login_button.href = '/auth/google';
        document.body.appendChild(login_button)


     }
}