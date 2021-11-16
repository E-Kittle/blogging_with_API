# Blogging_with_API : The Blog

The Blog is a responsive site that allows users to create and manage blog posts and add comments to these posts as either a guest, an admin/blogging user, or general/commenting user. Additionally, this program allows authors to assign blog posts to specific categories, allowing users to filter blog posts to their desired topic.

This is the API for the_blog

## Demo
A live demo is available at: [The Blog](http://blog.elisabethoconnor.com)
![Screenshot of Demo](/public/images/blog.png)

## Features
- Creation of blog posts that can be organized by category. Users can also comment on these blog posts
- 3 user account types: Guest, commenting only, and admin
- Guests can view posts and make comments as a guest
- Commenting only accounts can view blog posts and create/edit/delete comments. They can upgrade their account to admin
- Admins can do everything a commenting account can, in addition to creating/editing/deleting blog posts

## How to Use
To clone and run this application, you'll need Git and Node.js (which comes with npm) installed on your computer. From your command line:

```
#clone this repository
$ git clone https://github.com/E-Monstera/blogging_with_API.git

#Go into the respository
$ cd blogging_with_API

#Install dependencies
$ npm install

#run the app
$ npm run
```

## Configuration
In order to properly run this application, you will your own environmental variables.
The required variables are as follows:
 - DB_URL: For your database
 - SECRET: For your JWT key