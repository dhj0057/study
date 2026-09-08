


a = int(input("오름차순 정렬할 첫 번째 정수를 입력해주세요"))
b = int(input("오름차순 정렬할 두 번째 정수를 입력해주세요"))
c = int(input("오름차순 정렬할 세 번째 정수를 입력해주세요"))

if a>b:
    a,b=b,a
if a>c:
    a,c=c,a
if b>c:
    b,c=c,b

print("첫번째 정수 %d,두번째 정수 %d, 세번째 정수%d",(a,b,c))

    
