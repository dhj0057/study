#modoule1.py

def func1():
    print("module1.func1()함수 출력")

def func2():
    print("module2.func1()함수 출력")

def func3():
    print("module3.func1()함수 출력")


print("모듈1 전역부분  출력")
print(__name__)

if __name__=='__main__':
    print("모듈1 메인함수내 출력")
    func1()
    #print(__name__)
    
    
            
