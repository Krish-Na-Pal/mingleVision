# MINGLEVISION
A real time messaging & video calling.
# Requirements
Django, Python
# Installation
* 1 - clone repo https://github.com/Krish-Na-Pal/mingleVision
* 2 - Create an account on agora.io and create an app to generate an APP ID
* 3 - Update APP ID, Temp Token and Channel Name in room_rtc.js
```javascript

let APP_ID = "YOU-APP-ID"
```
* 4 - Update EMAIL_HOST_USER and EMAIL_HOST_PASSWORD in setting.py
* --> This two you can get from google app key.
```python

EMAIL_HOST_USER = '<YOUR EMAIL ID>'
EMAIL_HOST_PASSWORD = '<YOUR EMAIL PASS KEY>'
```
* 5 - Create superuser for django admin
```terminal

python manage.py createsuperuser
```
* 6 - Make migrations and migrate objects in terminal
```command

python manage.py makemigrations
python manage.py migrate
```
* 7 - Run server
```terminal

python manage.py runserver
```
