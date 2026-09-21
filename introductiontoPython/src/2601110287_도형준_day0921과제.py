verse = "If you can keep your head when all about you\n Are losing theirs\nand blaming it on you,\nIf you can trust yourself when all men doubt you,\n But make allowance for their doubting too;\nIf you can wait and not be tired by waiting,\n Or being lied about, don’t deal in lies,\nOr being hated, don’t give way to hating,\n And yet don’t look too good, nor talk too wise:"

word = input("검색하고자하는 단어를 입력하세요:")

count = verse.count(word)
changed_verse = verse.replace(word, word.upper())

print(f'검색 단어는 "{word}" 입니다')
print(f"문장내 검색된 횟수는 총 {count}회 입니다.")
print("변경된 문장은")
print("------------------------------------------------------------------")
print(changed_verse)
