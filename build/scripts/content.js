/* global chrome */

const url = location.hostname.replace("https://", "").replace("http://", "").replace("www.", "");

chrome.storage.sync.get(["blockedSites"], (result) => {

    if (!result || !result.blockedSites)
    {
        return;
    }
    
    for (var site of result.blockedSites)
    {
        const urlAgainst = site.domain.replace("https://", "").replace("http://", "").replace("www.", "");
        // console.log("checking " + urlAgainst + " against " + url);
        if (url.replace("/", "") === urlAgainst.replace("/", "")) {
            const element = document.createElement("div");
            element.style.position = "fixed";
            element.style.top = "0";
            element.style.left = "0";
            element.style.width = "100%";
            element.style.height = "100%";
            element.style.backgroundColor = "rgb(0, 0, 0)";
            // element.style.backdropFilter = "blur(100px)";
            element.style.zIndex = "100000000";
            element.style.paddingTop = "25px";
        
            const h1 = document.createElement("p");
            const textNode = document.createTextNode('"' + site.message + '"');
            h1.appendChild(textNode);
            
            h1.style.fontSize = "50px";
            h1.style.fontFamily = "Arial";
            h1.style.textAlign = "center";
            h1.style.color = "#fff";
        
            const btns = document.createElement("button");
            const continueTextNode = document.createTextNode("Continue to " + url + " anyways...");
            btns.appendChild(continueTextNode);
            
            btns.style.textAlign = "center";
            // btns.style.width = "100%";
            btns.style.backgroundColor = "transparent";
            btns.style.border = "none";
            btns.style.color = "#777";
            btns.style.top = "10px";
            btns.style.left = "20px";
            btns.style.position = "absolute";
        
            btns.onclick = () => {
                element.remove();
            };
        
            document.body.appendChild(element);
            element.appendChild(h1);    
            element.appendChild(btns);

            document.querySelectorAll('audio, video').forEach(item => {
                item.muted = true;
                item.pause();
            });
            break;
        }
    }
});