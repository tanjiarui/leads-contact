import boto3


class Recognition:
	def __init__(self, storage_service, access_key_id, secret_access_key):
		self.client = boto3.client('rekognition', aws_access_key_id=access_key_id, aws_secret_access_key=secret_access_key)
		self.bucket_name = storage_service.get_storage_location()

	def detect_text(self, file_name):
		response = self.client.detect_text(
			Image={
				'S3Object': {
					'Bucket': self.bucket_name,
					'Name': file_name
				}
			}
		)

		lines = list()
		for detection in response['TextDetections']:
			if detection['Type'] == 'LINE':
				lines.append({
					'text': detection['DetectedText'],
					'confidence': detection['Confidence']
				})

		return lines