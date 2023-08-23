# Alloy Demo Encryption System

This is a demo application to demonstrate an API that saves plaintext PII data, and its conversion to store and utilize encrypted and hashed data. While this app exposes a frontend application, feel free to use this [Postman collection](https://www.postman.com/telecoms-geologist-30657333/workspace/data-encryption-system/request/28416953-c93ebce3-7aee-47b1-be86-5aa7a4616892). The colletion is available to import as well [here](./.repo/postman-collection.json).

## Dependencies

- [Docker](https://docs.docker.com/engine/install)
- [MongoDB Compass](https://www.mongodb.com/try/download/compass)
- API Testing Tool ([Postman](https://www.postman.com/))

## Resources

- MongoDB: NoSQL datastore
- Node.js@18
- Localstack: Fully functional AWS cloud stack
- [AWS Secrets Manager](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/secrets-manager/) (through Localstack)
- [AWS KMS (Key Management Service)](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/kms/) (through Localstack)


## Connecting to Mongo with MongoDB Compass

1. Install the MongoDB Compass GUI tool
2. Create a new connection <br>
  a. Update the port to `27010` <br>
  b. Click on the dropdown for `Advanced Connection Options` and click the `Authentication` tab <br>
  c. Select `Username/Password` for the Authentication Method and input the credentials found in the [docker-compose.yml](https://github.com/UseAlloy/fintech-devcon-demo/blob/main/docker-compose.yml#L8-L9) <br>
  d. Click `Save & Connect`. Data will be found in the `test` database <br>

## Bootstrapping Users

There a script provided to generate random user data and save it into the database.

```shell
$ docker compose exec api npm run bootstrap-users-collection
```


## Objectives

PII Encryption raises the standard for security by protecting customer PII on all levels (application logs, APIs, databases, and public views). Today's workshop will leverage a simple application that has the ability to create, view, and search on different entities that contain PII. You will have the opportunity to encrypt this application using AWS Key Management System (KMS). This workshop is broken into four exercises that you will tackle one by one. At the end of the workshop, the goal is to have a secure application that uses encryption to create, view, and search entities, and decrypt encrypted application logs.


## Breakdown of Exercises

### 1. Encryption Key Setup

Enable communications with AWS KMS to generate & decrypt data keys and store encrypted data keys in the database.

- Create an [AWS KMS client](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/kms) that can [generate new data keys](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/kms/command/GenerateDataKeyCommand) and [decrypt encrypted data keys](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/kms/command/DecryptCommand)
- Create a database collection to store encrypted data keys
- Generate 2 data keys (pii encryption key and pii hash key) with KMS and store the encrypted data keys in the database

Validation: Once you've generated and stored the encrypted data keys you can open MongoDB Compass to view your collection that's storing the data.

### 2. Encryption API Usage

Create an encryption library and use encryption keys to encrypt, decrypt, and hash data coming to and from the database.

- Update user's collection to store encrypted and hashed data
- Update user collection's queries (repository) to insert encrypted and hashed data as well as returning encrypted data
- Setup encryption library that will handle encrypting, decrypting, and hashing data
- Update controllers to use encryption keys to encrypt and hash data before storing, and also decrypt data before returning to client

### 3. PII Search

Replace fuzzy search with searching on hashed PII columns.

- Hash incoming request search data and search on hashed PII columns

### 4. Encrypt Application Logs

Encrypt app logs and expose a route to decrypt them.

- Generate and store a new data key to encrypt application logs
- Encrypt request and response data when logging
- Expose a new route to decrypt application logs using new encryption key


## Bootstrapping the Application  + Envrionment

### AWS KMS and Secrets Manager Setup

The [AWS KMS key hierarchy](https://docs.aws.amazon.com/kms/latest/cryptographic-details/key-hierarchy.html) starts with a top-level domain KMS key. The domain key is then used to create data keys under its namespace. This application will use this key ID (referred to as `API_KMS_KEY_ID` in [api/src/config.ts](https://github.com/UseAlloy/fintech-devcon-demo/blob/main/api/src/config.ts#L13)) when generating and decrypting data keys from KMS. It is also stored inside of a secret within AWS Secrets Manager for the app to load during runtime.

The app's config loader is able to get secrets from Secrets Manager and pull the relevant data as defined in the config interface. This is how the application is able to identify `API_KMS_KEY_ID` if identified.

The script to bootstrap the AWS environment can be found at [.repo/scripts/init-aws-resources.sh](https://github.com/UseAlloy/fintech-devcon-demo/blob/encrypt-logs/.repo/scripts/init-aws-resources.sh).

### Configuration Loader

The config loader has an order of heirarchy when retrieiving and setting the runtime configuration. It first checks to see if a config val/key is set in the envrionment (`process.env`). Secrets Manager is then checked next (if enabled). There is a default config key/val if not found in the environment or Secrets Manager.

![Config Loader Flow](https://www.websequencediagrams.com/cgi-bin/cdraw?lz=dGl0bGUgQ29uZmlndXJhdGlvbiBMb2FkZXIKCnBhcnRpY2lwYW50ABsHABQHIGFzIGMALgUAFw1FbnZpcm9ubWVudCBhcyBlbnYANg1TZWNyZXRzIE1hbmFnAD8Gc20AWA1EZWZhdWwAZAlhcyBkAAwGCgpub3RlIG92ZXIAcgcsABMHOiBnZXQAgQYHAIE4CHZhbHVlCgCBGwYtPitlbnYAGgwAGQYgZnJvbSBwcm9jZXNzLmVudgplbnYtPi0AgVEGOgAeDm5vdCBmb3VuZABLCnNtADwYcwCBYgUKc20AIysAgToTAIEbDACBfwcAgmwIAIIOBwCBIwtyZXR1cm4AgiYJAIFdDQo&s=default)


## Starting Application

This application uses Localstack to simulate the AWS environment. The [boostrapping process](https://github.com/UseAlloy/fintech-devcon-demo/blob/main/.repo/scripts/init-aws-resources.sh) involves creating an AWS KMS key and storing the key ID inside of a secret in AWS Secrets Manager. The config-loader is able to grab this information and store it inside of the application's configuration.

```shell
# start localstack and mongo
$ docker compose up -d localstack mongo
[+] Running 2/2
 ✔ Container localstack Started
 ✔ Container mongo      Running
# start api and frontend
$ docker compose up -d api frontend
[+] Running 4/4
 ✔ Container mongo                         Running
 ✔ Container localstack                    Running
 ✔ Container fintech-devcon-demo-api       Started
 ✔ Container fintech-devcon-demo-frontend  Started
# navigate to http://localhost:3000 to view app
```

## Debugging and Application Logs

Bunyan is used as the API's logger. There are benefits to installing this module as a global dependency to prettify app logs.

```shell
# using docker compose
$ docker compose logs -f api | bunayn
# using docker - must use container full name
$ docker logs -f fintech-devcon-demo-api | bunyan
```
