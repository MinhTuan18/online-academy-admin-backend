const request = require('request')
const responseRef = require('./response')
const {deleteDiacritics} = require('../../utils/HandleDiacritics')

function handleReceive(webhook_event) {
    let sender_psid = webhook_event.sender.id;
    console.log('Sender PSID: ' + sender_psid);

    if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
    } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
    }
}

// Handles messages events
async function handleMessage(sender_psid, received_message) {
    let response;

    const msgTxt = received_message.text
    // Check if the message contains text
    if (msgTxt) {

        // Create the payload for a basic text message
        if (msgTxt.toUpperCase().includes('MENU')) {
            response = responseRef.mainMenu()


            // } else if (msgTxt.toUpperCase().includes('TÌM KHÓA HỌC')) {
            //     let searchString
            //     if (msgTxt[msgTxt.indexOf('TÌM KHÓA HỌC') + 12] === ' ') {
            //         searchString = msgTxt.substring(msgTxt.toUpperCase().indexOf('TÌM KHÓA HỌC') + 13)
            //     } else {
            //         searchString = msgTxt.substring(msgTxt.toUpperCase().indexOf('TÌM KHÓA HỌC') + 12)
            //     }
            //     response = await responseRef.search(searchString)

        } else if (deleteDiacritics(msgTxt).toUpperCase().includes('TIM KHOA HOC')) {
            let searchString
            if (msgTxt[deleteDiacritics(msgTxt).toUpperCase().indexOf('TIM KHOA HOC') + 12] === ' ') {
                searchString = msgTxt.substring(deleteDiacritics(msgTxt).toUpperCase().indexOf('TIM KHOA HOC') + 13)
            } else {
                searchString = msgTxt.substring(deleteDiacritics(msgTxt).toUpperCase().indexOf('TIM KHOA HOC') + 12)
            }
            
            response = await responseRef.search(searchString)
        } else if (deleteDiacritics(msgTxt).toUpperCase().includes('DUYET')) {
            response = await responseRef.categories()
        } else {
            response =
            {
                "text": `Thật xin lỗi, chúng tôi không hiểu ý tin nhắn "${msgTxt}" của bạn!\nGõ "MENU" để xem các tính năng hiện có.`
            }
        }
    }

    // Sends the response message
    callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
async function handlePostback(sender_psid, received_postback) {
    let response;

    // Get the payload for the postback
    let payload = received_postback.payload;

    // Set the response based on the postback payload
    response = await handlePayload(payload);

    // Send the message to acknowledge the postback
    callSendAPI(sender_psid, response);
}

async function handlePayload(payload) {
    let response

    if (payload === 'GET_STARTED') {
        response = responseRef.mainMenu()
    } else if (payload === 'SEARCH') {
        response = await responseRef.searchGuide()
    } else if (payload === 'CATEGORIES') {
        response = await responseRef.categories()
    } else if (payload.includes('CATEGORIES_LIST_')) { // get courses from cat
        let categoryId = payload.substring(16)
        response = await responseRef.coursesByCategory(categoryId)
    } else if (payload.includes('CATEGORIES_LISTSUB_')) { // get subcats from cat
        let categoryId = payload.substring(19)
        response = await responseRef.subCategories(categoryId) 
    } else if (payload.includes('SUBCATEGORY_LIST_')) { // get courses from subcat
        let subCategoryId = payload.substring(17)
        response = await responseRef.coursesBySubCategory(subCategoryId) 
    } else if (payload.includes('COURSES_LIST_')) {
        let courseId = payload.substring(13)
        response = await responseRef.coursesDetail(courseId)
    }
    // console.log(response)
    return response
}

// Sends response messages via the Send API
async function callSendAPI(sender_psid, response) {
    if (!Array.isArray(response)) {
        sendAPI(sender_psid, response)
    } else {
        for (let r of response) {
            await sendAPI(sender_psid, r)
        }
    }
}

async function sendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }
    // Send the HTTP request to the Messenger Platform
    await request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}

module.exports = {
    handleReceive
}