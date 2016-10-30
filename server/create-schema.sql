create table user 
(
	ethaddress char(40) primary key, 
	dboxtoken char(60) not null, 
	pubkey char(216) not null
);

create table file 
(
	id integer primary key, 
	owner char(40) not null, 
	ownerlink varchar(4000) not null, 
	filekey char(255) not null, 
	
	constraint file_uq unique (owner, ownerlink),
	constraint file_user_fk foreign key (owner) references user(ethaddress)
);

create table pending_share
(
	id integer primary key,
	addressee char(40) not null,
	file integer not null,
	sharelink varchar(4000) not null,
	sharekey char(255) not null,
	
	constraint pend_share_uq unique (addressee, file),
	constraint pend_share_user_fk foreign key (addressee) references user(ethaddress),
	constraint pend_share_file_fk foreign key (file) references file(id)
);