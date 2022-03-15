import boto3


class Comprehend:
	def __init__(self, access_key_id, secret_access_key):
		self.client = boto3.client('comprehend', aws_access_key_id=access_key_id, aws_secret_access_key=secret_access_key)

	def detect_pii(self, text_line):
		text = ''
		for line in text_line:
			text += line['text'] + '\n'
		response = self.client.detect_pii_entities(Text=text, LanguageCode='en')
		result = dict()
		for entity in response['Entities']:
			result[entity['Type']] = text[entity['BeginOffset']:entity['EndOffset']]
		return result