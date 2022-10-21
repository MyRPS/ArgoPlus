/* global chrome, location */

// console.log("Argo+: html script setup")

const injectSubmissionHelper = () => {
    //a list of math symbols you need
    const mathSymbols = {
        pi: "π",
        theta: "θ",
        alpha: "α",
        beta: "β",
        gamma: "γ",
        delta: "δ",
        epsilon: "ε",
        integral: "∫",
        infinity: "∞",
        "square root": "√",
        "plus minus": "±",
        equals: "=",
        "not equals": "≠",
        "less than": "<",
        "greater than": ">",
        "less than or equal to": "≤",
        "greater than or equal to": "≥",
        "left floor": "⌊",
        "right floor": "⌋",
        "left ceiling": "⌈",
        "right ceiling": "⌉",
    };

    //a list of science symbols you need
    const scienceSymbols = {
        degree: "°",
        micro: "μ",
        ohm: "Ω",
        angstrom: "Å",
    };

    let injectPoint = document.getElementsByClassName(
        "online-submission-text-container"
    );

    if (injectPoint.length === 0) {
        // console.log("Argo+: Injecting submission helper fail");
        setTimeout(injectSubmissionHelper, 2000);
        return;
    }

    injectPoint = injectPoint[0];

    // console.log("Argo+: Injecting submission helper");

    const addSymbol = (symbol) => {
        //copy symbol
        navigator.clipboard.writeText(symbol);

        // let iframe = document.getElementById("online-submission-text_ifr");

        // if (iframe === null) {
        //     console.log("Argo+: Textarea not found");
        //     setTimeout(() => addSymbol(symbol), 100);
        //     return;
        // }

        // let textArea = iframe.contentWindow.document.getElementById("tinymce");

        // if (textArea === null) {
        //     console.log("Argo+: Textarea not found");
        //     setTimeout(() => addSymbol(symbol), 100);
        //     return;
        // }

        // let cursorPos = textArea.selectionStart;

        // if (cursorPos === undefined) {
        // textArea.innerHTML += symbol;
        //     return;
        // }

        // console.log("front: " + textArea.innerHTML.substring(0, cursorPos));
        // console.log("back: " + textArea.innerHTML.substring(cursorPos, textArea.innerHTML.length));

        // console.log("cursorPos: " + cursorPos);

        // textArea.innerHTML = textArea.innerHTML.substring(0, cursorPos) + symbol + textArea.innerHTML.substring(cursorPos, textArea.innerHTML.length);
    };

    const symbolDiv = document.createElement("div");
    // symbolDiv.style.display = "flex";
    // symbolDiv.style.flexDirection = "row";
    // symbolDiv.style.flexWrap = "wrap";
    symbolDiv.style.justifyContent = "center";
    symbolDiv.style.alignItems = "center";
    symbolDiv.style.alignContent = "center";

    const mathTitle = document.createElement("h5");
    mathTitle.innerHTML = "Math Symbols (click to copy)";
    mathTitle.className = "muted";

    const scienceTitle = document.createElement("h5");
    scienceTitle.innerHTML = "Science Symbols (click to copy)";
    scienceTitle.className = "muted";

    const mathSymbolDiv = document.createElement("div");
    mathSymbolDiv.style.display = "flex";
    mathSymbolDiv.style.flexDirection = "row";
    mathSymbolDiv.style.flexWrap = "wrap";
    mathSymbolDiv.style.justifyContent = "center";
    mathSymbolDiv.style.alignItems = "center";
    mathSymbolDiv.style.alignContent = "center";

    for (var key of Object.keys(mathSymbols)) {
        const symbol = document.createElement("button");
        symbol.style.margin = "5px";
        symbol.innerHTML = mathSymbols[key];
        symbol.onclick = () => {
            addSymbol(symbol.innerHTML);
        };

        mathSymbolDiv.appendChild(symbol);
    }

    const scienceSymbolDiv = document.createElement("div");
    scienceSymbolDiv.style.display = "flex";
    scienceSymbolDiv.style.flexDirection = "row";
    scienceSymbolDiv.style.flexWrap = "wrap";
    scienceSymbolDiv.style.justifyContent = "center";
    scienceSymbolDiv.style.alignItems = "center";
    scienceSymbolDiv.style.alignContent = "center";

    for (var key of Object.keys(scienceSymbols)) {
        const symbol = document.createElement("button");
        symbol.style.margin = "5px";
        symbol.innerHTML = scienceSymbols[key];
        symbol.onclick = () => {
            addSymbol(symbol.innerHTML);
        };

        scienceSymbolDiv.appendChild(symbol);
    }

    symbolDiv.appendChild(mathTitle);
    symbolDiv.appendChild(mathSymbolDiv);

    symbolDiv.appendChild(scienceTitle);
    symbolDiv.appendChild(scienceSymbolDiv);

    injectPoint.appendChild(symbolDiv);
};

const injectFinalGrade = (
    resultsDiv,
    gotPoints,
    gotWeight,
    gotWeightID,
    assignmentDetail,
    allGrades,
    classIndex,
    realClassAvg
) => {
    while (resultsDiv.firstChild) {
        resultsDiv.removeChild(resultsDiv.firstChild);
    }

    const resultThisAss = document.createElement("p");
    resultThisAss.innerHTML = `${
        Math.round((gotPoints / assignmentDetail["MaxPoints"]) * 100 * 100) /
        100
    }%`;
    resultThisAss.style.fontSize = "30px";
    resultThisAss.style.fontWeight = "regular";

    const resultThisAssSubtext = document.createElement("p");
    resultThisAssSubtext.innerHTML = `On ${assignmentDetail["ShortDescription"]}`;
    resultThisAssSubtext.style.color = "#707070";

    let copyOfAllGrades = allGrades.slice();

    copyOfAllGrades.push({
        AssignmentTypeId: gotWeightID,

        AssignmentPercentage:
            Math.round(
                (gotPoints / assignmentDetail["MaxPoints"]) * 100 * 100
            ) / 100,
        Weight: gotWeight === -1 ? 0 : gotWeight,
        MaxPoints: assignmentDetail["MaxPoints"],
        NonWeightedPoints: gotPoints,
    });

    console.log(copyOfAllGrades);

    let newDS = {
        // [gotWeightID]: {
        //     Points: Math.round(gotPoints / assignmentDetail["MaxPoints"] * 100 * 100) / 100,
        //     Weight: (gotWeight === -1 ? 0 : gotWeight),
        //     MaxPoints: assignmentDetail["MaxPoints"],
        //     NonWeightedPoints: gotPoints,
        // }
    };

    for (const grade of copyOfAllGrades) {
        const assignmentTypeID = grade["AssignmentTypeId"];

        const toPush = {
            Points: grade["AssignmentPercentage"],
            Weight: grade["Weight"] / 100,
            MaxPoints: grade["MaxPoints"],
            NonWeightedPoints:
                (grade["AssignmentPercentage"] / 100) * grade["MaxPoints"],
        };

        if (Object.keys(newDS).includes(String(assignmentTypeID))) {
            newDS[assignmentTypeID].push(toPush);
        } else {
            newDS[assignmentTypeID] = [toPush];
        }
    }

    console.log(newDS);

    //calculate weighted average
    let weightedAvg = 0;
    let totalWeight = 0;
    for (const AssignmentTypeId of Object.keys(newDS)) {
        let weight = newDS[AssignmentTypeId][0]["Weight"];
        totalWeight += weight;
    }

    let now = "";

    if (totalWeight === 0) {
        const x = () => {
            const deleteNoWeight =
                document.getElementsByClassName("ArgoPlus-Weight");

            if (deleteNoWeight.length === 0) {
                console.log("clear done");
                return;
            }

            for (const element of deleteNoWeight) {
                element.remove();
            }

            setTimeout(() => x(), 100);
        };
        x();

        let totalPoints = 0;
        let totalMaxPoints = 0;

        for (const AssignmentTypeId of Object.keys(newDS)) {
            for (const assignment of newDS[AssignmentTypeId]) {
                if (assignment["Points"] === null) {
                    continue;
                }
                totalPoints += assignment["NonWeightedPoints"];
                totalMaxPoints += assignment["MaxPoints"];
            }
        }

        // console.log(`${totalPoints} / ${totalMaxPoints}`);

        const avg = totalPoints / totalMaxPoints;

        now = `${Math.round(avg * 100 * 100) / 100}`;
    } else {

        if (gotWeightID !== -1)
        {
            document.getElementsByClassName("ArgoPlus-Weight-Input")[0].disabled = true;
        }
        else {
            document.getElementsByClassName("ArgoPlus-Weight-Input")[0].disabled = false;
        }

        for (const AssignmentTypeId of Object.keys(newDS)) {
            let grades = 0;
            let weight = newDS[AssignmentTypeId][0]["Weight"];

            var amt = 0;
            for (; amt < newDS[AssignmentTypeId].length; amt++) {
                grades += newDS[AssignmentTypeId][amt]["Points"];
            }

            const avg = grades / amt;
            weightedAvg += avg * weight;
        }

        weightedAvg /= totalWeight;

        now = `${Math.round(weightedAvg * 100) / 100}`;
    }

    const before = copyOfAllGrades[0]["SectionGrade"];

    // if (Number(before) != Number(now)) {
    //     injectDisplay(`Your current real class average doesn't match up with our algorithm. Please use the prediction with a grain of salt.`, "#ffaaaf", false, false, "", "#fff", true);
    // }

    const resultOverall = document.createElement("p");
    resultOverall.innerHTML = `${before}% -> ${now}%`;
    resultOverall.style.fontSize = "30px";
    resultOverall.style.fontWeight = "regular";

    const resultOverallSubtext = document.createElement("p");
    resultOverallSubtext.innerHTML = `In ${assignmentDetail["SectionLinks"][classIndex]["Section"]["Name"]} (Before & After) <br/>`;
    resultOverallSubtext.style.color = "#707070";

    const weightedOrNotTag = document.createElement("span");
    weightedOrNotTag.innerHTML =
        totalWeight !== 0
            ? "Weight-based Class (Used Weighted Algorithm)"
            : "Points-based Class (Used Points Algorithm)";
    weightedOrNotTag.className = "label label-success";

    resultsDiv.appendChild(resultThisAssSubtext);
    resultsDiv.appendChild(resultThisAss);
    resultsDiv.appendChild(resultOverallSubtext);
    resultsDiv.appendChild(weightedOrNotTag);
    resultsDiv.appendChild(resultOverall);
};

const injectGradeSimulator = async (assignmentDetail, classIndex) => {
    const injectionLocation = document.getElementsByClassName(
        "bb-tile-content-section"
    );
    let earnedGrade = document.getElementsByClassName(
        "assignment-detail-status-label"
    )[0];

    if (
        injectionLocation.length === 0 ||
        earnedGrade === undefined ||
        injectionLocation[0] === undefined
    ) {
        setTimeout(() => {
            injectGradeSimulator(assignmentDetail, classIndex);
        }, 500);
        return;
    }

    const earnedGradeText = earnedGrade.innerHTML;

    const UID = await fetch(
        "https://rutgersprep.myschoolapp.com/api/webapp/context"
    )
        .then((r) => r.json())
        .then((result) => {
            return result["UserInfo"]["UserId"];
        });

    if (assignmentDetail["MaxPoints"] === 0) {
        return;
    }

    const gradeURL = `https://rutgersprep.myschoolapp.com/api/datadirect/GradeBookPerformanceAssignmentStudentList/?sectionId=${assignmentDetail["SectionLinks"][classIndex]["SectionId"]}&markingPeriodId=${assignmentDetail["SectionLinks"][classIndex]["MarkingPeriodId"]}&studentUserId=${UID}&personaId=2`;
    console.log("grade API endpoint " + gradeURL);
    const allGrades = await fetch(gradeURL)
        .then((r) => r.json())
        .then((result) => {
            return result;
        });

    let weighted = null;
    let realClassAvg = null;

    for (var gradeStruct in allGrades) {
        const curStruct = allGrades[gradeStruct];

        realClassAvg = curStruct["SectionGrade"];

        if (
            curStruct["Weight"] != null &&
            curStruct["AssignmentId"] === assignmentDetail["AssignmentId"]
        ) {
            // console.log("weight " + curStruct["Weight"])
            weighted = curStruct["Weight"] + "% grade weight";
            break;
        }
        // console.log("struct " + gradeStruct);
    }

    if (weighted !== null) {
        injectDisplay(weighted, "#71BC68", false, true, "", "#FFF", true);
    }

    if (earnedGradeText.includes("Graded")) {
        const gradeLink = `https://rutgersprep.myschoolapp.com/api/datadirect/AssignmentStudentDetail?format=json&studentId=${UID}&AssignmentIndexId=${assignmentDetail["SectionLinks"][classIndex]["AssignmentIndexId"]}`;

        const grade = await fetch(gradeLink)
            .then((r) => r.json())
            .then((result) => {
                return result[0]["pointsEarned"];
            });

        if (grade === null) {
            return;
        }

        earnedGrade.innerHTML = `Graded: ${grade} of ${
            assignmentDetail["MaxPoints"]
        } (${
            Math.round((grade / assignmentDetail["MaxPoints"]) * 100 * 100) /
            100
        }%)`;
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
    gradeSimulatorSubText.innerHTML =
        "[NEW!] Enter your grade here to calculate your final score in this assignment & class. <br/> Now works with weighted classes too & discards exempt assignments.";
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

    const gradeSimulatorInputSubtext = document.createElement("p");
    gradeSimulatorInputSubtext.innerHTML =
        "/ " + assignmentDetail["MaxPoints"] + " (Max)";
    gradeSimulatorInputSubtext.width = "50px";
    gradeSimulatorInputSubtext.style.display = "inline-block";
    gradeSimulatorInputSubtext.style.marginInlineStart = "5px";
    gradeSimulatorInputSubtext.style.fontSize = "20px";

    const weightSimulatorSelect = document.createElement("select");
    weightSimulatorSelect.style.width = "250px";
    weightSimulatorSelect.style.alignContent = "end";
    weightSimulatorSelect.style.height = 50;
    weightSimulatorSelect.style.backgroundColor = "#EFEFEF";
    weightSimulatorSelect.style.border = "none";
    weightSimulatorSelect.style.borderRadius = "5px";
    weightSimulatorSelect.style.fontSize = "20px";
    weightSimulatorSelect.style.marginInlineStart = "15px";
    weightSimulatorSelect.style.marginTop = "15px";
    weightSimulatorSelect.style.marginBottom = "15px";
    weightSimulatorSelect.className = "ArgoPlus-Weight";

    let weightedAssignmentCategories = {
        "-1": {
            Weight: -1,
            AssignmentType: "Custom Weight (New Category)",
        },
    };

    for (var gradeStruct in allGrades) {
        const curStruct = allGrades[gradeStruct];

        // console.log(curStruct);
        // console.log(curStruct["AssignmentTypeId"]);

        if (
            Object.keys(weightedAssignmentCategories).includes(
                String(curStruct["AssignmentTypeId"])
            )
        ) {
            continue;
        }
        weightedAssignmentCategories[String(curStruct["AssignmentTypeId"])] = {
            Weight: curStruct["Weight"],
            AssignmentType: curStruct["AssignmentType"],
        };
    }

    console.log(weightedAssignmentCategories);

    for (var category in weightedAssignmentCategories) {
        console.log(weightedAssignmentCategories[category]);

        const option = document.createElement("option");
        option.value =
            category + " " + weightedAssignmentCategories[category]["Weight"];
        option.innerHTML =
            weightedAssignmentCategories[category]["AssignmentType"] +
            (weightedAssignmentCategories[category]["Weight"] !== -1
                ? " (" + weightedAssignmentCategories[category]["Weight"] + "%)"
                : "");
        weightSimulatorSelect.appendChild(option);
    }

    const weightSimulatorInput = document.createElement("input");
    weightSimulatorInput.type = "number";
    weightSimulatorInput.max = 100;
    weightSimulatorInput.min = "0";
    weightSimulatorInput.value = 0;
    weightSimulatorInput.style.width = "50px";
    weightSimulatorInput.style.alignContent = "end";
    weightSimulatorInput.style.height = 50;
    weightSimulatorInput.style.backgroundColor = "#EFEFEF";
    weightSimulatorInput.style.border = "none";
    weightSimulatorInput.style.borderRadius = "5px";
    weightSimulatorInput.style.fontSize = "20px";
    weightSimulatorInput.style.marginInlineStart = "15px";
    weightSimulatorInput.style.marginTop = "15px";
    weightSimulatorInput.style.marginBottom = "15px";
    weightSimulatorInput.className = "ArgoPlus-Weight ArgoPlus-Weight-Input";

    const weightSimulatorInputSubtext = document.createElement("p");
    weightSimulatorInputSubtext.innerHTML = "% Weight";
    weightSimulatorInputSubtext.width = "50px";
    weightSimulatorInputSubtext.style.display = "inline-block";
    weightSimulatorInputSubtext.style.marginInlineStart = "5px";
    weightSimulatorInputSubtext.style.fontSize = "20px";
    weightSimulatorInputSubtext.className = "ArgoPlus-Weight";

    gradeSimulatorInput.onchange = () => {
        injectFinalGrade(
            resultsDiv,
            gradeSimulatorInput.value,
            weightSimulatorInput.value,
            Number(weightSimulatorSelect.value.split(" ")[0]),
            assignmentDetail,
            allGrades,
            classIndex,
            realClassAvg
        );
    };
    weightSimulatorInput.onchange = () => {
        injectFinalGrade(
            resultsDiv,
            gradeSimulatorInput.value,
            weightSimulatorInput.value,
            Number(weightSimulatorSelect.value.split(" ")[0]),
            assignmentDetail,
            allGrades,
            classIndex,
            realClassAvg
        );
    };
    weightSimulatorSelect.onchange = () => {
        weightSimulatorInput.value =
        weightSimulatorSelect.value.split(" ")[1];
        injectFinalGrade(
            resultsDiv,
            gradeSimulatorInput.value,
            weightSimulatorInput.value,
            Number(weightSimulatorSelect.value.split(" ")[0]),
            assignmentDetail,
            allGrades,
            classIndex,
            realClassAvg
        );
    };

    // gradeSimulator.appendChild(divider);
    // gradeSimulator.appendChild(gradeSimulatorText);
    gradeSimulator.appendChild(gradeSimulatorInput);
    gradeSimulator.appendChild(gradeSimulatorInputSubtext);
    gradeSimulator.appendChild(weightSimulatorSelect);
    gradeSimulator.appendChild(weightSimulatorInput);
    gradeSimulator.appendChild(weightSimulatorInputSubtext);

    gradeSimulator.appendChild(gradeSimulatorSubText);
    gradeSimulator.appendChild(resultsDiv);

    injectionLocation[1].appendChild(gradeSimulator);

    injectFinalGrade(
        resultsDiv,
        assignmentDetail["MaxPoints"],
        0,
        -1,
        assignmentDetail,
        allGrades,
        classIndex,
        realClassAvg
    );
};

const injectDisplay = (
    label,
    color,
    isHeader = false,
    showBeta = true,
    URL = "",
    fontColor = "#fff",
    onOther = false
) => {
    const injectionLocation = document.getElementsByClassName(
        "bb-tile-content-section"
    );

    if (
        injectionLocation.length === 0 ||
        injectionLocation[0] === undefined ||
        injectionLocation[1] === undefined
    ) {
        setTimeout(() => {
            injectDisplay(
                label,
                color,
                isHeader,
                showBeta,
                URL,
                fontColor,
                onOther
            );
        }, 500);
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

    if (URL !== "") {
        pointDisplayText.href = URL;
        pointDisplayText.target = "_blank";
        pointDisplayText.style.paddingTop = "7px";
        pointDisplayText.style.paddingBottom = "7px";
        // pointDisplayText.style.textDecoration = "none";
    }

    const betaTag = document.createElement("img");
    betaTag.src =
        "https://media.discordapp.net/attachments/663150753946402820/1025960450963275826/Group_1.png";
    // betaTag.style.width = "53px";
    betaTag.style.height = "100%";
    betaTag.style.left = "0px";
    betaTag.style.top = "0px";
    betaTag.style.position = "absolute";
    betaTag.style.zIndex = "1";

    pointDisplay.appendChild(pointDisplayText);

    if (showBeta) {
        pointDisplay.appendChild(betaTag);
    }

    //inject
    if (!onOther) {
        while (injectionLocation[0].firstChild) {
            const className = injectionLocation[0].firstChild.className;
            const id = injectionLocation[0].firstChild.id;

            if (className === "ArgoPlus-Display") {
                // || id === "assignment-detail-linked-content")
                break;
            }

            injectionLocation[0].removeChild(injectionLocation[0].firstChild);
        }
    }

    injectionLocation[onOther ? 1 : 0].appendChild(pointDisplay);
};

const fetchAssignmentDetailXHR = async (assignmentID) => {
    const assignmentDetail = await fetch(
        `https://rutgersprep.myschoolapp.com/api/assignment2/read/${assignmentID}/?format=json`
    )
        .then((r) => r.json())
        .then((result) => {
            return result;
        });

    return assignmentDetail;
};

const injectButtons = () => {
    const saveButton = document.getElementById("save-button");
    const submitButton = document.getElementById("sub-button");

    if (saveButton === null) {
        setTimeout(() => {
            injectButtons();
        }, 500);
        return;
    }

    // if (submitButton === null) {
    //     setTimeout(() => { injectButtons() }, 500);
    //     return;
    // }

    saveButton.onclick = () => {
        setTimeout(() => {
            injectAssignmentDetail({ url: location.href });
        }, 500);
    };

    // submitButton.onclick = () => {
    //     setTimeout(() => { injectAssignmentDetail({url: location.href}); }, 500);
    // }
};

// code to check url then inject
const injectAssignmentDetail = async (request) => {
    // console.log("ArgoPlus: Assignment Details Page Detected");

    const assignmentId = request.url.match("[0-9]+/[0-9]+")[0].split("/")[0];
    const assignmentIndexId = request.url
        .match("[0-9]+/[0-9]+")[0]
        .split("/")[1];

    // console.log(assignmentId + " and " + assignmentIndexId);

    const assignmentDetail = await fetchAssignmentDetailXHR(assignmentId);

    var classIndex = 0;
    for (; classIndex < assignmentDetail["SectionLinks"].length; classIndex++) {
        if (
            assignmentDetail["SectionLinks"][classIndex]["AssignmentIndexId"] ==
            assignmentIndexId
        ) {
            break;
        }
    }

    injectDisplay(
        assignmentDetail["ShortDescription"],
        "#fff",
        true,
        false,
        "",
        "#272727"
    );
    injectDisplay(
        assignmentDetail["SectionLinks"][classIndex]["Section"]["Name"],
        "#fff",
        false,
        false,
        `https://rutgersprep.myschoolapp.com/app/student#academicclass/${assignmentDetail["SectionLinks"][classIndex]["SectionId"]}/0/bulletinboard`,
        "#707070"
    );
    injectDisplay(
        assignmentDetail["LongDescription"],
        "#fff",
        false,
        false,
        "",
        "#272727"
    );

    if (assignmentDetail["DownloadItems"].length > 0) {
        for (var downloadKey of assignmentDetail["DownloadItems"]) {
            injectDisplay(
                "📥 " +
                    downloadKey["ShortDescription"] +
                    " (" +
                    downloadKey["FriendlyFileName"] +
                    ")",
                "#fff",
                false,
                false,
                downloadKey["DownloadUrl"],
                "#FFF",
                false
            );
        }
    }

    if (assignmentDetail["LinkItems"].length > 0) {
        for (var linkKey of assignmentDetail["LinkItems"]) {
            injectDisplay(
                "🔗 " + linkKey["ShortDescription"],
                "#fff",
                false,
                false,
                linkKey["Url"],
                "#FFF",
                false
            );
        }
    }

    //tags

    injectDisplay(
        "Assignment Type: " + assignmentDetail["AssignmentType"],
        "#2DC8D0"
    );

    injectDisplay(
        assignmentDetail["DropboxResub"]
            ? "Resubmittable Until Deadline"
            : "No Resubmittions Allowed",
        "#2DC8D0"
    );

    injectDisplay(
        "Posted " +
            assignmentDetail["SectionLinks"][classIndex]["AssignmentDate"],
        "#7368bc"
    );
    injectDisplay(
        "Due " +
            assignmentDetail["SectionLinks"][classIndex]["DueDate"] +
            ",  " +
            assignmentDetail["SectionLinks"][classIndex]["DueTime"],
        "#7368bc"
    );

    if (assignmentDetail["MaxPoints"] === 0) {
        injectDisplay(
            "Ungraded (0 Points)",
            "#71BC68",
            false,
            true,
            "",
            "#fff",
            true
        );
    }

    if (assignmentDetail["Factor"] > 1) {
        injectDisplay(
            "Factor: " + assignmentDetail["Factor"],
            "#71BC68",
            false,
            true,
            "",
            "#fff",
            true
        );
    }

    injectGradeSimulator(assignmentDetail, classIndex);
    injectSubmissionHelper();
    injectButtons();
};
