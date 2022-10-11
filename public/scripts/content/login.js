const injectLogin = (request) => {
    const box = document.getElementById("site-login-main-wrapper");

    if (box === null) {
        setTimeout(() => {
            injectLogin();
        }, 500)
        return;
    }

    const loginNotice = document.createElement("p");
    loginNotice.innerHTML = "[NEW] The new Argotray feature from Argo+ allows you to view today's lunch, schedule, and due assignments without signing in. Try now by pinning the extension in the top right and clicking on its icon!";

    box.appendChild(loginNotice);
}