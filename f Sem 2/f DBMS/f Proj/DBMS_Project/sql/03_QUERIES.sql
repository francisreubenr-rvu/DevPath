-- ==============================================================
-- CS1211 DATABASE MANAGEMENT SYSTEM
-- Smart Hostel Management System
-- File: 03_QUERIES.sql  |  SELECT Queries (Simple, JOIN, Nested)
-- ==============================================================

USE hostel_db;

-- ============================================================
-- SECTION A: SIMPLE SELECT QUERIES
-- ============================================================

-- Q1: List all students currently in Semester 2
SELECT usn, full_name, program, email
FROM student
WHERE semester = 2
ORDER BY full_name;

-- Q2: List all rooms with AC availability in Alpha Block
SELECT r.room_number, r.floor, r.capacity, r.room_type, r.ac_available
FROM room r
JOIN block b ON r.block_id = b.block_id
WHERE b.block_name = 'Alpha Block' AND r.ac_available = TRUE;

-- Q3: Count total rooms per block
SELECT b.block_name, b.block_type, COUNT(r.room_id) AS room_count
FROM block b
LEFT JOIN room r ON b.block_id = r.block_id
GROUP BY b.block_id, b.block_name, b.block_type;

-- Q4: Students with overdue fee payments
SELECT s.usn, s.full_name, s.email, fp.semester, fp.amount, fp.due_date
FROM student s
JOIN fee_payment fp ON s.student_id = fp.student_id
WHERE fp.status = 'overdue'
ORDER BY fp.due_date;

-- Q5: Count of complaints by category
SELECT category, COUNT(*) AS total_complaints,
       SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) AS open_count,
       SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) AS resolved_count
FROM complaint
GROUP BY category
ORDER BY total_complaints DESC;

-- ============================================================
-- SECTION B: JOIN QUERIES
-- ============================================================

-- Q6: Complete room allocation report (INNER JOIN)
SELECT s.usn, s.full_name, s.program, s.semester,
       b.block_name, r.room_number, r.floor, r.room_type,
       a.alloc_date, a.status AS alloc_status
FROM student s
JOIN allocation a ON s.student_id = a.student_id
JOIN room r ON a.room_id = r.room_id
JOIN block b ON r.block_id = b.block_id
WHERE a.status = 'active'
ORDER BY b.block_name, r.room_number;

-- Q7: Warden and their block details (INNER JOIN)
SELECT w.full_name AS warden_name, w.email, w.phone,
       b.block_name, b.block_type, b.total_rooms
FROM warden w
JOIN block b ON w.block_id = b.block_id;

-- Q8: Fee payment status for all students with room info (3-table JOIN)
SELECT s.usn, s.full_name, b.block_name, r.room_number,
       fp.semester, fp.amount, fp.status AS payment_status,
       fp.due_date, fp.payment_date
FROM student s
JOIN allocation a ON s.student_id = a.student_id AND a.status = 'active'
JOIN room r ON a.room_id = r.room_id
JOIN block b ON r.block_id = b.block_id
JOIN fee_payment fp ON s.student_id = fp.student_id
ORDER BY fp.status DESC, s.full_name;

-- Q9: All complaints with student and room details (LEFT JOIN)
SELECT c.complaint_id, s.full_name AS student_name, b.block_name,
       r.room_number, c.category, c.priority, c.status,
       c.filed_date, c.resolved_date
FROM complaint c
JOIN student s ON c.student_id = s.student_id
JOIN room r ON c.room_id = r.room_id
JOIN block b ON r.block_id = b.block_id
ORDER BY c.priority DESC, c.filed_date;

-- Q10: Students who NEVER filed a complaint (LEFT JOIN + IS NULL)
SELECT s.usn, s.full_name, s.program, s.semester
FROM student s
LEFT JOIN complaint c ON s.student_id = c.student_id
WHERE c.complaint_id IS NULL
ORDER BY s.full_name;

-- Q11: Visitor frequency per student (aggregate JOIN)
SELECT s.usn, s.full_name,
       COUNT(v.visitor_id) AS total_visitors,
       MAX(v.visit_date) AS last_visit
FROM student s
LEFT JOIN visitor v ON s.student_id = v.student_id
GROUP BY s.student_id, s.usn, s.full_name
ORDER BY total_visitors DESC;

-- ============================================================
-- SECTION C: NESTED / SUBQUERIES
-- ============================================================

-- Q12: Students paying more than average hostel fee (subquery in WHERE)
SELECT s.usn, s.full_name, fp.amount
FROM student s
JOIN fee_payment fp ON s.student_id = fp.student_id
WHERE fp.amount > (SELECT AVG(amount) FROM fee_payment)
ORDER BY fp.amount DESC;

-- Q13: Rooms with high-priority unresolved complaints (correlated subquery)
SELECT DISTINCT b.block_name, r.room_number, r.floor
FROM room r
JOIN block b ON r.block_id = b.block_id
WHERE r.room_id IN (
    SELECT room_id FROM complaint
    WHERE priority = 'high' AND status != 'resolved'
)
ORDER BY b.block_name;

-- Q14: Block with the highest number of active allocations
SELECT b.block_name, COUNT(a.alloc_id) AS active_students
FROM block b
JOIN room r ON b.block_id = r.block_id
JOIN allocation a ON r.room_id = a.room_id
WHERE a.status = 'active'
GROUP BY b.block_id, b.block_name
HAVING COUNT(a.alloc_id) = (
    SELECT MAX(cnt) FROM (
        SELECT COUNT(a2.alloc_id) AS cnt
        FROM block b2
        JOIN room r2 ON b2.block_id = r2.block_id
        JOIN allocation a2 ON r2.room_id = a2.room_id
        WHERE a2.status = 'active'
        GROUP BY b2.block_id
    ) AS sub
);

-- Q15: Total revenue collected vs pending per block
SELECT b.block_name,
       SUM(CASE WHEN fp.status = 'paid'    THEN fp.amount ELSE 0 END) AS collected,
       SUM(CASE WHEN fp.status != 'paid'   THEN fp.amount ELSE 0 END) AS pending,
       SUM(fp.amount) AS total_billed
FROM block b
JOIN room r ON b.block_id = r.block_id
JOIN allocation a ON r.room_id = a.room_id AND a.status = 'active'
JOIN fee_payment fp ON a.student_id = fp.student_id
GROUP BY b.block_id, b.block_name;
