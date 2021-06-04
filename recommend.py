import pandas as pd
import numpy as np
import sys
import json
import requests

url = 'http://localhost:8090/api/get-favor-product'
r = requests.post(url)
data = r.json()

# #print(data['products'])
# datax = data['products']
# orders = pd.DataFrame(data['products'])
# #print(orders)

resp = {
    "data": data
}
print(json.dumps(resp))
# print("Output from Python")
# print("First name: " + sys.argv[1])
# print("Last name: " + sys.argv[2])
