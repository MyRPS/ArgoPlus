const mail = async (request) => {
    await fetch(`https://rutgersprep.myschoolapp.com/api/message/inbox/?format=json&pageNumber=1&toDate={}`)
}