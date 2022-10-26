/* global chrome, location*/

const matchURLs = async (request) => {
    // console.log("argoplus: recieve message to content script w/ " + request.url);

    // const assignmentURL = "https://rutgersprep.myschoolapp.com/app/student#assignmentdetail/";
    const baseRPSURL = "https://rutgersprep.myschoolapp.com/app/";

    const isStudent = request.url.includes("https://rutgersprep.myschoolapp.com/app/student");

    if (request.url.includes("https://rutgersprep.myschoolapp.com/app/")) {
        refreshCalendar();
    }

    if (isStudent)
    {
        if (request.url.includes("assignmentdetail"))
        {
            console.log("ArgoPlus: Assignment Details Page Detected");
            injectAssignmentDetail(request);
        }
    }

    if (request.url.includes(baseRPSURL) && request.url.includes("message/inbox") && !request.url.includes("archive"))
    {
        console.log("ArgoPlus: Mail Detected");
        injectMail(request);
    }

    if (request.url.includes(baseRPSURL) && (request.url.includes("message/conversation") || request.url.includes("message/compose")) && !request.url.includes("archive"))
    {
        console.log("ArgoPlus: Convo Page Detected");
        injectReply();
    }

    if (request.url === "https://rutgersprep.myschoolapp.com/app/student#login")
    {
        console.log("ArgoPlus: Login Page Detected");
        injectLogin(request);
    }
};

chrome.runtime.onMessage.addListener(matchURLs);
matchURLs({url: location.href});