//list of URLS to load
const imageURLS = [

];

//FUNCTION TO CALL IN PROMISE.ALL @ URLS.MAP
const loadImage = (src) => //promise for each individual image from imageURLs
    new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
});


Promise.all(imageUrls.map(loadImage)).then(images => { //once all images are loaded, add them to the available sources array
    images.forEach(function(img){
        //what to do for each image
    });
    //what to do after images are loaded
});