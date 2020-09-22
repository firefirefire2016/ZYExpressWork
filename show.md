##数据库的初始化
1、创建一个数据库
2、使用`sequelize cli` 初始化项目的 数据库配置信息
		`npx sequelize init`
3、生成模型文件
	3.1、migrate文件
	3.2、model 文件
	`npx sequelize model:generate --name Todo 
--attributes name:string,deadline:date,content:string `

//收款表
yarn sequelize model:generate --name zycollection --attributes month:string,amount_received:decimal,amount_receivable:decimal,invoice_amount:decimal,contractid:integer

//租金标准表
yarn sequelize model:generate --name zyrentlist --attributes startdate:string,enddate:string,oncerate:string,onceamount:string,endamount:decimal,contractid:integer,remarks:string

//字典表
yarn sequelize model:generate --name zysysdict --attributes dicttype:string,dicttypecode:string,
dictcode:string,dictvalue:string,remarks:string,status:integer

//产权表
yarn sequelize model:generate --name zypropertyright --attributes simpleaddress:string,address:string,
owner:string,rightno:string,feature:string,type:string,community:string,commonstate:string,unitno:string,
usereason:string,rightfeature:string,area:string,insidearea:string,limitdate:string,otherstatus:string,
remarks:string,status:string

//单位表
yarn sequelize model:generate --name zyunit --attributes unit_name:string,unit_type:string,
unit_contacts:string,unit_tel:string,unit_add:string

//水电费表
yarn sequelize model:generate --name waterele --attributes check_month:string,property_add:string,
get_month:string,elecol_amount:decimal,elecheck_amount:decimal,elereceived_amount:decimal,watercol_amount:decimal,
watercheck_amount:decimal,waterreceived_amount:decimal,is_rent:string

4、持久化，模型对应的数据库表
	`npx sequelize db:migrate 
    yarn sequelize db:migrate