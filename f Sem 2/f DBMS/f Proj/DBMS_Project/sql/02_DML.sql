-- ==============================================================
-- CS1211 DATABASE MANAGEMENT SYSTEM
-- Smart Hostel Management System
-- File: 02_DML.sql  |  Data Manipulation Language (INSERT)
-- ==============================================================

USE hostel_db;

-- -------------------------
-- Insert Blocks
-- -------------------------
INSERT INTO block (block_name, block_type, total_rooms, location) VALUES
('Alpha Block',  'boys',  60, 'North Wing, Ground Floor'),
('Beta Block',   'boys',  60, 'North Wing, First Floor'),
('Gamma Block',  'girls', 50, 'South Wing, Ground Floor'),
('Delta Block',  'girls', 50, 'South Wing, First Floor');

-- -------------------------
-- Insert Rooms
-- -------------------------
-- Alpha Block (block_id = 1)
INSERT INTO room (block_id, room_number, floor, capacity, room_type, ac_available) VALUES
(1, 'A101', 1, 1, 'single', TRUE),
(1, 'A102', 1, 2, 'double', TRUE),
(1, 'A103', 1, 3, 'triple', FALSE),
(1, 'A201', 2, 2, 'double', TRUE),
(1, 'A202', 2, 1, 'single', FALSE),
-- Beta Block (block_id = 2)
(2, 'B101', 1, 2, 'double', FALSE),
(2, 'B102', 1, 3, 'triple', FALSE),
(2, 'B201', 2, 2, 'double', TRUE),
-- Gamma Block (block_id = 3)
(3, 'G101', 1, 1, 'single', TRUE),
(3, 'G102', 1, 2, 'double', FALSE),
(3, 'G201', 2, 2, 'double', TRUE),
-- Delta Block (block_id = 4)
(4, 'D101', 1, 2, 'double', TRUE),
(4, 'D102', 1, 3, 'triple', FALSE),
(4, 'D201', 2, 1, 'single', TRUE);

-- -------------------------
-- Insert Students
-- -------------------------
INSERT INTO student (usn, full_name, email, phone, program, semester, joined_date) VALUES
('RVU24CSE001', 'Aarav Sharma',   'aarav.sharma@rvu.edu.in',   '9876543210', 'B.Tech CSE', 2, '2024-07-15'),
('RVU24CSE002', 'Priya Nair',     'priya.nair@rvu.edu.in',     '9876543211', 'B.Tech CSE', 2, '2024-07-15'),
('RVU24CSE003', 'Kiran Reddy',    'kiran.reddy@rvu.edu.in',    '9876543212', 'B.Tech CSE', 2, '2024-07-16'),
('RVU24CSE004', 'Sneha Patel',    'sneha.patel@rvu.edu.in',    '9876543213', 'B.Tech CSE', 2, '2024-07-16'),
('RVU23CSE010', 'Ravi Kumar',     'ravi.kumar@rvu.edu.in',     '9876543214', 'B.Tech CSE', 4, '2023-07-10'),
('RVU23CSE011', 'Ananya Singh',   'ananya.singh@rvu.edu.in',   '9876543215', 'B.Tech CSE', 4, '2023-07-10'),
('RVU23EEE012', 'Deepak Rao',     'deepak.rao@rvu.edu.in',     '9876543216', 'B.Tech EEE', 4, '2023-07-11'),
('RVU24EEE003', 'Meera Joshi',    'meera.joshi@rvu.edu.in',    '9876543217', 'B.Tech EEE', 2, '2024-07-17'),
('RVU22CSE020', 'Arjun Mehta',    'arjun.mehta@rvu.edu.in',    '9876543218', 'B.Tech CSE', 6, '2022-07-12'),
('RVU22CSE021', 'Lakshmi Iyer',   'lakshmi.iyer@rvu.edu.in',   '9876543219', 'B.Tech CSE', 6, '2022-07-12');

-- -------------------------
-- Insert Wardens
-- -------------------------
INSERT INTO warden (full_name, email, phone, block_id) VALUES
('Mr. Suresh Babu',   'suresh.babu@rvu.edu.in',   '9811111111', 1),
('Mr. Prakash Nair',  'prakash.nair@rvu.edu.in',  '9811111112', 2),
('Ms. Kavitha Devi',  'kavitha.devi@rvu.edu.in',  '9811111113', 3),
('Ms. Rajeshwari KP', 'rajeshwari.kp@rvu.edu.in', '9811111114', 4);

-- -------------------------
-- Insert Allocations
-- -------------------------
INSERT INTO allocation (student_id, room_id, alloc_date, vacate_date, status) VALUES
(1,  2, '2024-07-20', NULL, 'active'),   -- Aarav -> A102
(2,  10,'2024-07-20', NULL, 'active'),   -- Priya -> G102
(3,  6, '2024-07-21', NULL, 'active'),   -- Kiran -> B101
(4,  11,'2024-07-21', NULL, 'active'),   -- Sneha -> G201
(5,  8, '2023-07-15', NULL, 'active'),   -- Ravi  -> B201
(6,  12,'2023-07-15', NULL, 'active'),   -- Ananya-> D101
(7,  3, '2023-07-16', NULL, 'active'),   -- Deepak-> A103
(8,  14,'2024-07-22', NULL, 'active'),   -- Meera -> D201
(9,  1, '2022-07-18', NULL, 'active'),   -- Arjun -> A101
(10, 9, '2022-07-18', NULL, 'active');   -- Lakshmi->G101

-- -------------------------
-- Insert Fee Payments
-- -------------------------
INSERT INTO fee_payment (student_id, semester, amount, due_date, payment_date, mode, status) VALUES
(1,  2, 45000.00, '2024-08-31', '2024-08-15', 'upi',    'paid'),
(2,  2, 45000.00, '2024-08-31', '2024-08-20', 'online', 'paid'),
(3,  2, 42000.00, '2024-08-31', NULL,          NULL,     'overdue'),
(4,  2, 45000.00, '2024-08-31', '2024-09-05', 'cash',   'paid'),
(5,  4, 42000.00, '2024-08-31', '2024-08-10', 'upi',    'paid'),
(6,  4, 45000.00, '2024-08-31', NULL,          NULL,     'pending'),
(7,  4, 42000.00, '2024-08-31', '2024-08-25', 'online', 'paid'),
(8,  2, 48000.00, '2024-08-31', NULL,          NULL,     'overdue'),
(9,  6, 42000.00, '2024-08-31', '2024-08-01', 'online', 'paid'),
(10, 6, 45000.00, '2024-08-31', '2024-08-05', 'upi',    'paid');

-- -------------------------
-- Insert Complaints
-- -------------------------
INSERT INTO complaint (student_id, room_id, category, description, priority, status, filed_date, resolved_date) VALUES
(1,  2,  'maintenance', 'Ceiling fan making noise',          'medium', 'resolved', '2024-08-01', '2024-08-03'),
(3,  6,  'hygiene',     'Washroom not cleaned for 3 days',   'high',   'in_progress','2024-09-10', NULL),
(5,  8,  'maintenance', 'Window latch broken',               'low',    'resolved', '2024-08-15', '2024-08-18'),
(7,  3,  'noise',       'Loud music from room A104 at night','medium', 'open',     '2024-09-12', NULL),
(9,  1,  'security',    'CCTV camera not working on floor 1','high',   'in_progress','2024-09-05', NULL),
(2,  10, 'maintenance', 'AC not cooling properly',           'medium', 'resolved', '2024-08-20', '2024-08-22'),
(6,  12, 'hygiene',     'Common area garbage not cleared',   'high',   'open',     '2024-09-15', NULL),
(10, 9,  'maintenance', 'Door lock stiff',                   'low',    'resolved', '2024-09-01', '2024-09-02');

-- -------------------------
-- Insert Visitors
-- -------------------------
INSERT INTO visitor (student_id, visitor_name, relationship, phone, visit_date, check_in_time, check_out_time) VALUES
(1, 'Rajesh Sharma',   'Father',  '9900001111', '2024-09-08', '10:00:00', '13:00:00'),
(1, 'Sunita Sharma',   'Mother',  '9900001112', '2024-09-14', '11:00:00', '14:00:00'),
(3, 'Sunil Reddy',     'Father',  '9900001113', '2024-09-09', '09:30:00', '12:30:00'),
(5, 'Mohan Kumar',     'Brother', '9900001114', '2024-09-10', '15:00:00', '17:00:00'),
(7, 'Ramesh Rao',      'Uncle',   '9900001115', '2024-09-11', '10:30:00', '12:00:00'),
(9, 'Vijay Mehta',     'Father',  '9900001116', '2024-09-12', '09:00:00', '11:00:00'),
(9, 'Priya Mehta',     'Sister',  '9900001117', '2024-09-18', '14:00:00', '16:00:00'),
(2, 'Geetha Nair',     'Mother',  '9900001118', '2024-09-13', '10:00:00', '13:30:00'),
(4, 'Amit Patel',      'Brother', '9900001119', '2024-09-15', '12:00:00', '15:00:00'),
(10,'Krishnan Iyer',   'Father',  '9900001120', '2024-09-16', '11:00:00', '13:00:00');
