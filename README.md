memozer
=========

Web code for [Memozer](http://www.memozer.com/) - meet. connect. meet again!

## Configuration

memozer assumes that a few environment variables are defined, a list of whom are specified below. if running locally you can places these in a text file called "/env"

```sh
  TWITTER_CONSUMER_KEY=GET_FROM_TWITTER
  TWITTER_CONSUMER_SECRET=GET_FROM_TWITTER
  TWITTER_ACCESS_TOKEN=GET_FROM_TWITTER
  TWITTER_ACCESS_TOKEN_SECRET=GET_FROM_TWITTER
```

## Running Locally

Asumming you have [Node.js](http://nodejs.org/), [Bower](http://bower.io/, ) and [Heroku Toolbelt](https://toolbelt.heroku.com/) installed on your machine:

```sh
  $ npm install
  $ bower install
  $ foreman start
```

Your app should now be running on [localhost:5000](http://127.0.0.1:5000/).
