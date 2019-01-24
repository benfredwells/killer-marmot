# killer-marmot

This is a demo of the [Web App Manifest](https://w3c.github.io/manifest) spec.

[Live Demo](https://killer-marmot.appspot.com).

## Deploying the app

If you are an owner of the `killer-marmot` project on App Engine, you can deploy updates to this app. Otherwise, ask one of the project owners to do so after merging a PR. Ideally, only deploy changes that have been merged to `master`, so the live version matches this repository.

See the [App Engine documentation](https://cloud.google.com/appengine/docs/flexible/python/testing-and-deploying-your-app) for details.

In summary:

1. Download and install the [Google Cloud SDK](https://cloud.google.com/sdk/docs/).
2. From the top-level project directory, run `gcloud app deploy`.

The first time you do this, you will be asked to authenticate with your Google account credentials.

If you want to deploy a clone of Killer Marmot to a different App Engine instance, either edit `app.yaml` or use the [`--project`](https://cloud.google.com/sdk/gcloud/reference/#--project) flag with `gcloud app deploy`.
