/* global chrome, location*/

const matchURLs = async (request) => {
    // console.log("argoplus: recieve message to content script w/ " + request.url);

    const assignmentURL = "https://rutgersprep.myschoolapp.com/app/student#assignmentdetail/";
    const inboxURL = "https://rutgersprep.myschoolapp.com/app/student#message/inbox";

    if (request.url.includes(assignmentURL))
    {
        console.log("ArgoPlus: Assignment Details Page Detected");
        injectAssignmentDetail(request);
    }

    if (request.url.includes(inboxURL))
    {
        console.log("ArgoPlus: Mail Detected");
        injectMail(request);
    }

    if (request.url.includes("https://rutgersprep.myschoolapp.com/app/")) {
        refreshCalendar();
    }
};

chrome.runtime.onMessage.addListener(matchURLs);
matchURLs({url: location.href});