create table user(
    id int PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(250),
    contactNumber VARCHAR(20),
    email VARCHAR(50),
    password VARCHAR(250),
    status varchar(20),
    role VARCHAR(20),
    UNIQUE (email)
);

insert into user(name, contactNumber, email, password, status, role) values('Admin', '9548747045', 'admin@CN.in', 'password', 'true', 'admin');


create table category(
    id int not NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    PRIMARY key(id)
)

create table product(
    id int not null AUTO_INCREMENT,
    name VARCHAR(255) not null,
    categoryID INTEGER not null,
    description VARCHAR(255),
    price INTEGER,
    status VARCHAR(20),
    PRIMARY key(id)
);

create table bill(
    id int not null AUTO_INCREMENT,
    uuid VARCHAR(200) not null,
    name VARCHAR(200) not null, 
    email VARCHAR(255) not null,
    contactNumber VARCHAR(20) not null,
    paymentMethod VARCHAR(50) not null,
    total int not null,
    productDetails JSON DEFAULT NULL,
    createdBy VARCHAR(255) not null,
    PRIMARY KEY(id)
);