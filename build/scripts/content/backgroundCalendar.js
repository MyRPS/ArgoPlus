/* global chrome */

const refreshCalendar = async () => {
    const updateCalURL = `https://rutgersprep.myschoolapp.com/api/iCalRSS/iCalMyCalendarsGet/`;

    let iCalLinks = {};

    try {
        iCalLinks = await fetch(updateCalURL).then(res => {
            if (!res.ok)
            {
                throw new Error("Could not fetch iCal links");
            }
            return res.json();
        });
    }
    catch (e) {
        return;
    }

    // console.log("iCalLinks: " + iCalLinks);
    
    chrome.storage.sync.set({
        "calendarLinks": iCalLinks
    });
}