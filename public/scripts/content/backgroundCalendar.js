/* global chrome */

const refreshCalendar = async () => {
    const updateCalURL = `https://rutgersprep.myschoolapp.com/api/iCalRSS/iCalMyCalendarsGet/`;
    const iCalLinks = await fetch(updateCalURL).then(res => res.json());

    if (iCalLinks.length === 0)
    {
        return;
    }

    console.log("iCalLinks: " + iCalLinks);
    
    chrome.storage.sync.set({
        "calendarLinks": iCalLinks
    });
}