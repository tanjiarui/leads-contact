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
storage_location = 's3-bucket-terry'
storage_service = storage_service.Storage(storage_location)
recognition_service = recognition_service.Recognition(storage_service)
comprehend_service = comprehend_service.Comprehend()
db = dynamoDB.DB()


#####
# RESTful endpoints
#####
@app.route('/images', methods=['post'], cors=True)
def upload_image():
	# processes file upload and saves file to storage service
	request_data = json.loads(app.current_request.raw_body)
	file_name = request_data['filename']
	file_bytes = base64.b64decode(request_data['filebytes'])

	image_info = storage_service.upload_file(file_bytes, file_name)

	return image_info


@app.route('/images/{image_id}/detect-text', methods=['get'], cors=True)
def detect_text(image_id):
	# image to text and extract Personally identifiable information
	card = recognition_service.detect_text(image_id)
	identifiable_information = comprehend_service.detect_pii(card)
	return identifiable_information


@app.route('/contacts/{image_id}/save-text', methods=['post'], cors=True)
def save_text(image_id):
	# upload an item
	# format of request body {'name', 'phone', 'email', 'website', 'address'}
	request_data = json.loads(app.current_request.raw_body)
	item = {'id': image_id, 'name': request_data['name'], 'phone': request_data['phone'], 'email': request_data['email'], 'website': request_data['website'], 'address': request_data['address']}
	return db.insert_item(item)


@app.route('/contacts/{image_id}/find-text', methods=['get'], cors=True)
def find_text(image_id):
	# find an item
	return db.find_item(image_id)


@app.route('/contacts/{image_id}/update-text', methods=['update'], cors=True)
def update_text(image_id):
	# update an item
	# format of request body {'name', 'phone', 'email', 'website', 'address'}
	request_data = json.loads(app.current_request.raw_body)
	item = {'id': image_id, 'name': request_data['name'], 'phone': request_data['phone'], 'email': request_data['email'], 'website': request_data['website'], 'address': request_data['address']}
	db.update_item(item)


@app.route('/contacts/{image_id}/delete-text', methods=['delete'], cors=True)
def delete_text(image_id):
	# delete an item
	return db.delete_item(image_id)