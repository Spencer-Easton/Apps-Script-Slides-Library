(function(scope,nameSpace){
	/*
	 * Library Code
	 */
	function setTokenService(a){tokenService_=a}function testTokenService(){return tokenService_()}function CALL_(e,c){var b={method:'',muteHttpExceptions:!0,contentType:'application/json',headers:{Authorization:'Bearer '+tokenService_()}};var d=BASEURL_+e;for(option in c)b[option]=c[option];var a=UrlFetchApp.fetch(d,b);if(a.getResponseCode()!=200)throw new Error(a.getContentText());else return JSON.parse(a.getContentText())}function CALLPAGE_(h,g,i){var d={method:'',muteHttpExceptions:!0,contentType:'application/json',headers:{Authorization:'Bearer '+tokenService_()}};for(option in g)d[option]=g[option];var e=BASEURL_+h;var a=[];var b;do{b&&(e+='?pageToken='+b);var c=UrlFetchApp.fetch(e,d);if(c.getResponseCode()!=200)throw new Error(c.getContentText());var f=JSON.parse(c.getContentText());b=f.nextPageToken,a=a.concat(f[i])}while(b);return a}function buildUrl_(b,a){var a=a||{};var c=Object.keys(a).map(function(b){return encodeURIComponent(b)+'='+encodeURIComponent(a[b])}).join('&');return b+(b.indexOf('?')>=0?'&':'?')+c}function presentationsGet(d,e){var a=buildUrl_('v1/presentations/'+d,e);var b={method:'GET'};var c=CALL_(a,b);return c}function presentationsCreate(a,d){var b=buildUrl_('v1/presentations',d);var c={method:'POST',payload:JSON.stringify(a)};var a=CALL_(b,c);return a}function presentationsBatchUpdate(d,e,f){var a=buildUrl_('v1/presentations/'+d+':batchUpdate',f);var b={method:'POST',payload:JSON.stringify(e)};var c=CALL_(a,b);return c}function presentationsPagesGet(d,e,f){var a=buildUrl_('v1/presentations/'+d+'/pages/'+e,f);var b={method:'GET'};var c=CALL_(a,b);return c}var BASEURL_='https://slides.googleapis.com/';var tokenService_
	/*
	 * End Library Code
	 */
var publicAPI = { 
    setTokenService:setTokenService,testTokenService:testTokenService,presentationsGet:presentationsGet,presentationsCreate:presentationsCreate,presentationsBatchUpdate:presentationsBatchUpdate,presentationsPagesGet:presentationsPagesGet
                };
scope[nameSpace] = scope[nameSpace] || publicAPI;
})(this, "Slides");

