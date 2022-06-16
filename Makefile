REGION ?= us-east-1
PROFILE ?= test
ENV_NAME ?= dev

DAPPS_STACK_NAME ?= sa-dapps-$(ENV_NAME)

CLUSTER ?= sa-dapps-$(ENV_NAME)

WENTHEMERGE_SVC ?= wenthemerge-sa-dapps-$(ENV_NAME)

FRIENDOFOURS_SVC ?= friendofours-sa-dapps-$(ENV_NAME)
FRIENDOFOURS_BUCKET ?= friendofours-885802336696-$(ENV_NAME)
FRIENDOFOURS_DIST ?= EWN9QYX0CL31L

ACCOUNT_ID := $(shell aws sts get-caller-identity --profile $(PROFILE) --query 'Account' --output text)

.PHONY: create-dapps-stack
create-dapps-stack:
	@aws cloudformation create-stack \
	--profile $(PROFILE) \
	--stack-name $(DAPPS_STACK_NAME) \
	--region $(REGION) \
	--capabilities CAPABILITY_NAMED_IAM \
	--template-body file://dapps.cfn.yml \
	--parameters file://dapps.json

.PHONY: delete-dapps-stack
delete-dapps-stack:
	@aws cloudformation delete-stack \
  --profile $(PROFILE) \
  --stack-name $(DAPPS_STACK_NAME) \
  --region $(REGION)

.PHONY: validate-dapps-template
validate-dapps-template:
	@aws cloudformation validate-template \
  --profile $(PROFILE) \
  --template-body file://dapps.cfn.yml \
  --region $(REGION)

.PHONY: update-dapps-stack
update-dapps-stack:
	@aws cloudformation update-stack \
  --profile $(PROFILE) \
  --stack-name $(DAPPS_STACK_NAME) \
  --region $(REGION) \
  --capabilities CAPABILITY_NAMED_IAM \
  --template-body file://dapps.cfn.yml \
	--parameters file://dapps.json

.PHONY: update-friendofours-service
update-friendofours-service:
	@aws ecr get-login-password \
  --profile $(PROFILE) \
  --region $(REGION) \
	| docker login --username AWS --password-stdin $(ACCOUNT_ID).dkr.ecr.$(REGION).amazonaws.com
	@docker build --platform linux/amd64 -t $(FRIENDOFOURS_SVC) .
	@docker tag $(FRIENDOFOURS_SVC):latest $(ACCOUNT_ID).dkr.ecr.$(REGION).amazonaws.com/$(FRIENDOFOURS_SVC):latest
	@docker push $(ACCOUNT_ID).dkr.ecr.$(REGION).amazonaws.com/$(FRIENDOFOURS_SVC):latest
	@aws ecs update-service \
  --profile $(PROFILE) \
  --region $(REGION) \
  --cluster $(CLUSTER) \
  --service $(FRIENDOFOURS_SVC) \
  --force-new-deployment

.PHONY: update-friendofours-web
update-friendofours-web:
	@npm run clean
	@nx build cb-pay-demo --production
	@aws s3 \
  --profile $(PROFILE) \
  --region $(REGION) \
	sync ./dist/apps/cb-pay-demo/ s3://$(FRIENDOFOURS_BUCKET)/
	@aws cloudfront create-invalidation \
  --profile $(PROFILE) \
  --region $(REGION) \
  --distribution-id $(FRIENDOFOURS_DIST) \
  --paths "/index.html" "/"

# ------------------------------------------------------------------------------

