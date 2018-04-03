/**
    @rules
        all caps on mysql keywords
        use plural form on table names
        snake case everywhere
        use DATETIME type for dates
        start the column name with `date_` if type is DATETIME, e.g. `date_created`, `date_updated`, `date_expiration`
        use VARCHAR(37) as primary key for ID's exposed to the user
        use INT(11) AUTO_INCREMENT as primary key for ID's not exposed to the user
        use the proper mysql engine Innodb or MyISAM
        mind the column charset and table collation
        all tables should have an id (PRIMARY KEY), date_created and date_updated
            *table id will follow the this format :
                `<singular form of table_name>_id` PRIMARY KEY VARCHAR(32) or INT(11) AUTO_INCREMENT
        see sample below:
*/


DROP DATABASE IF EXISTS test;
CREATE DATABASE test;

USE test;

CREATE TABLE IF NOT EXISTS users (
    id       INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    date_updated DATETIME DEFAULT NULL,
    deleted DATETIME DEFAULT NULL
) ENGINE=InnoDB;

DROP TABLE IF EXISTS package;

CREATE TABLE IF NOT EXISTS package (
    id      INT(6) PRIMARY KEY,
    tracking_num VARCHAR(64) NOT NULL,
    package TEXT NOT NULL,
    date_received DATETIME DEFAULT NULL,
    status BOOLEAN DEFAULT false
);

DROP TABLE IF EXISTS courier;

CREATE TABLE IF NOT EXISTS courier(
    id      INT(6) PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name  VARCHAR(50) NOT NULL
);



DROP TABLE IF EXISTS grid;
CREATE TABLE IF NOT EXISTS grid (
    id VARCHAR(64) PRIMARY KEY,
    type VARCHAR(16) NOT NULL,
    zone VARCHAR(16) NOT NULL,
    lane VARCHAR(16) NOT NULL,
    bin VARCHAR(16) NOT NULL,
    area VARCHAR(64) NOT NULL,
    truck_type VARCHAR(64) NOT NULL,
    status VARCHAR(16) DEFAULT 'available' NOT NULL,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    deleted TIMESTAMP NULL
) ENGINE=MyISAM;

/* ROLLCAGE_SCHEMA */
DROP TABLE IF EXISTS rollcage;
CREATE TABLE IF NOT EXISTS rollcage (
    id VARCHAR(64) PRIMARY KEY,
    grid_id VARCHAR(64),
    code VARCHAR(16) UNIQUE,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    deleted TIMESTAMP NULL
) ENGINE=MyISAM;
