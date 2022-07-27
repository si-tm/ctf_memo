import requests
from hashlib import md5

# https://tomomon.jp/programming/ksnctf9/　参考

url = "http://ctfq.u1tramarine.blue/q9/flag.html"

username = "q9"
realm = "secret"
nonce = ""
uri = "/q9/flag.html"
algorithm = "MD5"
response =""
qop = "auth"
nc = "00000001"
cnonce = "656335d78cef6e86"
md5_a1 = "c627e19450db746b739f41b64097d449"
a2 = "GET:" + uri

def main():
    digest_cracker()

def digest_cracker():
    # urlにアクセスする
    res = requests.get(url)
    
    # headerからnonceを取得
    nonce = res.headers["WWW-Authenticate"].split(", ")[1]
    nonce = nonce.replace('nonce=','').replace('"', '')
    
    # responseを作成
    md5_a2 = md5(a2.encode('utf-8')).hexdigest()
    plain_response = f"{md5_a1}:{nonce}:{nc}:{cnonce}:{qop}:{md5_a2}"
    response = md5(plain_response.encode('utf-8')).hexdigest()
    print(response)

    auth = 'Digest username="' + username + '", realm="' + realm + '", nonce="' + nonce + '",uri="' + uri + '", algorithm=' + algorithm + ', response="' + response + '", qop=' + qop + ', nc=' + nc + ', cnonce="' + cnonce + '"'
    print(auth)
    headers = {'Authorization' : auth}
    req = requests.get(url, headers = headers)
    print(req.text)


if __name__ == '__main__':
    main()