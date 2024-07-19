
# BookShop Server

## Table of Contents

* [Technicals](#technicals)
* [Featuress](#features)
* [Installation](#installation)
* [Running the App](#running-the-app)
* [Migration](#migration)
* [Test](#test)
* [Author](#author)
* [Acknowledgements](#acknowledgements)

## Technicals

- [X] [Husky](https://typicode.github.io/husky/)
    - [X] [Prettier](https://prettier.io/)
    - [X] [Eslint](https://eslint.org/)
    - [X] [Conventional Commit](https://www.conventionalcommits.org/en/v1.0.0/)
- [X] [Swagger](https://swagger.io/)
- [X] [TypeORM](https://typeorm.io/)
- [X] [Jest](https://jestjs.io/)
- [X] Admin and Client Roles
- [X] JWT Authentication


## Features

- [X] Manage Books
- [X] Manage Categories
- [X] Manage Promotions
- [X] Manage Accounts
- [X] Process Orders
- [X] Import CSV
- [X] Vendors
- [X] Report
- [X] About Page

## Installation

Install package with yarn

```bash
$ yarn install
```
    
## Running the App


```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Migration

To migration database, run the following commands

```bash
# create
$ yarn run migration:create

# generate script after update entity
$ yarn run migration:genrate

# run migration 
$ yarn run migration:run

# revert migration
$ yarn run migration:revert
```

## Test

To run tests, run the following command

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Author

- [@Erel0251](https://www.github.com/Erel0251)

## Acknowledgements

 - [Rookie to Engineer Program](https://careers.nashtechglobal.com/fresher-program/)
 - [README.so](https://readme.so/)
 - [Font Awesome](https://fontawesome.com/)
