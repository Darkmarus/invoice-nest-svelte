CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE files(
    id uuid DEFAULT gen_random_uuid() NULL PRIMARY KEY,
    "name" varchar(80) NULL,
    "path" varchar(255) NULL,
    "type" varchar(40) NULL,
    "size" float4 NULL,
    is_folder boolean NULL,
    parent_id uuid NULL,
    created_at timestamp with time zone NULL,
    updated_at timestamp with time zone NULL,
    CONSTRAINT files_unique UNIQUE(id)
);


CREATE TABLE public.products (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(120) NULL,
	stock int4 NULL,
	price numeric(15, 2) NULL,
    details varchar(255) NULL,
	enabled bool NULL,
	created_at timestamptz NULL,
	updated_at timestamptz NULL,
	deleted_at timestamptz NULL,
	CONSTRAINT products_pkey PRIMARY KEY (id)
);

CREATE TABLE image_products (
	product_id uuid NOT NULL,
	file_id uuid NOT NULL,
	"order" int2 DEFAULT 0 NOT NULL,
	CONSTRAINT image_products_pkey PRIMARY KEY (product_id, file_id),
	CONSTRAINT image_products_file_id_fkey FOREIGN KEY (file_id) REFERENCES public.files(id),
	CONSTRAINT image_products_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);

CREATE TABLE customers(
    id uuid PRIMARY KEY,
    first_name varchar(70) NOT NULL,
    last_name varchar(70) NOT NULL,
    "address" varchar(120),
    phone varchar(20),
    "enabled" boolean NOT NULL,
    avatar_id uuid REFERENCES files(id),
    created_at timestamp with time zone NULL,
    updated_at timestamp with time zone NULL
);

CREATE TABLE invoices(
    id uuid PRIMARY KEY,
    customer_id uuid REFERENCES customers(id),
    first_name varchar(70) NOT NULL,
    last_name varchar(70) NOT NULL,
    address varchar(120),
    status varchar(16),
    total numeric(15, 2),
    created_at timestamp with time zone NULL,
    updated_at timestamp with time zone NULL
);

CREATE TABLE invoice_items(
    id uuid PRIMARY KEY,
    invoice_id uuid REFERENCES invoices(id),
    product_id uuid REFERENCES products(id),
    quantity int4,
    price numeric(15, 2),
    subtotal numeric(15, 2),
    created_at timestamp with time zone NULL,
    updated_at timestamp with time zone NULL
);

CREATE TABLE dollar_exchange_rates(
    id uuid PRIMARY KEY,
    rate numeric(15, 2) NOT NULL,
    created_at timestamp with time zone NULL,
    updated_at timestamp with time zone NULL
);

CREATE TABLE price_change_log(
    id uuid PRIMARY KEY,
    product_id uuid REFERENCES products(id),
    dollar_exchange_id uuid REFERENCES dollar_exchange_rates(id),
    price_local numeric(15, 2),
    price_dollar numeric(15, 2),
    created_at timestamp with time zone NULL,
    updated_at timestamp with time zone NULL
);