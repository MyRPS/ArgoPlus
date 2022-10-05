/* global chrome, location */

console.log("Argo+: html script setup")

const injectFinalGrade = (resultsDiv, gotPoints, assignmentDetail, allGrades, classIndex, realClassAvg) => {

    while (resultsDiv.firstChild)
    {
        resultsDiv.removeChild(resultsDiv.firstChild);
    }

    const resultThisAss = document.createElement("p");
    resultThisAss.innerHTML = `${Math.round(gotPoints / assignmentDetail["MaxPoints"] * 100 * 100) / 100}%`;
    resultThisAss.style.fontSize = "30px";
    resultThisAss.style.fontWeight = "regular";

    const resultThisAssSubtext = document.createElement("p");
    resultThisAssSubtext.innerHTML = `On ${assignmentDetail["ShortDescription"]}`;
    resultThisAssSubtext.style.color = "#707070";
   
    let rawGotPoints = allGrades.map((val) => {return Number(val["Points"]);}).reduce((accumulator, value) => {
        return accumulator + value;
    }, 0);

    let rawMaxPoints = allGrades.map((val) => {return Number(val["MaxPoints"]);}).reduce((accumulator, value) => {
        return accumulator + value;
    }, 0);

    const experimentalGotPoints = rawGotPoints + Number(gotPoints);
    const experimentalMaxPoints = rawMaxPoints + Number(assignmentDetail["MaxPoints"]);

    const before = Math.round((rawGotPoints/rawMaxPoints * 100) * 100) / 100;
    
    if (before != realClassAvg)
    {
        injectDisplay(`Your current real class average (${realClassAvg}%) doesn't match up with our algorithm. Please use the prediction with a grain of salt.`, "#ffaaaf", false, false, "", "#fff", true);
    }

    const resultOverall = document.createElement("p");
    resultOverall.innerHTML = `${before}% -> ${Math.round((experimentalGotPoints/experimentalMaxPoints * 100) * 100) / 100}%`;
    resultOverall.style.fontSize = "30px";
    resultOverall.style.fontWeight = "regular";

    const resultOverallSubtext = document.createElement("p");
    resultOverallSubtext.innerHTML = `In ${assignmentDetail["SectionLinks"][classIndex]["Section"]["Name"]} (Before & After) <br/> `//(${weighted ? "Weight-based Class" : "Points-based Class"})`;
    resultOverallSubtext.style.color = "#707070";
    
    resultsDiv.appendChild(resultThisAssSubtext);
    resultsDiv.appendChild(resultThisAss);
    resultsDiv.appendChild(resultOverallSubtext);
    resultsDiv.appendChild(resultOverall);
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

    const UID = await fetch("https://rutgersprep.myschoolapp.com/api/webapp/context").then(r => r.json()).then(result => {return result["UserInfo"]["UserId"]});

    if (assignmentDetail["MaxPoints"] === 0)
    {
        return;
    }

    const gradeURL = `https://rutgersprep.myschoolapp.com/api/datadirect/GradeBookPerformanceAssignmentStudentList/?sectionId=${assignmentDetail["SectionLinks"][classIndex]["SectionId"]}&markingPeriodId=${assignmentDetail["SectionLinks"][classIndex]["MarkingPeriodId"]}&studentUserId=${UID}&personaId=2`;
    console.log(gradeURL);
    const allGrades = await fetch(gradeURL).then(r => r.json()).then(result => {return result});

    let weighted = null
    let realClassAvg = null;

    for (var gradeStruct in allGrades)
    {
        const curStruct = allGrades[gradeStruct]

        realClassAvg = curStruct["SectionGrade"];

        if (curStruct["Weight"] != null && curStruct["AssignmentId"] === assignmentDetail["AssignmentId"])
        {
            // console.log("weight " + curStruct["Weight"])
            weighted = curStruct["Weight"] + "% grade weight";
            break;
        }
        // console.log("struct " + gradeStruct);
    }

    if (weighted !== null)
    {
        injectDisplay(weighted, "#71BC68", false, true, "", "#FFF", true);
    }

    if (earnedGradeText.includes("Graded"))
    {
        const gradeLink = `https://rutgersprep.myschoolapp.com/api/datadirect/AssignmentStudentDetail?format=json&studentId=${UID}&AssignmentIndexId=${assignmentDetail["SectionLinks"][classIndex]["AssignmentIndexId"]}`;

        const grade = await fetch(gradeLink).then(r => r.json()).then(result => {return result[0]["pointsEarned"]});

        if (grade === null)
        {
            return;
        }

        earnedGrade.innerHTML = `Graded: ${grade} of ${assignmentDetail["MaxPoints"]} (${Math.round(grade / assignmentDetail["MaxPoints"] * 100 * 100) / 100}%)`;
        return;
    }

    const gradeSimulator = document.createElement("div");
    gradeSimulator.style.width = "100%";
    gradeSimulator.style.height = "100%";
    // gradeSimulator.style.backgroundColor = "#71BC68";
    gradeSimulator.style.color = "#000";
    gradeSimulator.style.textAlign = "center";
    gradeSimulator.style.paddingTop = "6px";
    gradeSimulator.style.marginRight = "25px";
    gradeSimulator.style.marginTop = "5px";
    gradeSimulator.style.position = "relative";
    gradeSimulator.className = "ArgoPlus-Display";

    const gradeSimulatorText = document.createElement("p");
    gradeSimulatorText.innerHTML = "Score+";
    // gradeSimulatorText.style.display = "inline-block";
    gradeSimulatorText.style.marginLeft = "10px";
    gradeSimulatorText.style.marginRight = "10px";
    gradeSimulatorText.style.fontSize = "30px";
    gradeSimulatorText.style.fontWeight = "bold";

    const gradeSimulatorSubText = document.createElement("p");
    gradeSimulatorSubText.innerHTML = "Enter your grade here to calculate your final score in this class and the assignment. Heavy WIP and not 100% accurate.";
    gradeSimulatorSubText.style.marginLeft = "10px";
    gradeSimulatorSubText.style.marginRight = "10px";
    gradeSimulatorSubText.style.color = "#707070";

    const divider = document.createElement("hr");
    divider.style.width = "100%";

    const resultsDiv = document.createElement("details");
    resultsDiv.style.paddingTop = "10px";
    resultsDiv.innerHTML = "<summary>See Grade</summary>";
    resultsDiv.style.paddingBottom = "10px";

    const gradeSimulatorInput = document.createElement("input");
    gradeSimulatorInput.type = "number";
    gradeSimulatorInput.max = assignmentDetail["MaxPoints"];
    gradeSimulatorInput.min = "0";
    gradeSimulatorInput.value = assignmentDetail["MaxPoints"];
    gradeSimulatorInput.style.width = "50px";
    gradeSimulatorInput.style.alignContent = "end";
    gradeSimulatorInput.style.height = 50;
    gradeSimulatorInput.style.backgroundColor = "#EFEFEF";
    gradeSimulatorInput.style.border = "none";
    gradeSimulatorInput.style.borderRadius = "5px";
    gradeSimulatorInput.style.fontSize = "20px";
    // gradeSimulatorInput.style.padding = "5px";
    gradeSimulatorInput.style.marginTop = "15px";
    gradeSimulatorInput.style.marginBottom = "15px";
    gradeSimulatorInput.onchange = () => {
        injectFinalGrade(resultsDiv, gradeSimulatorInput.value, assignmentDetail, allGrades, classIndex, realClassAvg);
    }

    const gradeSimulatorInputSubtext = document.createElement("p");
    gradeSimulatorInputSubtext.innerHTML = "/ " + assignmentDetail["MaxPoints"] + " (Max)";
    gradeSimulatorInputSubtext.width = "50px";
    gradeSimulatorInputSubtext.style.display = "inline-block";
    gradeSimulatorInputSubtext.style.marginInlineStart = "5px";
    gradeSimulatorInputSubtext.style.fontSize = "20px";

    // gradeSimulator.appendChild(divider);
    // gradeSimulator.appendChild(gradeSimulatorText);
    gradeSimulator.appendChild(gradeSimulatorInput);
    gradeSimulator.appendChild(gradeSimulatorInputSubtext);
    gradeSimulator.appendChild(gradeSimulatorSubText);
    // gradeSimulator.appendChild(gradeSimulatorButton);
    // gradeSimulator.appendChild(divider);
    gradeSimulator.appendChild(resultsDiv);

    injectionLocation[1].appendChild(gradeSimulator);

    injectFinalGrade(resultsDiv, assignmentDetail["MaxPoints"], assignmentDetail, allGrades, classIndex, realClassAvg);
}

const injectDisplay = (label, color, isHeader = false, showBeta = true, URL = "", fontColor = "#fff", onOther = false) => {

    const injectionLocation = document.getElementsByClassName("bb-tile-content-section");

    if (injectionLocation.length === 0 || injectionLocation[0] === undefined || injectionLocation[1] === undefined)
    {
        setTimeout(() => {injectDisplay(label, color, isHeader, showBeta, URL, fontColor, onOther)}, 500);
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
        pointDisplayText.target = "_blank";
        pointDisplayText.style.paddingTop = "7px";
        pointDisplayText.style.paddingBottom = "7px";
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
    if (!onOther)
    {
        while (injectionLocation[0].firstChild) {

            const className = injectionLocation[0].firstChild.className;
            const id = injectionLocation[0].firstChild.id;

            if (className === "ArgoPlus-Display") // || id === "assignment-detail-linked-content")
            {
                break;
            }

            injectionLocation[0].removeChild(injectionLocation[0].firstChild);
        }
    }
    
    injectionLocation[onOther ? 1 : 0].appendChild(pointDisplay)
}

const fetchAssignmentDetailXHR = async (assignmentID) => {

    const assignmentDetail = await fetch(`https://rutgersprep.myschoolapp.com/api/assignment2/read/${assignmentID}/?format=json`).then(r => r.json()).then(result => {
        return result;
    })

    return assignmentDetail;
}






// code to check url then inject
const injectAssignmentDetail = async (request) => {
    // console.log("argoplus: recieve message to content script w/ " + request.url);

    // const baseURL = "https://rutgersprep.myschoolapp.com/app/student#assignmentdetail/";

    // if (request.url.includes(baseURL))
    // {
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
        injectDisplay(assignmentDetail["SectionLinks"][classIndex]["Section"]["Name"], "#fff", false, false, `https://rutgersprep.myschoolapp.com/app/student#academicclass/${assignmentDetail["SectionLinks"][classIndex]["SectionId"]}/0/bulletinboard`, "#707070")
        injectDisplay(assignmentDetail["LongDescription"], "#fff", false, false, "", "#272727");

        if (assignmentDetail["DownloadItems"].length > 0)
        {
            for (var downloadKey of assignmentDetail["DownloadItems"])
            {
                injectDisplay("📥 " + downloadKey["ShortDescription"] + " (" + downloadKey["FriendlyFileName"] + ")", "#fff", false, false, downloadKey["DownloadUrl"], "#FFF", false);
            }
        }

        if (assignmentDetail["LinkItems"].length > 0)
        {
            for (var linkKey of assignmentDetail["LinkItems"])
            {
                injectDisplay("🔗 " + linkKey["ShortDescription"], "#fff", false, false, linkKey["Url"], "#FFF", false);
            }
        }

        // if (assignmentDetail["LinkItems"].length > 0 || assignmentDetail["DownloadItems"].length > 0)
        // {
        //     injectDisplay("Attachments:", "#fff", true, false, "", "#272727", true);
        // }

        //tags

        injectDisplay("Assignment Type: " + assignmentDetail["AssignmentType"] , "#2DC8D0");

        injectDisplay(assignmentDetail["DropboxResub"] ? "Resubmittable Until Deadline" : "No Resubmittions Allowed", "#2DC8D0");

        injectDisplay("Posted " + assignmentDetail["SectionLinks"][classIndex]["AssignmentDate"], "#7368bc");
        injectDisplay("Due " + assignmentDetail["SectionLinks"][classIndex]["DueDate"] + ",  " + assignmentDetail["SectionLinks"][classIndex]["DueTime"], "#7368bc");

        if (assignmentDetail["MaxPoints"] === 0)
        {
            injectDisplay("Ungraded (0 Points)", "#71BC68", false, true, "", "#fff", true);
        }
        
        if (assignmentDetail["Factor"] > 1)
        {
            injectDisplay("Factor: " + assignmentDetail["Factor"], "#71BC68", false, true, "", "#fff", true);
        }

        injectGradeSimulator(assignmentDetail, classIndex);
    // }
}

// chrome.runtime.onMessage.addListener(checkForAssDetailUrl);
// checkForAssDetailUrl({url: location.href});

// export default injectAssignmentDetail;