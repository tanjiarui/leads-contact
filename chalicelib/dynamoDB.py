import boto3


class DB:
	def __init__(self):
		dynamodb = boto3.resource('dynamodb', aws_access_key_id='AKIAVPRXNHVE3Z7UU3AQ', aws_secret_access_key='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')
		self.table = dynamodb.Table('datastore')

	def insert_item(self, item: dict):
		response = self.table.put_item(Item=item)
		return response

	def find_item(self, item_id: str):
		response = self.table.get_item(Key={'id': item_id})
		return response['Item']

	def update_item(self, item: dict):
		response = self.table.update_item(
			Key={'id': item['id']},
			UpdateExpression='set username=:n, phone=:p, email=:e, website=:w, address=:a',
			ExpressionAttributeValues={
				':n': item['name'] if 'name' in item.keys() else None,
				':p': item['phone'] if 'phone' in item.keys() else None,
				':e': item['email'] if 'email' in item.keys() else None,
				':w': item['website'] if 'website' in item.keys() else None,
				':a': item['address'] if 'address' in item.keys() else None
			},
			ReturnValues='UPDATED_NEW'
		)
		return response

	def delete_item(self, item_id: str):
		response = self.table.delete_item(Key={'id': item_id})
		return response