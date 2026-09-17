-- DDL 데이터정의어로 테이블을 생성
-- TABLE 생성

CREATE TABLE 고객(
    고객아이디 VARCHAR(20) NOT NULL PRIMARY KEY,
    고객이름 VARCHAR(20) NOT NULL,
    나이 INT,
    등급 VARCHAR(10) NOT NULL,
    직업 VARCHAR(20),
    적립금 INT DEFAULT 0
);
CREATE TABLE 제품(
    제품번호 CHAR(5) NOT NULL PRIMARY KEY,
    제품명 VARCHAR(20),
    재고량 INT,
    단가 INT,
    제조업체 VARCHAR(20),
    CHECK (재고량>=0 AND 재고량 <=10000)
);
CREATE TABLE 주문(
    주문번호 CHAR(3) NOT NULL PRIMARY KEY,
    주문고객 VARCHAR(20),
    주문제품 CHAR(5),
    수량 INT,
    배송지 VARCHAR(30),
    주문일자 DATE,
    FOREIGN KEY(주문고객) REFERENCES 고객(고객아이디),
    FOREIGN KEY(주문제품) REFERENCES 제품(제품번호)
);
CREATE TABLE 배송업체(
    업체번호 VARCHAR(5) NOT NULL PRIMARY KEY,
    업체명 VARCHAR(20),
    주소 VARCHAR(100),
    전화번호 VARCHAR(20)
    
);