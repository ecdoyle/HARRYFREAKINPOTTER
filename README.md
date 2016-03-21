HARRYFREAKINPOTTER
=========

# What is it?
This project provides a muggle implementation of the Hogwarts sorting hat. 

# How do I use it?
1. Sign up for a developer account at http://clarifai.com/
2. Create an application in order to obtain a client ID and secret. 
3. Clone this repo and copy and paste your ID and secret into a keys.js file in your project as
```
var CLIENT_ID = "your_client_id";
var CLIENT_SECRET = "your_client_secret";
```
4. Open the test.html using your favorite browser. Copy and paste the link to a picture of yourself (or any person you want to sort) in the ImageURL input box at the bottom of the page. Make sure it's a valid image link (ends in .jpg, .jpeg, .png...)

# How does it work?
This sends your picture to the Clarifai API which returns the colors in the image. We use some complicated math jams to determine which house the color scheme in your picture places you in, then let you know what the sorting hat things!

