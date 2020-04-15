// https://www.npmjs.com/package/aws-api-gateway-client
const apigClientFactory = require('aws-api-gateway-client').default;

access_key = process.env.AWS_ACCESS_KEY_ID
secret_key = process.env.AWS_SECRET_ACCESS_KEY

endpoint = 'https://sandbox.sellingpartnerapi-eu.amazon.com'
region = 'eu-west-1'

function getAccessToken() {
    return 'Atza|IwEBIPRw0V5Q_s1W7TPwGYdgXAmanCkjrOMu4O416GfuZ1DbwRO9CHaR166UsBFL5r8qtwAQr-0IKE48Xtq2OoDGzWo6QIsP7urW08sjm-17ZJ-U4KEMbIE0yYEXP6coWpE5kf2Kxs56V4ETJJGWMnd8yeGNGQKSx0H90NfO74ywtwkgwZtRI5cQoCvVAmh2NmYA2og2i-l45r3kKnzZRl8s3KAIvdEnku2LfytT81GMMwxrNpQ7PR-hnlMTaOvVyDiCI16yMIjnQB4asdjuO602xNzGzyP6q9eX89eyZz_LhHJaiWv9UjhkV2OWf3fHTP4U886HGWcSBHBRGDuEyZkRj3zaXCZneoWQmNFsrhNpoCPtPYN5ij065AlXX0BhYaJDB1I'
}

const apigClient = apigClientFactory.newClient({
    invokeUrl: endpoint,
    accessKey: access_key, // REQUIRED
    secretKey: secret_key, // REQUIRED
    region: region
});

function httpGET(pathParams, pathTemplate, additionalParams) {
    if(additionalParams == undefined)
        additionalParams = { headers: {'x-amz-access-token': getAccessToken() }}
    else
        additionalParams['headers'] = {'x-amz-access-token': getAccessToken() }

    return apigClient.invokeApi(pathParams, pathTemplate, "GET", additionalParams, {})
}

function httpPOST(pathParams, pathTemplate, body) {
    let additionalParams = { headers: {'x-amz-access-token': getAccessToken() }}
    return apigClient.invokeApi(pathParams, pathTemplate, "POST", additionalParams, body)
}

async function getOrder(orderId) {
    return await httpGET({orderId: orderId}, '/vendor/orders/v1/orders/{orderId}')
}

async function ackOrder(params) {
    return await httpPOST({}, '/vendor/orders/v1/acknowledgements', params)
}

getOrder('4Z32PABC')
    .then(function (response) {
        console.log("Get Response: ", response.data)
    })
    .catch(function (error) {
        console.log("Error: ", error.response)
    })

ackOrder({
    "acknowledgements": [
        {
            "purchaseOrderNumber": "TestOrder202"
        }
    ]})
    .then(function (response) {
        console.log("ACK Response: ", response.data)
    })
    .catch(function (error) {
        console.log("Error: ", error.response)
    })