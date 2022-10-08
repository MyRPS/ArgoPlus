/* global chrome, location*/

const matchURLs = async (request) => {
    // console.log("argoplus: recieve message to content script w/ " + request.url);

    const assignmentURL = "https://rutgersprep.myschoolapp.com/app/student#assignmentdetail/";
    const baseRPSURL = "https://rutgersprep.myschoolapp.com/app/";

    if (request.url.includes(assignmentURL))
    {
        console.log("ArgoPlus: Assignment Details Page Detected");
        injectAssignmentDetail(request);
    }

    if (request.url.includes(baseRPSURL) && request.url.includes("message/inbox"))
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