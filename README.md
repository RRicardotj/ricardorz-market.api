# ricardorz-market.api

This project was builded like a challenge for apply in Turing enterprise like full stack developer
While I develop this project I was in Venezuela and currently services like electricity and internet conextion were failed, thats because this project it's not totaly ended yet.

## Get started
Clone the project in a local folder
Install dependencies with `npm` or `yarn` running `npm install` or `yarn` in your terminal.
Next create a .env in the root of project folder and copy the content of .env.example in .env file and write your custom configuration parameters

Next, after database parameters at .env are configured, you must initialize the database population runnign this command: `npm run init-db` or `yarn init-db` and now you are already done.

Remember parameters you set in .env (like server port or server domain) because you will need it in ricardorz-market.client project (in .env file)

## IMPORTANT BEFORE CONTINUE

In this project I use mailgun SDK to send mails to customer. For that reason you need have an account in mailgun. See `Prerequisites` for more details

### `npm start` or `yarn start`
Run `start` to start the API

### All scripts command
Initialize database: `init-db`
Delete all tables: `drop-db`
refresh all tables: `refresh-db`

### Prerequisites

You must have installed nodejs, npm (or yarn) in your server.
You must have an account domain with mailgun. In the `.env` file you created (See `Get started section`) you must set `MAILGUN_SENDER` (The name service for you mailer, example `no-replay`), `MAILGUN_KEY` (The API provided by mailgun) and `MAILGUN_DOMAIN` (Also provided by mailgun, you can use the sandbox domain or another if you have one).

Example:

Mailgun sandbox domain looks like `<postmaster@sandboxXXXXXXXXXXXXXXXX.mailgun.org>`
In the `.env` file `MAILGUN_SENDER=postmaster` and `MAILGUN_DOMAIN=sandboxXXXXXXXXXXXXXXXX.mailgun.org`

## Author

* **Ricardo Rodríguez*  - [RRicardotj](https://github.com/RRicardotj)
