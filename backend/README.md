# Backend - Reast countries API clone 

### Installing Dependencies for the API

1. **Python 3.7** - Follow instructions to install the latest version of python for your Operating system in the [python](https://python.org


2. **Virtual Enviornment** - We recommend working within a virtual environment whenever using Python for projects. This keeps your dependencies for each project separate and organaized. Instructions for setting up a virual enviornment for your platform can be found in the [python docs](https://packaging.python.org/guides/installing-using-pip-and-virtual-environments/)


3. **PIP Dependencies** - Once you have your virtual environment setup and running, install dependencies by naviging to the project  directory and running:
```
pip install -r requirements.txt
```
This will install all of the required packages we selected within the `requirements.txt` file.


4. **Key Dependencies**
 - [Flask](http://flask.pocoo.org/)  is a lightweight backend microservices framework. Flask is required to handle requests and responses.

 - [SQLAlchemy](https://www.sqlalchemy.org/) is the Python SQL toolkit and ORM we'll use handle the lightweight sqlite database. You'll primarily work in app.py and can reference models.py. 

 - [Flask-CORS](https://flask-cors.readthedocs.io/en/latest/#) is the extension we'll use to handle cross origin requests from our frontend server. 

### Database Setup
With Postgres running , and being in the project directory run:
```
 flask db migrate
```

### Running the server

From within the project directory first ensure you are working using your created virtual environment.

To run the server, execute:

```bash
flask run --reload
```

The `--reload` flag will detect file changes and restart the server automatically.





# API DOCUMENTATION
## Getting started
- Base URL: This projected is hosted locally and so uses the base url http://127.0.0.1:5000
- authentication: this app uses jwt generated from auth0 for authentication

## Error handling
expected errors are formatted in JSON like the example shown bellow:
```
{
  "error": 404,
  "message": "resource not found",
  "success": false
}
```

bellow are the expected error cases for the API
- 400 : "Bad request"
- 404 : "Resource not found"
- 500 : "Internal Server Error"
- 422 : "could not process recource"
- 405 : "method not allowed"
## Endpoints
GET  '/all'
GET '/name/<name>'
GET '/currency/<currency>'
POST '/countries'



### GET  '/all'
- fetches all the counries in a list with each coontry as a dictionary
- **Request arguments**: None
- **Sample request**: `curl http://127.0.0.1:5000/all`
- **Sample response**:
```
[
  {
    "cca3": "ngr",
    "common_name": "Nigeria",
    "currency": "naira",
    "id": 1,
    "official_language": "english",
    "population": "56355353535236"
  },
  {
    "cca3": "ghn",
    "common_name": "Ghana",
    "currency": "cedi",
    "id": 2,
    "official_language": "english",
    "population": "53535236"
  }
]
```

### GET  '/name/<name>'
- fetches a country by its common name
- **Request arguments**: common_name: String(required) 
- **Sample request**: `curl http://127.0.0.1:5000/name/Nigeria`
- **Sample response**:
```
{
    "cca3": "ngr",
    "common_name": "Nigeria",
    "currency": "naira",
    "id": 1,
    "official_language": "english",
    "population": "56355353535236"
  }
```

### GET  '/name/<currency>'
- fetches a country by its currency
- **Request arguments**: currency: String(required) 
- **Sample request**: `curl http://127.0.0.1:5000/currency/naira`
- **Sample response**:
```
{
    "cca3": "ngr",
    "common_name": "Nigeria",
    "currency": "naira",
    "id": 1,
    "official_language": "english",
    "population": "56355353535236"
  }
```


### POST '/countries'
- Add new countries in the database , by authorized users
- Authorization required 
- https://enochdreamer.us.auth0.com/authorize?audience=Rest&response_type=token&client_id=6Xe9DrIjpeP0owkAXvaq1MPWnZyPmYiv&redirect_uri=http://127.0.0.1:5000/success to go the auth0 hosted login page
- **Request arguments**: common_name:string(required) , currency:string(required) , cca3: string(required) , population:string(required) , official_language: String (required)
- **Sample request when authorized**: `curl -X POST http://127.0.0.1:5000/countries  -H "Content-Type:application/json "  -d "{\"common_name\":\"Kogi \" , \"population\":\"2009\" , \"currency\":\"money\" , \"cca3\":\"kog\",\"official_language\":\"monk\" , \"cca3\":\"kog\"}"    `
- **Sample response**: 
```

{
  "recently_added": {
    "cca3": "kog",
    "common_name": "Kogi ",
    "currency": "money",
    "id": 8,
    "official_language": "monk",
    "population": "2009"
  },
  "success": true
}

```