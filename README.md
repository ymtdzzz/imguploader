# imguploader

[https://imguploader.zeroclock.dev/](https://imguploader.zeroclock.dev/)

An example implementation of Image Uploader (from devchallenges: [Image Uploader](https://devchallenges.io/challenges/O2iGT9yBd6xZBrOcVirx)).

**Notice that you SHOULD NOT upload private images!**

## Limitaions

This project is for demo, so there are some limitaions:

| request             | limitation         |
| ------------------- | ------------------ |
| upload rate         | 500 images per day |
| image size          | up to 1.0MB        |
| image expiration    | 1 day              |

## Run locally

### Prerequisites

Make sure you have installed all of the following prerequisites on your development machie:

- Git
- Node.js
- Python3 - needed for aws cli.
- AWS CLI 2 - follow [this instruction](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html).
- Docker
- Rust
- lcov

Clone this repository to your machine and cd. 

```
git clone https://github.com/zeroclock/imguploader.git
cd imguploader
```

Add `s3local` profile to your `~/.aws/credentials`. It's used by `serverless-s3-local`.

```
[s3local]
aws_access_key_id=S3RVER
aws_secret_access_key=S3RVER
```

Install `serverless` command globally.

```
npm i -g serverless
sls --version
```

Install `grcov`

```
cargo install grcov
```

### Api

```
cd api
npm i
AWS_PROFILE=s3local sls offline start --stage local
# test
cargo test
# test (coverage)
yarn coverage # report file will be created to report/index.html
```

### Front

```
cd front
yarn
yarn start
# test
yarn test
# test (coverage)
yarn test --coverage --watchAll=false # report file will be created to coverage/lcov-report/index.html
```

## Contributing
Any contribution is appreciated!

## License
Distributed under the MIT License. See `LICENSE` for more information.

