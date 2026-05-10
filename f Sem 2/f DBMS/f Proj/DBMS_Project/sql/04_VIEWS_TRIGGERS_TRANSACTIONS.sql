-- ==============================================================
-- CS1211 DATABASE MANAGEMENT SYSTEM
-- Smart Hostel Management System
-- File: 04_VIEWS_TRIGGERS_TRANSACTIONS.sql
-- ==============================================================

USE hostel_db;

-- ============================================================
-- SECTION A: VIEWS
-- ============================================================

-- View 1: Current Occupancy Summary
-- Shows live room allocation details with block info
CREATE OR REPLACE VIEW current_occupancy_view AS
SELECT
    s.usn,
    s.full_name AS student_name,
    s.program,
    s.semester,
    b.block_name,
    b.block_type,
    r.room_number,
    r.floor,
    r.room_type,
    r.capacity,
    r.ac_available,
    a.alloc_date
FROM allocation a
JOIN student s ON a.student_id = s.student_id
JOIN room r    ON a.room_id = r.room_id
JOIN block b   ON r.block_id = b.block_id
WHERE a.status = 'active';

-- Usage:
SELECT * FROM current_occupancy_view ORDER BY block_name, room_number;

-- View 2: Pending Dues Report
-- Shows all students with unpaid or overdue fee status
CREATE OR REPLACE VIEW pending_dues_view AS
SELECT
    s.usn,
    s.full_name,
    s.email,
    s.phone,
    b.block_name,
    r.room_number,
    fp.semester,
    fp.amount       AS amount_due,
    fp.due_date,
    fp.status       AS payment_status,
    DATEDIFF(CURDATE(), fp.due_date) AS days_overdue
FROM fee_payment fp
JOIN student s    ON fp.student_id = s.student_id
JOIN allocation a ON s.student_id = a.student_id AND a.status = 'active'
JOIN room r       ON a.room_id = r.room_id
JOIN block b      ON r.block_id = b.block_id
WHERE fp.status IN ('pending', 'overdue');

-- Usage:
SELECT * FROM pending_dues_view ORDER BY days_overdue DESC;

-- View 3: Complaint Dashboard
-- Summarizes complaint status per block
CREATE OR REPLACE VIEW complaint_dashboard_view AS
SELECT
    b.block_name,
    c.category,
    COUNT(*) AS total,
    SUM(CASE WHEN c.status = 'open'         THEN 1 ELSE 0 END) AS open_count,
    SUM(CASE WHEN c.status = 'in_progress'  THEN 1 ELSE 0 END) AS in_progress_count,
    SUM(CASE WHEN c.status = 'resolved'     THEN 1 ELSE 0 END) AS resolved_count,
    ROUND(SUM(CASE WHEN c.status = 'resolved' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS resolution_pct
FROM complaint c
JOIN room r  ON c.room_id = r.room_id
JOIN block b ON r.block_id = b.block_id
GROUP BY b.block_name, c.category;

-- Usage:
SELECT * FROM complaint_dashboard_view ORDER BY block_name, total DESC;


-- ============================================================
-- SECTION B: TRIGGERS
-- ============================================================

-- Trigger 1: Prevent room over-allocation
-- Fires BEFORE INSERT on allocation; checks that room is not at capacity
DELIMITER $$

CREATE TRIGGER trg_check_capacity_before_alloc
BEFORE INSERT ON allocation
FOR EACH ROW
BEGIN
    DECLARE current_occupancy INT;
    DECLARE room_capacity     INT;

    -- Count active residents in the target room
    SELECT COUNT(*) INTO current_occupancy
    FROM allocation
    WHERE room_id = NEW.room_id AND status = 'active';

    -- Get the declared capacity of the room
    SELECT capacity INTO room_capacity
    FROM room
    WHERE room_id = NEW.room_id;

    -- Raise an error if adding this student would exceed capacity
    IF current_occupancy >= room_capacity THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Room is at full capacity. Allocation rejected.';
    END IF;
END$$

DELIMITER ;

-- Test Trigger 1 (should fail — room A101 is single-occupancy and already allocated):
-- INSERT INTO allocation (student_id, room_id, alloc_date, status)
-- VALUES (2, 1, '2024-10-01', 'active');


-- Trigger 2: Auto-mark fee as overdue after due date
-- Fires BEFORE UPDATE on fee_payment; sets status to 'overdue' if unpaid past due date
DELIMITER $$

CREATE TRIGGER trg_auto_overdue_on_update
BEFORE UPDATE ON fee_payment
FOR EACH ROW
BEGIN
    IF NEW.status = 'pending' AND CURDATE() > NEW.due_date THEN
        SET NEW.status = 'overdue';
    END IF;
END$$

DELIMITER ;

-- Trigger 3: Log resolved_date automatically on complaint resolution
DELIMITER $$

CREATE TRIGGER trg_set_resolved_date
BEFORE UPDATE ON complaint
FOR EACH ROW
BEGIN
    IF NEW.status = 'resolved' AND OLD.status != 'resolved' THEN
        SET NEW.resolved_date = CURDATE();
    END IF;
END$$

DELIMITER ;

-- Test Trigger 3:
UPDATE complaint SET status = 'resolved' WHERE complaint_id = 4;
-- Now check:
SELECT complaint_id, status, filed_date, resolved_date FROM complaint WHERE complaint_id = 4;


-- ============================================================
-- SECTION C: TRANSACTIONS
-- ============================================================

-- Transaction 1: Room Swap Between Two Students
-- Swaps the room allocations of student_id=1 (A102) and student_id=3 (B101)
START TRANSACTION;

    -- Step 1: Vacate student 1 from room A102
    UPDATE allocation
    SET status = 'vacated', vacate_date = CURDATE()
    WHERE student_id = 1 AND status = 'active';

    -- Step 2: Vacate student 3 from room B101
    UPDATE allocation
    SET status = 'vacated', vacate_date = CURDATE()
    WHERE student_id = 3 AND status = 'active';

    -- Step 3: Allocate student 1 to former room of student 3 (B101 = room_id 6)
    INSERT INTO allocation (student_id, room_id, alloc_date, status)
    VALUES (1, 6, CURDATE(), 'active');

    -- Step 4: Allocate student 3 to former room of student 1 (A102 = room_id 2)
    INSERT INTO allocation (student_id, room_id, alloc_date, status)
    VALUES (3, 2, CURDATE(), 'active');

COMMIT;

-- Transaction 2: Bulk Fee Payment Update for a Block
-- Marks all pending fees in Alpha Block as paid via online mode
START TRANSACTION;

    UPDATE fee_payment fp
    JOIN student s ON fp.student_id = s.student_id
    JOIN allocation a ON s.student_id = a.student_id AND a.status = 'active'
    JOIN room r ON a.room_id = r.room_id
    JOIN block b ON r.block_id = b.block_id
    SET fp.status = 'paid',
        fp.payment_date = CURDATE(),
        fp.mode = 'online'
    WHERE fp.status IN ('pending', 'overdue')
      AND b.block_name = 'Alpha Block';

    -- Verify the update
    SELECT fp.student_id, fp.status, fp.payment_date
    FROM fee_payment fp
    JOIN student s ON fp.student_id = s.student_id
    JOIN allocation a ON s.student_id = a.student_id AND a.status = 'active'
    JOIN room r ON a.room_id = r.room_id
    JOIN block b ON r.block_id = b.block_id
    WHERE b.block_name = 'Alpha Block';

COMMIT;

-- Transaction 3: Rollback Demo (simulating a failed allocation attempt)
START TRANSACTION;

    -- Attempt to insert a duplicate active allocation (will fail due to UNIQUE constraint)
    -- This simulates a failure scenario
    INSERT INTO allocation (student_id, room_id, alloc_date, status)
    VALUES (1, 6, CURDATE(), 'active');  -- student_id=1 already has active alloc after Transaction 1

    -- If above fails, rollback
ROLLBACK;
-- After ROLLBACK, no changes persist from this transaction.
