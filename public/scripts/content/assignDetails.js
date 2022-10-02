/* global chrome, location */

console.log("Argo+: html script setup")

const injectDisplay = (label, color, isHeader = false, showBeta = true, URL = "", fontColor = "#fff") => {

    const injectionLocation = document.getElementsByClassName("bb-tile-content-section");

    if (injectionLocation.length === 0 || injectionLocation[0] === undefined)
    {
        setTimeout(() => {injectDisplay(label, color, isHeader, showBeta, URL, fontColor)}, 500);
        return;
    }

    const pointDisplay = document.createElement("div");
    // pointDisplay.style.borderRadius = "25px";
    pointDisplay.style.width = "100%";
    pointDisplay.style.height = "100%";
    pointDisplay.style.backgroundColor = color;
    pointDisplay.style.color = fontColor;
    pointDisplay.style.textAlign = "center";
    pointDisplay.style.paddingTop = "6px";
    pointDisplay.style.marginRight = "25px";
    pointDisplay.style.marginTop = "5px";
    pointDisplay.style.position = "relative";
    pointDisplay.className = "ArgoPlus-Display";

    const pointDisplayText = document.createElement(URL !== "" ? "a" : "p");
    pointDisplayText.innerHTML = label;
    pointDisplayText.style.display = "inline-block";
    pointDisplayText.style.marginLeft = showBeta ? "60px" : "10px";
    pointDisplayText.style.marginRight = "10px";
    
    pointDisplayText.style.fontSize = isHeader ? "30px" : "15px";
    pointDisplayText.style.fontWeight = isHeader ? "bold" : "regular";
    
    if (URL !== "")
    {
        pointDisplayText.href = URL;
        // pointDisplayText.style.textDecoration = "none";
    }

    const betaTag = document.createElement("img");
    betaTag.src = "https://media.discordapp.net/attachments/663150753946402820/1025960450963275826/Group_1.png";
    // betaTag.style.width = "53px";
    betaTag.style.height = "100%";
    betaTag.style.left = "0px";
    betaTag.style.top = "0px";
    betaTag.style.position = "absolute";
    betaTag.style.zIndex = "1";

    pointDisplay.appendChild(pointDisplayText);

    if (showBeta)
    {
        pointDisplay.appendChild(betaTag);
    }

    //inject
    while (injectionLocation[0].firstChild) {

        const className = injectionLocation[0].firstChild.className;
        const id = injectionLocation[0].firstChild.id;

        if (className === "ArgoPlus-Display") // || id === "assignment-detail-linked-content")
        {
            break;
        }

        injectionLocation[0].removeChild(injectionLocation[0].firstChild);
    }
    
    injectionLocation[0].appendChild(pointDisplay)
}

const fetchAssignmentDetailXHR = async (assignmentID) => {

    const assignmentDetail = await fetch(`https://rutgersprep.myschoolapp.com/api/assignment2/read/${assignmentID}/?format=json`).then(r => r.json()).then(result => {
        return result;
    })

    return assignmentDetail;
}

const checkForAssDetailUrl = async (request) => {
    // console.log("argoplus: recieve message to content script w/ " + request.url);

    const baseURL = "https://rutgersprep.myschoolapp.com/app/student#assignmentdetail/";

    if (request.url.includes(baseURL))
    {
        console.log("ArgoPlus: Assignment Details Page Detected");
        const assignmentDetail = await fetchAssignmentDetailXHR(request.url.match("/[0-9]+?/")[0].replaceAll("/", ""));
        
        // for (var key of Object.keys(assignmentDetail))
        // {
        //     injectDisplay(key + ": " + assignmentDetail[key]);
        // }
        
        injectDisplay(assignmentDetail["ShortDescription"], "#fff", true, false, "", "#272727");
        injectDisplay(assignmentDetail["SectionLinks"][0]["Section"]["Name"], "#fff", false, false, "", "#707070")
        injectDisplay(assignmentDetail["LongDescription"], "#fff", false, false, "", "#272727");

        injectDisplay("Tags (Beta): ", "#fff", true, false, "", "#272727");

        if (assignmentDetail["DropboxResub"])
        {
            injectDisplay("Resubmittable Until Deadline", "#2DC8D0");
        }

        injectDisplay("Posted " + assignmentDetail["SectionLinks"][0]["AssignmentDate"], "#7368bc");
        injectDisplay("Due " + assignmentDetail["SectionLinks"][0]["DueDate"] + ",  " + assignmentDetail["SectionLinks"][0]["DueTime"], "#7368bc");

        injectDisplay(assignmentDetail["MaxPoints"] > 0 ? assignmentDetail["MaxPoints"] + " Points" : "No Grade (0 Points)", "#71BC68");

        if (assignmentDetail["DownloadItems"].length > 0)
        {
            injectDisplay("Downloads: ", "#fff", true, false, "", "#272727");

            for (var downloadKey of assignmentDetail["DownloadItems"])
            {
                injectDisplay(downloadKey["ShortDescription"], "#EEE", false, false, downloadKey["DownloadUrl"]);
            }
        }

        if (assignmentDetail["LinkItems"].length > 0)
        {
            injectDisplay("Links: ", "#fff", true, false, "", "#272727");

            for (var linkKey of assignmentDetail["LinkItems"])
            {
                injectDisplay(linkKey["ShortDescription"], "#EEE", false, false, linkKey["Url"]);
            }
        }
    }
}

chrome.runtime.onMessage.addListener(checkForAssDetailUrl);
checkForAssDetailUrl({url: location.href});