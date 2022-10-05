

const getMailIDs = async () => {
    const mailStruct = await fetch(`https://rutgersprep.myschoolapp.com/api/message/inbox/?format=json&pageNumber=1`).then(response => response.json()).then(data => {
        return data;
    });

    return mailStruct.map(mail => mail["ConversationId"]).join(",");
}

const updateInbox = async (markAsRead) => {
    const ids = await getMailIDs()

    const verificationToken = document.getElementsByName("__RequestVerificationToken")[0].value;

    fetch("https://rutgersprep.myschoolapp.com/api/message/ConversationBulkUpdate/", {	
        "headers": {	
            "accept": "application/json, text/javascript, */*; q=0.01",	
            "accept-language": "en-US,en;q=0.9",	
            "content-type": "application/json",	
            "requestverificationtoken": verificationToken,	
            "sec-ch-ua": "\"Chromium\";v=\"106\", \"Google Chrome\";v=\"106\", \"Not;A=Brand\";v=\"99\"",	
            "sec-ch-ua-mobile": "?0",	
            "sec-ch-ua-platform": "\"Windows\"",	
            "sec-fetch-dest": "empty",	
            "sec-fetch-mode": "cors",	
            "sec-fetch-site": "same-origin",	
            "wh-version": "1.52.22276.3",	
            "x-requested-with": "XMLHttpRequest",	
            "cookie": "__RequestVerificationToken_OnSuite=mwS0JYl0-pDmpVD8qivcdvzgLrElrCJz5tE2tvd9733kQ1FyvgJZutMwSvaHZUK1hx120QFTs9RKD5G8jAcQRl2xxDEor5b7zKmnwJMkK701; __RequestVerificationToken_OnSuite_Legacy=mwS0JYl0-pDmpVD8qivcdvzgLrElrCJz5tE2tvd9733kQ1FyvgJZutMwSvaHZUK1hx120QFTs9RKD5G8jAcQRl2xxDEor5b7zKmnwJMkK701; __RequestVerificationToken_OnSuite_TokenId=bc0be734-a4bb-4e9b-a659-a56e39c3c683; __RequestVerificationToken_OnSuite_Legacy_TokenId=bc0be734-a4bb-4e9b-a659-a56e39c3c683; sd=114186a6-8462-483b-8a00-423b5da63eb1; _ga=GA1.2.1508142110.1627179587; G_ENABLED_IDPS=google; ASP.NET_SessionId=hk0htyksw1ize4ouickhubfh; _gid=GA1.2.1620250435.1664132107; persona=student; ck=a=+RMOokPN1rM=; y=dMovjfHaGsQL29gVvS2Edg==; x=l3cy2tiH0rwhXnCAw+v0ww==; bridge=action=create&src=api&xdb=false; t=9e9f94b6-d94a-b4ba-3c2f-abb22e0de6f3; userDataSessionID=983059d4-7e12-4c45-8b20-a33bf9a10230%7C66fec55a-7534-401e-a671-6192db38989f; AuthSvcToken=XzAcEXt%2FaLZKnAzm0eLAGtArhU9yapXyHvHshZrTn27TyKAbiKwJAGGr4eBj9laP1%2F22PUi78hdhCyR%2BMqzU6g3D3kg37rRCOUIe6VEqPok44CQ0zR2QEHQheaevOUOZyaR8cNYxd7X2ZaUYC%2FkO75nz%2B5t%2Fjh62GjMzMbwzVHX0kRMaAeNSSr45MaGD8KaQvjP0syv6ImMjSisfpZkHvYRDO7s0nirtDcN9w%2Bel%2BXGe9Awytzcsvkk57vWnlSab8gUeNNZAPlpIi0w2f%2BzHdkI9AbxTNssOwklan0ZehkXMw3l5MxeVj9H9JtxfdLJyLNtPNyecOpS3peIgy51Gfg%3D%3D.H4sIAAAAAAAAA51STW%2BbMAAl3aZt2aRthx0n5bDjCB8Bk0Sa2pSQJuQ7kCbtpTJgEjeAkQ0E9usHY9Mu0w6xbB%2F8nt%2BTn98Vx3GfBnEcYBcmmEQ6ISeMGlyDa5bI8JgkcV8QmHtEIWTtPAwYgXGb0INwZoIsiqpQTuyhKMFJIbgBxCETIhii%2BszHiH7twK7jIQfxTleRecWXfd7xHcCrnouAI2vQUZXKscHdXuZXcnEAPY8ixj4%2F56ms3NA0OSDKYop%2B3a7lP06YUVF1EvmYhsh7adMU1dj1ZdYHnKGoeu8rEzIS1VrfL9NiKa2UrvZpLfN2Rg44GsIENSUAlJ7UVSRQQ03d2oye7OXUWNjPWTZES7A4jU0Czo42kmb6Wb5dbIuVa3U601NqOavHPQQnKlN%2F6Cp4tdczvjtLTcka5Lk%2FX5%2FXAWZwuxktckO6v7O03y5WGWhZiqeJZ6MtEPfzh4Ox2yXH4oHfHAeFNtG7p%2FlaMpdgHCgrm9cmYjZZxnq2U8edhJdW%2B8wYMKJ54SP4YdA4I2aW9RZTc%2B7aWnFfu7yvOzck5ddEH8KiTI2QAMZx2yVhTXm3QRE6w%2BBvFh1V%2FZNFNar9Rbn%2Bq%2FW6jRlLkfdlh7xvLVFtLd2kJYuy3BLlvqj2JdC6m9tv2iiPcVmlmib1%2Fk37Cbu%2ByHQ5AwAA",	
            "Referer": "https://rutgersprep.myschoolapp.com/app/student",	
            "Referrer-Policy": "strict-origin-when-cross-origin"	
        },	
        "body": `{"ids":"${ids}","markAsRead":${markAsRead}}`,	
        "method": "POST"	
    });

    location.reload();
}

const injectMail = async (request) => {

    const ids = await getMailIDs()

    if (ids.length == 0) {
        return;
    }

    console.log("Mail Ids: " + ids);

    const actionBar = document.getElementById("button-bar");

    if (actionBar == null)
    {
        setTimeout(() => {
            injectMail(request);
        }, 500);
        return;
    }

    const allAsRead = document.createElement("button");
    allAsRead.innerHTML = "Mark All As Read";
    allAsRead.onclick = async () => {
        updateInbox(true);
    }
    allAsRead.style.marginLeft = "5px";
    allAsRead.style.marginRight = "5px";
    // allAsRead.style.backgroundColor = "#fff";
    // allAsRead.style.border = "1px solid #ccc";
    // allAsRead.style.borderRadius = "4px";
    // allAsRead.style.padding = "5px";
    // allAsRead.style.fontSize = "13px";
    allAsRead.className = "btn bb-btn-secondary btn-sm";

    const allAsArchive = document.createElement("button");
    allAsArchive.innerHTML = "Archive All";
    allAsArchive.onclick = async () => {
        updateInbox(false);
    }
    allAsArchive.style.marginLeft = "10px";
    allAsArchive.style.marginRight = "10px";
    // allAsArchive.style.backgroundColor = "#fff";
    // allAsArchive.style.border = "1px solid #ccc";
    // allAsArchive.style.borderRadius = "4px";
    // allAsArchive.style.padding = "5px";
    // allAsArchive.style.fontSize = "13px";
    allAsArchive.className = "btn bb-btn-secondary btn-sm";

    actionBar.appendChild(allAsRead);
    actionBar.appendChild(allAsArchive);
}