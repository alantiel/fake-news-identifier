const validationReputation = function(url){

    const whiteList = ['bbc.com', 'cnn.com', 'msn.com', 'theguardian.com'];
    const blackList = [ 'bcc.com', 'cnm.com', 'nsm.com','nationalreport.net'];
    const host = url.split('/')[2];

    const variables = {whiteList: whiteList, blackList: blackList, host: host}

    if(whiteList.indexOf(host) != -1){
        return {pass:true, variables: variables};
    }
    if(blackList.indexOf(host) != -1){
        return {pass:false, variables: variables};
    }
    return {pass: 'unknown'};

};

module.exports = {
	validate: validationReputation
}

