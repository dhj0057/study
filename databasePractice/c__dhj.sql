--집계 함수:
--sum, avg <= 숫자데이터 컬럼만 사용가능
--count, min, max <=모든 데이터에 사용가능
--select절 또는 having절에 사용

--고객테이블에서 나이의 평균을 검색하시오.
select avg(나이) 고객나이평균 from 고객;

--고객테이블에서 성이 '감'또는 '최'또는 '오'인 고객의 나이평균을 검색하시오(나이평균은 소수점이하2째자리까지표시하시오.)

select round(avg(나이), 2) 고객나이평균 from 고객
    where 고객이름 like '김%' or 고객이름 like'최%' or 고객이름 like '오%';

--제품테이블에서 제조업체가 한빛제과 또는 대한식품은 제품의 단가평균을 검색하시오.(평균 3째자리까지)

select round(avg(단가), 3) as "단가평균"
from 제품
where 제조업체 in ('한빛제과', '대한식품');

--  SUM: 합계함수
--  한빛제과에서 제조한 제품의 재고량 합계를 제품 테이블에서 검색하시오.
SELECT SUM(재고량) 재고량합계
    FROM 제품
    WHERE 제조업체 = '한빛제과';
 
--  COUNT 함수
SELECT *
    FROM 고객;
 
--  고객 테이블에서 고객의 수를 구하시오.
SELECT COUNT(*)
    FROM 고객;
 
SELECT COUNT(고객이름)
    FROM 고객;
SELECT COUNT(나이)
    FROM 고객;
--  나이커럼에는 Null 값을 포함하고 있어서 개수에서 제외된다.
SELECT COUNT(나이)
    FROM 고객;
--  제품테이블에서 제조업체가 대한식품인 제품의 개수를 구하시오.
SELECT COUNT(재고량) 제품개수
    FROM 제품
    WHERE 제조업체 = '대한식품';

--주문테이블에서 apple 주문고객이 주문한 수량의 합계와 주문한 제품의 개수를 구하시오
SELECT SUM(수량) AS 수량합계,
       COUNT(주문제품) AS 제품개수
FROM 주문
WHERE 주문고객 = 'apple';

--제품 테이블에서 제조업체명을 표시하시오.(중복제조업체는 제거하시오)

SELECT DISTINCT 제조업체 
FROM 제품;

--제품 테이블에서 참여한 제조업체의 수를 구하시오(중복되는 제조업체는 제거하시오.)
SELECT COUNT(DISTINCT 제조업체) AS 참여제조업체수
FROM 제품;

--제품 테이블에서 제조업체명에 '한'이 포함된 참여한 제조업체의 수를 구하시오(중복되는 제조업체는 제거하시오)
SELECT COUNT(DISTINCT 제조업체) AS 참여제조업체수
FROM 제품
WHERE 제조업체 LIKE '%한%';

SELECT * FROM 주문;

--주문 테이블에서 주문고객별 수량의 합계를 구하시오.
SELECT 주문고객, SUM(수량) 총주문수량 
FROM 주문
GROUP BY 주문고객;

--제품테이블에서 제조업체별로 제조한 제품의 개수와 제품중 가장 비싼단가를 검색하되
--제품의 개수는 제품수, 가장비싼 단가는 최고가라고 출력하시오.

SELECT 제조업체,
       COUNT(*) AS 제품수,
       MAX(단가) AS 최고가
FROM 제품
GROUP BY 제조업체;

--주문테이블에서 주문고객별로 주문한 제품의 개수와 주문수량 중 가장 작은 수량을 검색
--(단, 주문 한 제품의 개수는 주문제품수, 가장작은수량은 최소수량으로 출력하시오.)

SELECT 주문고객,
        COUNT(*) AS 주문제품수,
        MIN(수량) AS 최소수량
FROM 주문
GROUP BY 주문고객;


--제품테이블에서 제품을 개이상 제조한 제조업체별로 제품의 개수와 가장비싼 단가를 출력하시오.
--(제품의 개수는 제품수, 가장비싼단가는 최고가로 출력)

SELECT 제조업체,
    COUNT(*) 주문제품수,
    MAX(단가) 최고가 
FROM 제품
GROUP BY 제조업체
HAVING COUNT(*) >= 3;

--고객 테이블에서 직업별 최고령자의 나이와 초연소자의 나이를 출력하시오.
SELECT * FROM 고객;

SELECT 직업,
MAX(나이) 최고령자,
MIN(나이) 최연소자
FROM 고객
GROUP BY 직업;

--고객테이블에서 적립금의 합계가 2000원 미만인 직업별 최고령자의 나이와 최소연소자의 나이를 출력하시요
SELECT * FROM 고객;

SELECT 직업,
MAX(나이) 최고령나이,
MIN(나이) 최연소나이
FROM 고객
GROUP BY 직업
HAVING SUM(적립금) < 2000;

