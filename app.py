import json, base64
from chalice import Chalice
from chalicelib import storage_service
from chalicelib import recognition_service
from chalicelib import comprehend_service
from chalicelib import dynamoDB

#####
# chalice app configuration
#####
app = Chalice(app_name='leads contact')
app.debug = True

#####
# services initialization
#####
access_key_id = 'AKIAVPRXNHVE3Z7UU3AQ'
secret_access_key = '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'
storage_location = 's3-bucket-terry'
storage_service = storage_service.Storage(storage_location, access_key_id, secret_access_key)
recognition_service = recognition_service.Recognition(storage_service, access_key_id, secret_access_key)
comprehend_service = comprehend_service.Comprehend(access_key_id, secret_access_key)
db = dynamoDB.DB(access_key_id, secret_access_key)


####
# restful endpoints
####
@app.route('/images', methods=['POST'], cors=True)
def upload_image():
	# processes file upload and saves file to storage service
	request_data = json.loads(app.current_request.raw_body)
	file_name = request_data['filename']
	file_bytes = base64.b64decode(request_data['filebytes'])
	image_info = storage_service.upload_file(file_bytes, file_name)
	return image_info


@app.route('/images/{image_id}/detect-text', methods=['GET'], cors=True)
def detect_text(image_id):
	# image to text and extract Personally identifiable information
	card = recognition_service.detect_text(image_id)
	identifiable_information = comprehend_service.detect_pii(card)
	return identifiable_information


@app.route('/contacts/{image_id}/save-text', methods=['POST'], cors=True)
def save_text(image_id):
	# upload an item
	# format of request body {name: '', phone: '', email: '', website: '', address: ''}
	request_data = json.loads(app.current_request.raw_body)
	item = {'id': image_id, 'username': request_data['name'], 'phone': request_data['phone'], 'email': request_data['email'], 'website': request_data['website'], 'address': request_data['address']}
	return db.insert_item(item)


@app.route('/contacts/find-text', methods=['POST'], cors=True)
def find_text():
	# find an item by name
	# format of request body {name: ''}
	request_data = json.loads(app.current_request.raw_body)
	return db.find_item(request_data['name'])


@app.route('/contacts/{image_id}/update-text', methods=['PUT'], cors=True)
def update_text(image_id):
	# update an item
	# format of request body {'name', 'phone', 'email', 'website', 'address'}
	request_data = json.loads(app.current_request.raw_body)
	item = {'id': image_id, 'name': request_data['name'], 'phone': request_data['phone'], 'email': request_data['email'], 'website': request_data['website'], 'address': request_data['address']}
	return db.update_item(item)


@app.route('/contacts/{image_id}/delete-text', methods=['DELETE'], cors=True)
def delete_text(image_id):
	# delete an item
	return db.delete_item(image_id)