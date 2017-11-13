const validationReputation = function(url){

    const whiteList = ['bbc.com', 'cnn.com', 'msn.com', 'theguardian.com'];
    const blackList = [ 'bcc.com', 'cnm.com', 'nsm.com','nationalreport.net'];
    const host = url.split('/')[2];

    if(whiteList.indexOf(host) != -1){
        return {pass:true};
    }
    if(blackList.indexOf(host) != -1){
        return {pass:false};
    }
    return {pass: 'unknown'};
};

module.exports = {
	validate: validationReputation
}

