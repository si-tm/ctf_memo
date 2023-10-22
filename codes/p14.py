import hashlib
import crypt
import os
import string
import passlib.hash
import secrets

try:  # 3.6 or above
    from secrets import choice as randchoice
except ImportError:
    from random import SystemRandom
    randchoice = SystemRandom().choice

def generateHash(password, salt_len=10, iterations=65000):
  result = passlib.hash.sha512_crypt(salt=secrets.token_hex(salt_len), rounds=iterations).hash(password)
  return '{SHA512-CRYPT}' + result

def sha512_crypt(password, salt=None, rounds=None):
    if salt is None:
        salt = ''.join([randchoice(string.ascii_letters + string.digits)
                        for _ in range(8)])

    prefix = '$6$'
    if rounds is not None:
        rounds = max(1000, min(999999999, rounds or 5000))
        prefix += 'rounds={0}$'.format(rounds)
    return crypt.crypt(password, prefix + salt)

def solution():
    f = open("p14_input.txt", "r")
    passwords = []
    for l in f:
        # print(l.split(":")[1][3:].split("/"))
        passwords.append(l.split(":")[1])
        print(l.split(":")[1].split("$")[2])
        # password = l.split(":")[1][3:]
        # hash = hashlib.sha512( str( password ).encode("utf-8") ).hexdigest()
        # print(hash)
    f.close()

    dict = {}

    d = open("dicti0nary_8Th64ikELWEsZFrf.txt", "r")
    for l in d:
        password = l[:-1]
        dict[sha512_crypt(l[:-1], salt=None, rounds=None)] = l[:-1]
        dict[sha512_crypt(l[:-1], 'salt1234', rounds=1000)] = l[:-1]
        dict[sha512_crypt(l[:-1], 'salt1234')] = l[:-1]
        dict[crypt.crypt(l[:-1], crypt.mksalt(crypt.METHOD_SHA512))] = l[:-1]
        # dict[generateHash(l[:-1], salt_len=10, iterations=65000)] = l[:-1]
        dict[hashlib.sha512( str( l[:-1] ).encode("utf-8") ).hexdigest()] = l[:-1]
        # print(hashlib.sha512( str( l[:-1] ).decode("utf-8") ).hexdigest())

    # print(dict.keys())
    d.close()

    # for key in dict:
    #     for password in passwords:
    #         if key[2:] in password:
    #             print(password)

if __name__ == '__main__':
    solution()
    pass
