If you don't have docker or npm installed already, please do so.

If you don't have the postgres image in your docker, run the following command:
- docker pull postgres

To start the app run:
- docker-compose up

Demo Video: https://drive.google.com/file/d/1e3dq_g4Ijs90W_9E0RFHQpDs4OC3D3hA/view?usp=sharing

- I chose to use PostgreSQL since it has strict data types as opposed to a NoSQL database such as MongoDB, and it also has the capability to store JSON fields allowing it to be dynamic unlike plain SQL
- For the backend, I used Django and the Django Rest Framework to handle API calls
- For the frontend, I utilized React.js