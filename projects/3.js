let missing_required_field_ids = new Set();
let missing_field_id_to_err_msg = new Map();
let error_displayed = false;
document.addEventListener("DOMContentLoaded", set_up);

function set_up() {
    set_up_listeners();
    populate_id_to_err_msg_map();
}

function set_up_listeners() {
    document.querySelector("#submit-btn").addEventListener("click", redirect);
    document.querySelector("#password-confirmation").addEventListener("blur",
                                                                      validatePasswords);
    document.querySelector("#password").addEventListener("blur", validatePassword);
    document.querySelector("#email").addEventListener("blur", validateEmail);

    for (let req of document.querySelectorAll(".js-required")) {
        req.addEventListener("blur", required_field_listener);
    }

}

function populate_id_to_err_msg_map() {
    missing_field_id_to_err_msg.set('username', 'Username');
    missing_field_id_to_err_msg.set('name', 'Name');
    missing_field_id_to_err_msg.set('email', 'E-mail');
    missing_field_id_to_err_msg.set('password', 'Password');
    missing_field_id_to_err_msg.set('password-confirmation', 'Confirm Password');
}

function required_field_listener(event) {
    let contents = event.target.value;
    if (contents == "") {
        show_required_field_err_msg(event.target);
    } else {
        hide_required_field_err_msg(event.target);
    }
}

function show_required_field_err_msg(missing) {
    ensure_required_field_err_msg_contianer();
    missing_required_field_ids.add(missing.id);
    update_missing_field_error_display();
}

function hide_required_field_err_msg(present) {
    missing_required_field_ids.delete(present.id);
    update_missing_field_error_display();
}

function update_missing_field_error_display() {
    update_err_msg_list();
    toggle_required_field_err_msg_container();
}

function update_err_msg_list() {
    let err_msg_list = get_required_field_err_msg_list();
    remove_children(err_msg_list);
    for (let field_id of missing_required_field_ids) {
        err_msg_list.appendChild(create_err_msg_li(field_id));
    }
}

function get_required_field_err_msg_list() {
    return document.querySelector("#missing-required-fields");
}

function create_err_msg_li(field_id) {
    let li = document.createElement("li");
    let li_text = document.createTextNode(missing_field_id_to_err_msg.get(field_id));
    li.appendChild(li_text);
    return li;
}

function toggle_required_field_err_msg_container() {
    let err_msg_list = document.querySelector("#missing-required-fields");
    if (!err_msg_list.hasChildNodes()) {
        let err_display = document.querySelector("#error-display");
        let container = document.querySelector("#required-field-error");
        err_display.removeChild(container);
        error_displayed = false;
    }
    else {
        error_displayed = true;
    }
}

function create_required_field_err_msg_container() {
    let missing_field_container = document.createElement("div");
    missing_field_container.id = "required-field-error";
    missing_field_container.appendChild(document.createTextNode("ERROR: The following required fields " + "are missing:"));
    let error_list = document.createElement("ul");
    error_list.id = "missing-required-fields";
    missing_field_container.appendChild(error_list);
    return missing_field_container;
}

function ensure_required_field_err_msg_contianer() {
    let missing_field_container = document.querySelector("#required-field-error");
    if (missing_field_container) {
        return;
    }
    missing_field_container = create_required_field_err_msg_container();
    document.querySelector("#error-display").appendChild(missing_field_container);
}

function remove_children(node) {
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }
}


function validateEmail() {
    let email = document.forms["project-form"]["email"].value;
    let beforeAt = 0;
    let beforeDot = 0;
    let afterDot = 0;
    let hitAt = false;
    let hitDot = false;

    let errMessage = document.getElementById('error-display');
    let errDiv = document.createElement("div");


    for (let i = 0; i < email.length; i++) {
        if (email.charAt(i) !== '@' && hitAt === false) {
            beforeAt++;
        }
        else if (email.charAt(i) === '@') {
            hitAt = true;
        }
        if (email.charAt(i) !== '.' && hitAt) {
            beforeDot++;
        }
        else if (email.charAt(i) === '.') {
            hitDot = true;
        }
        if (hitDot && email.charAt(i) !== '.') {
            afterDot++;
        }
    }

    if (beforeDot === 0 || afterDot < 2 || beforeAt === 0) {
        if (document.getElementById('invalid-email-error') === null) {
            console.debug("Handling email error");
            errDiv.id = "invalid-email-error";
            errDiv.appendChild(document.createTextNode(
                "ERROR: The email entered does not meet the requirements (c@c.cc)"));
            errMessage.appendChild(errDiv);
            error_displayed = true;
        }
    }
    else if (document.getElementById('invalid-email-error') !== null && beforeDot !==
        0 && afterDot > 1 && beforeAt !== 0) {
        console.debug("Removing email error div");
        errDiv = document.getElementById('invalid-email-error');
        errDiv.remove();
        error_displayed = false;

    }

}

function validatePasswords() {
    let password = document.forms["project-form"]["password"].value;
    let confirmPassword = document.forms["project-form"]["password-confirmation"]
        .value;
    let errMessage = document.getElementById('error-display');
    let errDiv = document.createElement("div");
    if (password !== confirmPassword) {
        if (document.getElementById('password-mismatch-error') === null) {
            console.debug("Handling password mismatch error");
            errDiv.id = "password-mismatch-error";
            errDiv.appendChild(document.createTextNode(
                "ERROR: Passwords do not match"));
            errMessage.appendChild(errDiv);
            error_displayed = true;

        }


    }
    else if (password === confirmPassword && document.getElementById(
            'password-mismatch-error') !== null) {
        errDiv = document.getElementById('password-mismatch-error');
        errDiv.remove();
        error_displayed = false;

    }
}

function validatePassword() {
    let numbers = ['0', '2', '3', '4', '5', '6', '7', '8', '9'];
    let capitals = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
        "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
    ];
    let capitalCounter = 0;
    let numberCounter = 0;
    let errMessage = document.getElementById('error-display');
    let errDiv = document.createElement("div");

    let password = document.forms["project-form"]["password"].value;

    validatePasswords();

    for (let i = 0; i < password.length; i++) {
        for (let g = 0; g < numbers.length; g++) {
            if (password.charAt(i) === numbers[g]) {
                numberCounter++;
            }
        }
    }
    for (let i = 0; i < password.length; i++) {
        for (let g = 0; g < capitals.length; g++) {
            if (password.charAt(i) === capitals[g]) {
                capitalCounter++;
            }
        }

    }

    if (capitalCounter === 0 || numberCounter === 0 || password.length < 8) {
        if (document.getElementById('unmet-password-constraints-error') === null) {
            console.debug("Handling password conformance error");
            errDiv.id = "unmet-password-constraints-error";
            errDiv.appendChild(document.createTextNode(
                "ERROR: Password does not meet the requirements! (length of 8, at least 1 number, and at least 1  capital letter)"
            ));
            errMessage.appendChild(errDiv);
            error_displayed = true;

        }

    }
    else if (document.getElementById('unmet-password-constraints-error') !== null &&
        capitalCounter !== 0 && numberCounter !== 0) {
        errDiv = document.getElementById('unmet-password-constraints-error');
        errDiv.remove();
        error_displayed = false;

    }
}

function redirect() {
    if (!error_displayed) {
        window.location.href = "3_submit.html";
    }
}


