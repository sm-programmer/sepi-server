--liquibase formatted sql

--changeset sm-programmer:create-table-alumno-1
CREATE TABLE IF NOT EXISTS ALUMNO (
	Boleta VARCHAR(12) NOT NULL,
	Nombre VARCHAR(45) NOT NULL,
	ApPat VARCHAR(45) NOT NULL,
	ApMat VARCHAR(45),
	Genero ENUM('M', 'F') NOT NULL,
	Domicilio VARCHAR(90) NOT NULL,
	Colonia VARCHAR(45) NOT NULL,
	Telefono VARCHAR(10) NOT NULL,
	CodPostal VARCHAR(5) NOT NULL,
	Estado ENUM('Inscrito', 'Baja temporal', 'Egresado') NOT NULL
);
--rollback DROP TABLE IF EXISTS ALUMNO;

--changeset sm-programmer:create-table-alumno-2
ALTER TABLE ALUMNO ADD PRIMARY KEY (Boleta);
--rollback ALTER TABLE ALUMNO DROP PRIMARY KEY;

--changeset sm-programmer:create-table-aspirante-1
CREATE TABLE IF NOT EXISTS ASPIRANTE(
	CURP VARCHAR(18) NOT NULL,
	Nombre VARCHAR(45) NOT NULL,
	ApPat VARCHAR(45) NOT NULL,
	ApMat VARCHAR(45),
	Genero ENUM('M', 'F') NOT NULL,
	Domicilio VARCHAR(90) NOT NULL,
	Colonia VARCHAR(45) NOT NULL,
	Telefono VARCHAR(10) NOT NULL,
	CodPostal VARCHAR(5) NOT NULL,
	Contra VARCHAR(256) NOT NULL
);
--rollback DROP TABLE IF EXISTS ASPIRANTE;

--changeset sm-programmer:create-table-aspirante-2
ALTER TABLE ASPIRANTE ADD PRIMARY KEY (CURP);
--rollback ALTER TABLE ASPIRANTE DROP PRIMARY KEY;
