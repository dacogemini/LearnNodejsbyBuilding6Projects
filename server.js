//
//* ─── DEPENDENCIES ───────────────────────────────────────────────────────────────
//
const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
//
//* ───────────────────────────────────────────────────────── END DEPENDENCIES ─────

//* ─── REQUIRE MIME TYPES ─────────────────────────────────────────────────────────
    
const mimeTypes = {
  "html": "text/html",
  "jpeg": "image/jpeg",
  "jpg": "image/jpg",
  "png": "image/png",
  "js": "text/javascript",
  "css": "text/css"
};
//* ─────────────────────────────────────────────────── END REQUIRE MIME TYPES ─────
    
http.createServer(function(req, res) {
  var uri = url.parse(req.url).pathname;
  var fileName = path.join(process.cwd(), unescape(uri)); //<< unescape = url decoder / cwd = current working directory
  console.log('Loading...'+uri);
  console.log(fileName);
  var stats;

// =============================================================================
//* A fs.Stats object provides information about a file.
//* Objects returned from fs.stat(), fs.lstat() and fs.fstat() and their synchronous counterparts are of this type.
// =============================================================================
 
  try{
      stats = fs.lstatSync(fileName);
  } catch(e) {
  	res.writeHead(404, {'Content-type': 'text/plain'});
  	res.write('404 Not Found\n');
  	res.end();
  	return;
  }
  if(stats.isFile()) {
    // We will split it at the dot (.) because we're getting the extension of the file. 
  	var mimeType = mimeTypes[path.extname(fileName).split(".").reverse()[0]];
      res.writeHead(200, {'Content-type': mimeType});
    
  //  console.log(mimeType);
 
  	var fileStream = fs.createReadStream(fileName);
  	fileStream.pipe(res);
  } else if(stats.isDirectory()) {
  	res.writeHead(302, {
  		'Location': 'index.html'
  	});
  	res.end();
  } else {
  	res.writeHead(500, {'Content-type':'text/plain'});
  	res.write('500 Internal Error\n');
  	res.end();
  }
}).listen(3000);