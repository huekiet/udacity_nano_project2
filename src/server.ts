import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // EXERCISE
   /**************************************************************************** */
  // IMPLEMENTING A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}} - 
  // URL can has double quote at start and end (e.g: "https://www.google.com") or without (e.g: https://www.google.com)

  app.get( "/filteredimage", async (req, res) => {
    let imageUrl = req.query.image_url;
    console.warn('imageUrl', imageUrl);
    
    //-------------- 1. validate the image_url query ------------------
    if (!imageUrl) {
      return res.status(400).send('You need to send "image_url" query parameter!!');
    }
    
    // Remote start quote if exists
    const firstIndex = 0;
    if (imageUrl.charAt(firstIndex) === '\'' || imageUrl.charAt(firstIndex) === '\"')
      imageUrl = imageUrl.substring(1, imageUrl.length);

    // Remote end quote if exists
    const lastIndex = imageUrl.length - 1;
    if (imageUrl.charAt(lastIndex) === '\'' || imageUrl.charAt(lastIndex) === '\"')
      imageUrl = imageUrl.substring(0, lastIndex);

    // Check if is a valid URL
    let url;
    try {
      url = new URL(imageUrl);
    } catch(error) {
      return res.status(400).send("You need to send a valid URL!!!");
    }

    //-------------- 2. call filterImageFromURL(image_url) to filter the image ------------------
    let filteredImageURL: any;
    try {
      filteredImageURL = await filterImageFromURL(String(url));
    } catch (error) {      
      console.error('error:', error);
      
      return res.status(400).send("An error occured when the server filtered the image");
    }
    
    //--------------  3. send the resulting file in the response ------------------
    res.sendFile(filteredImageURL, () => {
      //-------------- 4. deletes any files on the server on finish of the response ------------------
      deleteLocalFiles([filteredImageURL])
    });
    return;
  })

  /**************************************************************************** */



  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();