-- 1. 학생
CREATE TABLE student (
    student_id   VARCHAR2(20)  NOT NULL,
    student_name VARCHAR2(50)  NOT NULL,
    department   VARCHAR2(100) NOT NULL,
    phone        VARCHAR2(30)  NOT NULL,
    CONSTRAINT pk_student PRIMARY KEY (student_id)
);

COMMENT ON COLUMN student.student_id IS '학번';
COMMENT ON COLUMN student.student_name IS '이름';
COMMENT ON COLUMN student.department IS '학과';
COMMENT ON COLUMN student.phone IS '연락처';

-- 2. 장비 분류
CREATE TABLE equipment_category (
    category_id   NUMBER GENERATED ALWAYS AS IDENTITY,
    category_name VARCHAR2(100) NOT NULL,
    CONSTRAINT pk_equipment_category PRIMARY KEY (category_id),
    CONSTRAINT uq_equipment_category_name UNIQUE (category_name)
);

COMMENT ON COLUMN equipment_category.category_id IS '분류번호';
COMMENT ON COLUMN equipment_category.category_name IS '분류명';

-- 3. 장비
CREATE TABLE equipment (
    equipment_id     NUMBER GENERATED ALWAYS AS IDENTITY,
    category_id      NUMBER        NOT NULL,
    equipment_name   VARCHAR2(100) NOT NULL,
    model_name       VARCHAR2(100) DEFAULT NULL,
    equipment_status VARCHAR2(20)  DEFAULT 'AVAILABLE' NOT NULL,
    CONSTRAINT pk_equipment PRIMARY KEY (equipment_id),
    CONSTRAINT fk_equipment_category FOREIGN KEY (category_id)
        REFERENCES equipment_category (category_id),
    CONSTRAINT ck_equipment_status
        CHECK (equipment_status IN ('AVAILABLE', 'MAINTENANCE'))
);

COMMENT ON COLUMN equipment.equipment_id IS '장비번호';
COMMENT ON COLUMN equipment.category_id IS '분류번호';
COMMENT ON COLUMN equipment.equipment_name IS '장비명';
COMMENT ON COLUMN equipment.model_name IS '모델명';
COMMENT ON COLUMN equipment.equipment_status IS '장비상태';

-- 4. 예약
CREATE TABLE reservation (
    reservation_id     NUMBER GENERATED ALWAYS AS IDENTITY,
    student_id         VARCHAR2(20) NOT NULL,
    equipment_id       NUMBER       NOT NULL,
    starts_at          DATE         NOT NULL,
    ends_at            DATE         NOT NULL,
    reservation_status VARCHAR2(20) DEFAULT 'PENDING' NOT NULL,
    CONSTRAINT pk_reservation PRIMARY KEY (reservation_id),
    CONSTRAINT fk_reservation_student FOREIGN KEY (student_id)
        REFERENCES student (student_id),
    CONSTRAINT fk_reservation_equipment FOREIGN KEY (equipment_id)
        REFERENCES equipment (equipment_id),
    CONSTRAINT ck_reservation_period CHECK (starts_at < ends_at),
    CONSTRAINT ck_reservation_status
        CHECK (reservation_status IN ('PENDING', 'APPROVED', 'CANCELLED'))
);

CREATE INDEX ix_reservation_student ON reservation (student_id);
CREATE INDEX ix_reservation_overlap ON reservation (equipment_id, reservation_status, starts_at, ends_at);

COMMENT ON COLUMN reservation.reservation_id IS '예약번호';
COMMENT ON COLUMN reservation.student_id IS '학번';
COMMENT ON COLUMN reservation.equipment_id IS '장비번호';
COMMENT ON COLUMN reservation.starts_at IS '예약시작일시';
COMMENT ON COLUMN reservation.ends_at IS '예약종료일시';
COMMENT ON COLUMN reservation.reservation_status IS '예약상태';

-- 5. 장비 대여
CREATE TABLE equipment_loan (
    loan_id        NUMBER GENERATED ALWAYS AS IDENTITY,
    reservation_id NUMBER NOT NULL,
    loaned_at      DATE   NOT NULL,
    returned_at    DATE   DEFAULT NULL,
    CONSTRAINT pk_equipment_loan PRIMARY KEY (loan_id),
    CONSTRAINT uq_equipment_loan_reservation UNIQUE (reservation_id),
    CONSTRAINT fk_equipment_loan_reservation FOREIGN KEY (reservation_id)
        REFERENCES reservation (reservation_id),
    CONSTRAINT ck_equipment_loan_return
        CHECK (returned_at IS NULL OR returned_at >= loaned_at)
);

COMMENT ON COLUMN equipment_loan.loan_id IS '대여번호';
COMMENT ON COLUMN equipment_loan.reservation_id IS '예약번호';
COMMENT ON COLUMN equipment_loan.loaned_at IS '대여일시';
COMMENT ON COLUMN equipment_loan.returned_at IS '실제반납일시';

-- 6. 정비
CREATE TABLE maintenance (
    maintenance_id NUMBER GENERATED ALWAYS AS IDENTITY,
    equipment_id   NUMBER         NOT NULL,
    started_at     DATE           NOT NULL,
    completed_at   DATE           DEFAULT NULL,
    reason         VARCHAR2(500)  NOT NULL,
    action_taken   VARCHAR2(1000) DEFAULT NULL,
    CONSTRAINT pk_maintenance PRIMARY KEY (maintenance_id),
    CONSTRAINT fk_maintenance_equipment FOREIGN KEY (equipment_id)
        REFERENCES equipment (equipment_id),
    CONSTRAINT ck_maintenance_time
        CHECK (completed_at IS NULL OR completed_at >= started_at),
    CONSTRAINT ck_maintenance_completion
        CHECK ((completed_at IS NULL AND action_taken IS NULL)
            OR (completed_at IS NOT NULL AND action_taken IS NOT NULL))
);

CREATE INDEX ix_maintenance_equipment ON maintenance (equipment_id, completed_at);

COMMENT ON COLUMN maintenance.maintenance_id IS '정비번호';
COMMENT ON COLUMN maintenance.equipment_id IS '장비번호';
COMMENT ON COLUMN maintenance.started_at IS '정비시작일시';
COMMENT ON COLUMN maintenance.completed_at IS '정비완료일시';
COMMENT ON COLUMN maintenance.reason IS '정비사유';
COMMENT ON COLUMN maintenance.action_taken IS '처리내용';

-- 7. 대여 조회 뷰
CREATE VIEW v_equipment_loan AS
SELECT l.loan_id, l.reservation_id, r.student_id, r.equipment_id,
       l.loaned_at, r.ends_at AS due_at, l.returned_at
FROM equipment_loan l
JOIN reservation r ON r.reservation_id = l.reservation_id;