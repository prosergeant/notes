from urllib.request import urlopen

url = "http://91.201.215.27:1001/android_url.txt"
file = urlopen(url)

url_link = ''

for i in file:
    url_link = i.decode()

print(url_link)