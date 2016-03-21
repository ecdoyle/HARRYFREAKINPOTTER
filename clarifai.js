var tags = [];
var colors = [];
var colorsrgb = [];
var densities = [];
var sortd = [];


function getCredentials(img) {
    var data = {
        'grant_type': 'client_credentials',
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    };

    return $.ajax({
        'url': 'https://api.clarifai.com/v1/token',
        'data': data,
        'type': 'POST',
        success: function (r) {
            // call post image using the returned token
            postImageColor(img, r.access_token);
        }
    });
}

// Function to make the POST request to the Clarifai API using credentials somehow
// INPUTS: imgurl - the url of the image to be parsed for color
function postImageColor(imgurl, token) {
    var data = {
        'url': imgurl
    };

    // Changed url to use color model instead of regular tag
    return $.ajax({
        'url': 'https://api.clarifai.com/v1/color',
        'headers': {
            'Authorization': 'Bearer ' + token
        },
        'data': data,
        'type': 'POST',
        success: function (r) {
            parseResponseColor(r, imgurl, token);
        }
    });
}

// Obtains colors and densities from Clarifai's API
// INPUT: resp - JSON response from Clarifai's API
function parseResponseColor(resp, imgurl, token) {

    // Stuff to do with colors 
    var r = 0;// = colorsrgb[maxI].r;
    var g = 0;// = colorsrgb[maxI].g;
    var b = 0;// = colorsrgb[maxI].b;
    
    if (resp.status_code === 'OK') {
        var results = resp.results;
        for (i = 0; i < results[0].colors.length; i++) {
            colors[i] = results[0].colors[i].w3c.hex;
            colorsrgb[i] = hexToRgb(colors[i]);
            densities[i] = results[0].colors[i].density;
            
            // Obtain mean value of all of the colors
            r = r + colorsrgb[i].r * densities[i];
            g = g + colorsrgb[i].g * densities[i];
            b = b + colorsrgb[i].b * densities[i];
        }
        
        // Establish mean value of the 3 colors
        var mu = (r + g + b)/3;

        // SORT SOME JAMS
        // sortd array holds the indeces of the colors/densities 
        // in order of decreasing weight
        var absMax = 1;
        var max;
        var maxI;

        // 0 is hufflepuff, 1 is gryffindor, 2 is slytherin, 3 is ravenclaw
        var domcolor = 0;

        max = 0;
        for (j = 0; j < densities.length; j++) {
            if (densities[j] <= absMax && densities[j] > max && colors[i] !== "#FFFFFF") {
                max = densities[j];
                maxI = j;
            }
        }
        sortd[i] = maxI;
        absMax = densities[sortd[i]];


        if (r > g && r > b && r-mu>20)
            domcolor = 1;   // gryffindor
        else if (g > r && g > b && g-mu>5)
            domcolor = 2;   // slytherin
        else if (b > r && b > g)
            domcolor = 4;   // ravenclaw

        Redirect(domcolor);

    } else {
        console.log('Sorry, something is wrong.');
    }

    /*
     // Get the normal tags
     postImageTags(imgurl, token);
     
     // Post stuff to the page
     $('#colors').text(colors.toString().replace(/,/g, ', '));
     $('#dens').text(densities.toString().replace(/,/g, ', '));
     return colors;
     */
}

function postImageTags(imgurl, token) {
    var data = {
        'url': imgurl
    };

    // Changed url to use color model instead of regular tag
    return $.ajax({
        'url': 'https://api.clarifai.com/v1/tag',
        'headers': {
            'Authorization': 'Bearer ' + token
        },
        'data': data,
        'type': 'POST',
        success: function (r) {
            parseResponseTags(r);
        }
    });
}

function parseResponseTags(r) {
    if (r.status_code === 'OK') {
        var results = r.results;
        tags = results[0].result.tag.classes;
    } else {
        console.log('Sorry, something is wrong.');
    }

    $('#tags').text(tags.toString().replace(/,/g, ', '));
    return tags;
}

// Function that takes in an image url and 
function requestSort(imgurl) {
    // Get credentials before obtaining tags
    getCredentials(imgurl);
}

// All of the color logic stuff will probably go here
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function Redirect(house) {

    if (house === 0)
        window.open("houses/h.html", '_self');
    //window.location = "h.html";
    else if (house === 1)
        window.open("houses/g.html", '_self');
    else if (house === 2)
        window.open("houses/s.html", '_self');
    else if (house === 4)
        window.open("houses/r.html", '_self');
}
