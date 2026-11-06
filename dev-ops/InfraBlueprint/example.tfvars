aws_region           = "us-east-1"
vpc_cidr             = "10.0.0.0/16"
public_subnet_cidrs  = ["10.0.1.0/24", "10.0.2.0/24"]
private_subnet_cidrs = ["10.0.11.0/24", "10.0.12.0/24"]
allowed_ssh_cidr     = "203.0.113.1/32"
db_username          = "vela_admin"
db_password          = "ChangeMe123!"
s3_bucket_name       = "vela-assets-replace-with-unique-suffix"
