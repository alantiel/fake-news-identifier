const validationJoke = function(url){
    const knowedDomains = ['thechive.com', 'cracked.com', 'break.com'];
    const host = url.split('/')[2];
       
    if(knowedDomains.indexOf(host) != -1){
        return { pass:false};
    }       
    return{ pass: true, step: 9};
};

module.exports = {
	validate: validationJoke
}
