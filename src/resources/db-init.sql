create table client 
(
	client_id SERIAL primary key,
	client_name varchar(100) not null unique,
    client_state varchar(20) not null default 'active'
);

create table type 
(
	type_id SERIAL primary key,
	type_name varchar(20) not null unique,
    type_state varchar(20) not null default 'active'
);

create table trx 
(
	trx_id SERIAL primary key,
	client_id int not null,
    type_id int not null,
    trx_debe float,
    trx_haber float,
    trx_date date not null,
    trx_state varchar(20) not null default 'active'
);