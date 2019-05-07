# <img height='65' src="https://github.com/hugomiguelabreu/tourg-mobile-guide/blob/master/assets/images/tour-white.png"/>
### tourg guide application - Your instant guide
tourg is a mobile application with the pretension of offering a seamless tourist experience to the end-user.

To start the server run: 
```
npm run start:dev
```

# Install

Create postgres user and database
```
username: app
password: secret
databse: tourg_dev
```
Install packages with 
```
npm install
```

Install sequelize-cli:
```
npm install --save sequelize-cli
```
Run sequelize:
```
node_modules/.bin/sequelize [commnad]
```
Run migrations
```
node_modules/.bin/sequelize db:migrate
```

Useful documentation:

[sequelize docs](http://docs.sequelizejs.com/manual/installation/getting-started.html)
