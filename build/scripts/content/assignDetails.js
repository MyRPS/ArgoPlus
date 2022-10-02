/* global chrome, location */

console.log("Argo+: html script setup")

const injectFinalGrade = (resultsDiv, gotPoints, assignmentDetails, allGrades, classIndex) => {

    while (resultsDiv.firstChild)
    {
        resultsDiv.removeChild(resultsDiv.firstChild);
    }

    const resultThisAss = document.createElement("p");
    resultThisAss.innerHTML = `${Math.round(gotPoints / assignmentDetails["MaxPoints"] * 100 * 100) / 100}%`;
    resultThisAss.style.fontSize = "30px";
    resultThisAss.style.fontWeight = "bold";

    const resultThisAssSubtext = document.createElement("p");
    resultThisAssSubtext.innerHTML = `On ${assignmentDetails["ShortDescription"]}`;

    let rawGotPoints = allGrades.map((val) => {return Number(val["Points"]);}).reduce((accumulator, value) => {
        return accumulator + value;
    }, 0);

    let rawMaxPoints = allGrades.map((val) => {return Number(val["MaxPoints"]);}).reduce((accumulator, value) => {
        return accumulator + value;
    }, 0);

    let weighted = false

    for (var gradeStruct in allGrades)
    {
        if (gradeStruct["Weight"] != null)
        {
            weighted = true;
        }
    }

    if (weighted)
    {
        alert("This assignment has weighted grades, which Argo+ does not (yet) support. The grade simulator will not work.");
    }

    rawGotPoints += Number(gotPoints);
    rawMaxPoints += Number(assignmentDetails["MaxPoints"]);

    const resultOverall = document.createElement("p");
    resultOverall.innerHTML = `${Math.round((rawGotPoints/rawMaxPoints * 100) * 100) / 100}%`;
    resultOverall.style.fontSize = "30px";
    resultOverall.style.fontWeight = "bold";

    const resultOverallSubtext = document.createElement("p");
    resultOverallSubtext.innerHTML = `In ${assignmentDetails["SectionLinks"][classIndex]["Section"]["Name"]} <br/> (${weighted ? "Weigthed Class" : "Unweighted Class"})`;
    
    resultsDiv.appendChild(resultThisAss);
    resultsDiv.appendChild(resultThisAssSubtext);
    resultsDiv.appendChild(resultOverall);
    resultsDiv.appendChild(resultOverallSubtext);
}

const injectGradeSimulator = async (assignmentDetail, classIndex) => {
    
    const injectionLocation = document.getElementsByClassName("bb-tile-content-section");
    let earnedGrade = document.getElementsByClassName("assignment-detail-status-label")[0];

    if (injectionLocation.length === 0 || earnedGrade === undefined || injectionLocation[0] === undefined)
    {
        setTimeout(() => {injectGradeSimulator(assignmentDetail, classIndex)}, 500);
        return;
    }

    const earnedGradeText = earnedGrade.innerHTML;

    if (earnedGradeText.includes("Graded:") || assignmentDetail["MaxPoints"] === 0)
    {
        return;
    }

    const UID = await fetch("https://rutgersprep.myschoolapp.com/api/webapp/context").then(r => r.json()).then(result => {return result["UserInfo"]["UserId"]});

    if (earnedGradeText.includes("Graded"))
    {
        const gradeLink = `https://rutgersprep.myschoolapp.com/api/datadirect/AssignmentStudentDetail?format=json&studentId=${UID}&AssignmentIndexId=${assignmentDetail["SectionLinks"][classIndex]["AssignmentIndexId"]}`;
        earnedGrade.innerHTML = `Graded <a href="${gradeLink}" target="_blank">Click to check.</a>`;
        return;
    }

    const allGrades = await fetch(`https://rutgersprep.myschoolapp.com/api/datadirect/GradeBookPerformanceAssignmentStudentList/?sectionId=${assignmentDetail["SectionLinks"][classIndex]["SectionId"]}&markingPeriodId=${assignmentDetail["SectionLinks"][classIndex]["MarkingPeriodId"]}&studentUserId=${UID}&personaId=2`).then(r => r.json()).then(result => {return result});

    const gradeSimulator = document.createElement("div");
    gradeSimulator.style.width = "100%";
    gradeSimulator.style.height = "100%";
    gradeSimulator.style.backgroundColor = "#fff";
    gradeSimulator.style.color = "#000";
    gradeSimulator.style.textAlign = "center";
    gradeSimulator.style.paddingTop = "6px";
    gradeSimulator.style.marginRight = "25px";
    gradeSimulator.style.marginTop = "5px";
    gradeSimulator.style.position = "relative";
    gradeSimulator.className = "ArgoPlus-Display";

    const gradeSimulatorText = document.createElement("p");
    gradeSimulatorText.innerHTML = "Grade Simulator (SUPER EXPERIMENTAL)";
    gradeSimulatorText.style.display = "inline-block";
    gradeSimulatorText.style.marginLeft = "10px";
    gradeSimulatorText.style.marginRight = "10px";
    gradeSimulatorText.style.fontSize = "30px";
    gradeSimulatorText.style.fontWeight = "bold";

    console.log(earnedGrade);

    const resultsDiv = document.createElement("div");

    const gradeSimulatorInput = document.createElement("input");
    gradeSimulatorInput.type = "number";
    gradeSimulatorInput.max = assignmentDetail["MaxPoints"];
    gradeSimulatorInput.min = "0";
    gradeSimulatorInput.value = assignmentDetail["MaxPoints"];
    gradeSimulatorInput.style.width = "100px";
    gradeSimulatorInput.style.height = 50;
    gradeSimulatorInput.style.fontSize = "12px";
    gradeSimulatorInput.style.padding = "5px";
    gradeSimulatorInput.style.marginBottom = "5px";
    gradeSimulatorInput.onchange = () => {
        injectFinalGrade(resultsDiv, gradeSimulatorInput.value, assignmentDetail, allGrades, classIndex);
    }

    const gradeSimulatorInputSubtext = document.createElement("p");
    gradeSimulatorInputSubtext.innerHTML = "/ " + assignmentDetail["MaxPoints"];
    gradeSimulatorInputSubtext.width = "50px";
    gradeSimulatorInputSubtext.style.display = "inline-block";
    gradeSimulatorInputSubtext.style.marginInlineStart = "5px";
    gradeSimulatorInputSubtext.style.fontSize = "20px";

    gradeSimulator.appendChild(gradeSimulatorText);
    gradeSimulator.appendChild(gradeSimulatorInput);
    gradeSimulator.appendChild(gradeSimulatorInputSubtext);
    // gradeSimulator.appendChild(gradeSimulatorButton);
    gradeSimulator.appendChild(resultsDiv);

    injectionLocation[1].appendChild(gradeSimulator);

    injectFinalGrade(resultsDiv, assignmentDetail["MaxPoints"], assignmentDetail, allGrades, classIndex);
}

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






// code to check url then inject
const checkForAssDetailUrl = async (request) => {
    // console.log("argoplus: recieve message to content script w/ " + request.url);

    const baseURL = "https://rutgersprep.myschoolapp.com/app/student#assignmentdetail/";

    if (request.url.includes(baseURL))
    {
        console.log("ArgoPlus: Assignment Details Page Detected");
        
        const assignmentId = request.url.match("[0-9]+/[0-9]+")[0].split("/")[0];
        const assignmentIndexId = request.url.match("[0-9]+/[0-9]+")[0].split("/")[1];

        // console.log(assignmentId + " and " + assignmentIndexId);

        const assignmentDetail = await fetchAssignmentDetailXHR(assignmentId);

        var classIndex = 0;
        for (; classIndex < assignmentDetail["SectionLinks"].length; classIndex++)
        {
            if (assignmentDetail["SectionLinks"][classIndex]["AssignmentIndexId"] == assignmentIndexId)
            {
                // console.log("match at " + classIndex);
                break;
            }
        }

        // console.log("classIndex: " + classIndex);
        
        injectDisplay(assignmentDetail["ShortDescription"], "#fff", true, false, "", "#272727");
        injectDisplay(assignmentDetail["SectionLinks"][classIndex]["Section"]["Name"], "#fff", false, false, "", "#707070")
        injectDisplay(assignmentDetail["LongDescription"], "#fff", false, false, "", "#272727");

        injectDisplay("Tags (Beta): ", "#fff", true, false, "", "#272727");

        injectDisplay("Assignment Type: " + assignmentDetail["AssignmentType"] , "#2DC8D0");

        if (assignmentDetail["DropboxResub"])
        {
            injectDisplay("Resubmittable Until Deadline", "#2DC8D0");
        }

        injectDisplay("Posted " + assignmentDetail["SectionLinks"][classIndex]["AssignmentDate"], "#7368bc");
        injectDisplay("Due " + assignmentDetail["SectionLinks"][classIndex]["DueDate"] + ",  " + assignmentDetail["SectionLinks"][classIndex]["DueTime"], "#7368bc");

        injectDisplay(assignmentDetail["MaxPoints"] > 0 ? assignmentDetail["MaxPoints"] + " Points" : "No Grade (0 Points)", "#71BC68");
        
        if (assignmentDetail["Factor"] > 1)
        {
            injectDisplay("Weight Factor: " + assignmentDetail["Factor"], "#71BC68");
        }

        if (assignmentDetail["DownloadItems"].length > 0)
        {
            injectDisplay("Downloads: ", "#fff", true, false, "", "#272727");

            for (var downloadKey of assignmentDetail["DownloadItems"])
            {
                injectDisplay(downloadKey["ShortDescription"] + " (" + downloadKey["FriendlyFileName"] + ")", "#EEE", false, false, downloadKey["DownloadUrl"]);
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

        injectGradeSimulator(assignmentDetail, classIndex);
    }
}

chrome.runtime.onMessage.addListener(checkForAssDetailUrl);
checkForAssDetailUrl({url: location.href});