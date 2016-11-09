/**
* Google Apps Script Library for the slides API
* 
* Documentation can be found: 
* https://developers.google.com/slides/
* 
* OAuth2 Scopes
* https://www.googleapis.com/auth/drive
* https://www.googleapis.com/auth/spreadsheets.readonly
* https://www.googleapis.com/auth/presentations
* https://www.googleapis.com/auth/presentations.readonly
* https://www.googleapis.com/auth/drive.readonly
* https://www.googleapis.com/auth/spreadsheets
*/

var BASEURL_="https://slides.googleapis.com/";
var tokenService_;

/*
* Stores the function passed that is invoked to get a OAuth2 token;
* @param {function} service The function used to get the OAuth2 token;
*
*/
function setTokenService(service){
  tokenService_ = service;
}

/*
* Returns an OAuth2 token from your TokenService as a test
* @return {string} An OAuth2 token
*
*/
function testTokenService(){
 return tokenService_();
}

/**
 * Performs a Fetch
 * @param {string} url The endpoint for the URL with parameters
 * @param {Object.<string, string>} options Options to override default fetch options
 * @returns {Object.<string,string>} the fetch results
 * @private
 */
function CALL_(path,options){
  var fetchOptions = {method:"",muteHttpExceptions:true, contentType:"application/json", headers:{Authorization:"Bearer "+tokenService_()}}
  var url = BASEURL_ + path;
  
  for(option in options){
    fetchOptions[option] = options[option];
  }
  
  var response = UrlFetchApp.fetch(url, fetchOptions)
  if(response.getResponseCode() != 200){
    throw new Error(response.getContentText())
  }else{
    return JSON.parse(response.getContentText());
  }
}

/**
 * Performs a Fetch and accumulation using pageToken parameter of the returned results
 * @param {string} url The endpoint for the URL with parameters
 * @param {Object.<string, string>} options Options to override default fetch options
 * @param {string} returnParamPath The path of the parameter to be accumulated
 * @returns {Array.Object.<string,string>} An array of objects
 * @private
 */
function CALLPAGE_(path,options, returnParamPath){
  var fetchOptions = {method:"",muteHttpExceptions:true, contentType:"application/json", headers:{Authorization:"Bearer "+tokenService_()}}
  for(option in options){
    fetchOptions[option] = options[option];
  }
  var url = BASEURL_ + path;
  var returnArray = [];
  var nextPageToken;
  do{
    if(nextPageToken){
      url += "?pageToken=" + nextPageToken;
    }
    var results = UrlFetchApp.fetch(url, fetchOptions);
    if(results.getResponseCode() != 200){
      throw new Error(results.getContentText());
    }else{
      var resp = JSON.parse(results.getContentText())
      nextPageToken = resp.nextPageToken;
      returnArray  = returnArray.concat(resp[returnParamPath])
    }
  }while(nextPageToken);
  return returnArray;
}

/**
 * Builds a complete URL from a base URL and a map of URL parameters. Written by Eric Koleda in the OAuth2 library
 * @param {string} url The base URL.
 * @param {Object.<string, string>} params The URL parameters and values.
 * @returns {string} The complete URL.
 * @private
 */
function buildUrl_(url, params) {
  var params = params || {}; //allow for NULL options
  var paramString = Object.keys(params).map(function(key) {
    return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
  }).join('&');
  return url + (url.indexOf('?') >= 0 ? '&' : '?') + paramString;
}

/**
* Gets the latest version of the specified presentation.
*
* @param {string} presentationId The ID of the presentation to retrieve.
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned PresentationResource object
*/
function presentationsGet(presentationId,options){
  var path = buildUrl_("v1/presentations/"+presentationId,options);
  var callOptions = {method:"GET"};
  var PresentationResource = CALL_(path,callOptions);
  return PresentationResource;
}

/**
* Creates a new presentation using the title given in the request. Other
fields in the request are ignored.
Returns the created presentation.
*
* @param {object} PresentationResource An object containing the PresentationResource for this method
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned PresentationResource object
*/
function presentationsCreate(PresentationResource,options){
  var path = buildUrl_("v1/presentations",options);
  var callOptions = {method:"POST",payload:JSON.stringify(PresentationResource)};
  var PresentationResource = CALL_(path,callOptions);
  return PresentationResource;
}

/**
* Applies one or more updates to the presentation.

Each request is validated before
being applied. If any request is not valid then the entire request will
fail and nothing will be applied.

Some requests have replies to
give you some information about how they are applied. Other requests do
not need to return information; these each return an empty reply.
The order of replies matches that of the requests.

For example, suppose you call batchUpdate with four updates, and only the
third one returns information. The response would have two empty replies,
the reply to the third request, and another empty reply, in that order.

Because other users may be editing the presentation, it is not guaranteed
that the presentation will exactly reflect your changes: your changes may
be altered with respect to collaborator changes. If there are no
collaborators, the presentation should reflect your changes. In any case,
it is guaranteed that the updates in your request will be applied together
atomically.
*
* @param {string} presentationId The presentation to apply the updates to.
* @param {object} BatchUpdatePresentationRequestResource An object containing the BatchUpdatePresentationRequestResource for this method
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned BatchUpdatePresentationResponseResource object
*/
function presentationsBatchUpdate(presentationId,BatchUpdatePresentationRequestResource,options){
  var path = buildUrl_("v1/presentations/"+presentationId+":batchUpdate",options);
  var callOptions = {method:"POST",payload:JSON.stringify(BatchUpdatePresentationRequestResource)};
  var BatchUpdatePresentationResponseResource = CALL_(path,callOptions);
  return BatchUpdatePresentationResponseResource;
}

/**
* Gets the latest version of the specified page in the presentation.
*
* @param {string} presentationId The ID of the presentation to retrieve.
* @param {string} pageObjectId The object ID of the page to retrieve.
* @param {object} options Keypair of all optional parameters for this call
* @return {object} The returned PageResource object
*/
function presentationsPagesGet(presentationId,pageObjectId,options){
  var path = buildUrl_("v1/presentations/"+presentationId+"/pages/"+pageObjectId,options);
  var callOptions = {method:"GET"};
  var PageResource = CALL_(path,callOptions);
  return PageResource;
}