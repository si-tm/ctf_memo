import uu
import base64

def fromBase64(text):
    # base64Bytes = base64.b64encode(text.encode())
    base64Bytes = base64.b64decode(text)
    return base64Bytes

def uu():
    # infile = "E:\tp_logo.JPG"
    infile = "input.txt"

    uu.decode(infile, out_file=None, mode=None, quiet=False)

def solution():
    f = open("p3_input.txt" ,'r', encoding='UTF-8')
    data = f.read()
    print(data)
    tmp = data
    for i in range(100):
        tmp = fromBase64(tmp)
    print(tmp)
    f.close()
    

if __name__ == '__main__':
    solution()
    pass