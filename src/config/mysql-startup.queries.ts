export const CityTableQry = `CREATE TABLE IF NOT EXISTS CITY_MASTER(
ID INT UNSIGNED AUTO_INCREMENT,
NAME VARCHAR(100) NOT NULL,
STATE VARCHAR(100) ,
COUNTRY VARCHAR(100) ,
LONGITUDE DECIMAL(9,6) NOT NULL,
LATITUDE DECIMAL(9,6) NOT NULL,
CREATION_TSTAMP timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
MODIFICATION_TSTAMP timestamp ON UPDATE CURRENT_TIMESTAMP,
PRIMARY KEY(ID),
UNIQUE(NAME,LONGITUDE,LATITUDE)
);`;
