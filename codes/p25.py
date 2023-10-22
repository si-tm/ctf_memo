

def reverse_char(str):
    for i, c in enumerate(str):
        print(str[len(str) - i - 1], end="")
    print("")
    
def reverse_word(str):
    lst = str.split(" ")
    for i, c in enumerate(lst):
        print(lst[len(str) - i - 1], end="")
    print("")
    
def str2set(str):
    lst = str.split(" ")
    s = set()
    for e in lst:
        s.add(e)
    print(s)

def print_and(str):
    lst = str.split(" ")
    for e in lst:
        print(e, end=" ")
        if e == "and":
            print("")

        
def main():
    with open("p25_input.txt", "r") as f:
        l = f.read()
    # print(l)
    # reverse_char(l)
    # str2set(l)
    print_and(l)

    

if __name__ == '__main__':
    main()