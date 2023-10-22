import hashlib
import crypt

def solution():

    f = open("p14_input.txt", "r")
    passwords = []
    salts = []
    for l in f:
        password = l.split(":")[1]
        salt = "\$6\$" + l.split(":")[1].split("$")[2]
        salt = "$6$" + l.split(":")[1].split("$")[2]
        # salt = l.split(":")[1].split("$")[2]
        print(salt)
        # salt = crypt.mksalt(crypt.METHOD_SHA512)
        print(crypt.crypt(password, salt))
    f.close()

    dict = {}

    d = open("dicti0nary_8Th64ikELWEsZFrf.txt", "r")
    for l in d:
        password = l[:-1]

    for salt in salts:
        for l in d:
            password = l[:-1]
            print(crypt.crypt(password, salt))

    d.close()

if __name__ == '__main__':
    solution()
    pass
