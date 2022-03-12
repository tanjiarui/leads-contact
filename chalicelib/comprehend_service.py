import boto3


class Comprehend:
	def __init__(self):
		self.client = boto3.client('comprehend')

	def detect_pii(self, text_line):
		text = ''
		for line in text_line:
			text += line['text'] + '\n'
		response = self.client.detect_pii_entities(Text=text, LanguageCode='en')
		result = dict()
		for entity in response['Entities']:
			result[entity['Type']] = text[entity['BeginOffset']:entity['EndOffset']]
		return result