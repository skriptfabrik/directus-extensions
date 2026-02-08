# Directus Request with Auth Bundle

This bundle adds a new interface for selecting and managing app secrets and an operation for making authenticated
requests.

## Extensions

### 1. App Secret Hook

Automatically manages the `app_secrets` collection. It ensures the collection exists and handles encryption for
sensitive fields when they are created or updated.

### 2. Request with Auth Operation

A flow operation that allows you to make HTTP requests using credentials stored in the `app_secrets` collection. It
supports standard HTTP methods (GET, POST, PATCH, DELETE), custom headers, and a request body. It also includes built-in
retry logic.

### 3. Secret Selector Interface

An interface designed to select and manage credentials directly from the `app_secrets` collection.

### 4. Secret Input Interface

An interface used to securely input and handle secrets within Directus.

## Requirements

- Directus 11.0.0+

## Installation

Refer to the [Official Guide](https://docs.directus.io/extensions/installing-extensions.html) for details on installing
the extension from the Marketplace or manually.

## Usage

### Making Authenticated Requests

1. Create a new Flow and add the **Request with Auth** operation.
2. Choose a **Credential** from the dropdown (this pulls from your `app_secrets`).
3. Set the **URL**, **Method**, and any required **Headers** or **Body**.
4. (Optional) Configure **Retry on Fail** settings if you want the operation to retry upon a failed request.

### Managing Secrets

1. Upon installation, the `app_secrets` collection is automatically created, but hidden from the UI.
2. You can add new secrets via the **Request with Auth** operation in a Flow or manually.
