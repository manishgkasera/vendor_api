# pip install requests-sigv4
# https://github.com/cleardataeng/requests-sigv4

import os
from requests_sigv4 import Sigv4Request

access_key = os.environ.get('AWS_ACCESS_KEY_ID')
secret_key = os.environ.get('AWS_SECRET_ACCESS_KEY')
access_token = 'Atza|IwEBIN89ZTct4Z5T86vQkuCb8jnsG2N9dmFQxhjWSzWtPPYwFoFTLh5xOmvJpqQLa3qMTqX2_CwpyXIJWbzDxxuovULWR9Ru8zVDLLF7GL7A5NZrrjY_U3oZecl8qdPTXLvlL5YNTE6aKrCHvWP6HaWzbLnhvplhVxrAIS8CyINhmqpDsOFvXK9UA6WAD1E8eJ3apI3jYXSNE6hoVYtCUOnTz3sRYWHNL2oGPTSi25oRDB_yjp9E7IrH9PHjoM_IcfD_xJLZcMnDZi6gLD1G2-lUFE5Kb5mCwpszq5vctvp4HVEuliy9BJVLrjJIh940IqnqyJ9Hu4wWzzXmFkxmKhZXsGnwH9RxI7Pyt1rRW87I_Q5tm8rWrpceY_6TLPTnIT7BysE'

endpoint = 'https://sandbox.sellingpartnerapi-eu.amazon.com'
region = 'eu-west-1'

request = Sigv4Request(
    region=region,
    access_key=access_key,
    secret_key=secret_key,
    service='execute-api'
)

def get_orders(params):
    response = request.get(
        url=endpoint + '/vendor/orders/v1/orders',
        params=params,
        headers={'x-amz-access-token': access_token}
    )
    return response

def ack_order(params):
    response = request.post(
        url= endpoint + "/vendor/orders/v1/acknowledgements",
        json=params,
        headers={'x-amz-access-token': access_token}
    )
    return response

def print_response(http_response):
    print http_response.status_code
    print http_response.text
    print '\n'


response = get_orders({
    'createdBefore' : '2019-08-21T00:00:00-08:00',
    'createdAfter'  : '2019-08-20T14:00:00-08:00',
    'includeDetails': 'true',
    'sortOrder'     : 'DESC'
})

print '====== GETOrders ========'
print_response(response)


response = ack_order({
    "acknowledgements": [
        {
            "purchaseOrderNumber": "TestOrder202"
        }
    ]
})
print '====== ACKOrders ========'
print_response(response)
