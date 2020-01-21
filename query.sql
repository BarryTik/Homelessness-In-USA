CREATE TABLE homeless(
	id serial primary key,
	state varchar(2),
	overallHomeless integer,
	shelteredHomeless integer,
	unshelteredHomeless integer,
	individualHomeless integer,
	inFamilyHomeless integer,
	chronicHomeless integer,
	veteranHomeless integer
);

select * from homeless;

CREATE TABLE population(
	id serial primary key,
	state varchar(30),
	region integer,
	pop2007 integer,
	pop2008 integer,
	pop2009 integer,
	pop2010 integer,
	pop2011 integer,
	pop2012 integer,
	pop2013 integer,
	pop2014 integer,
	pop2015 integer,
	pop2016 integer,
	pop2017 integer,
	pop2018 integer,
	pop2019 integer
);

select * from population;