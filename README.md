# r-hex-actions-orchestrator

> A GitHub App built with [Probot](https://github.com/probot/probot) that Orchestrate GitHub Reusable Workflows

## Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

## Docker

```sh
# 1. Build container
docker build -t r-hex-actions-orchestrator .

# 2. Start container
docker run -e APP_ID=<app-id> -e PRIVATE_KEY=<pem-value> r-hex-actions-orchestrator
```

## Contributing

If you have suggestions for how r-hex-actions-orchestrator could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2022 r-hex <preacherlemon@outlook.com>
