import requests

print(requests.get(url="https://www.sagedining.com/microsites/getMenuItems?menuId=113592&date=10/05/2022&meal=Lunch").json())