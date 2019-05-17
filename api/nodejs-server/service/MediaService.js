'use strict';


/**
 * Delete a right holder's profile with the given ID
 *
 * mediaId Integer The rights holder's unique profile ID
 * no response value expected for this operation
 **/
exports.deleteMedia = function(mediaId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Get a list of all media
 *
 * returns medias
 **/
exports.getAllMedia = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Get media with the given ID
 *
 * mediaId Integer The artwork agreement's unique ID
 * returns media
 **/
exports.getMedia = function(mediaId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "split" : {
    "key" : 0.80082819046101150206595775671303272247314453125
  },
  "jurisdiction" : "SOCAN",
  "genre" : "Rock",
  "description" : "The wonderful classic hit song, Love You Baby",
  "creation-date" : "2019-01-01T15:53:00",
  "publisher" : "sync publishing",
  "rights-type" : {
    "key" : "rights-type"
  },
  "mediaId" : 4,
  "title" : "Love You Baby",
  "right-holders" : {
    "key" : "right-holders"
  }
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Get creation date of the media with the given ID
 *
 * mediaId Integer The artwork agreement's unique ID
 * returns Object
 **/
exports.getMediaCreationDate = function(mediaId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Get the description of a piece of media
 *
 * mediaId Integer The artwork agreement's unique ID
 * returns Object
 **/
exports.getMediaDescription = function(mediaId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Get the genre of the media with the given ID
 *
 * mediaId Integer The artwork agreement's unique ID
 * returns Object
 **/
exports.getMediaGenre = function(mediaId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Get the jurisdiction of the given media
 *
 * mediaId Integer The artwork agreement's unique ID
 * returns Object
 **/
exports.getMediaJurisdiction = function(mediaId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Get publisher name of the media with the given ID
 *
 * mediaId Integer The artwork agreement's unique ID
 * returns Object
 **/
exports.getMediaPublisher = function(mediaId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Get the right holders who collaborated on media
 *
 * mediaId Integer The artwork agreement's unique ID
 * returns Object
 **/
exports.getMediaRightHolders = function(mediaId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Get the type of rights of the given media         (Including copyright, performance, recording)
 *
 * mediaId Integer The artwork agreement's unique ID
 * returns Object
 **/
exports.getMediaRightsType = function(mediaId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Get rights holders' percentage split given media
 *
 * mediaId Integer The artwork agreement's unique ID
 * returns Object
 **/
exports.getMediaSplit = function(mediaId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Get the title of the given media identified by ID
 *
 * mediaId Integer The artwork agreement's unique ID
 * returns Object
 **/
exports.getMediaTitle = function(mediaId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * This method creates a new media item
 *
 * body Media request
 * returns media
 **/
exports.postMedia = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "split" : {
    "key" : 0.80082819046101150206595775671303272247314453125
  },
  "jurisdiction" : "SOCAN",
  "genre" : "Rock",
  "description" : "The wonderful classic hit song, Love You Baby",
  "creation-date" : "2019-01-01T15:53:00",
  "publisher" : "sync publishing",
  "rights-type" : {
    "key" : "rights-type"
  },
  "mediaId" : 4,
  "title" : "Love You Baby",
  "right-holders" : {
    "key" : "right-holders"
  }
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Update the description of a piece of media
 *
 * mediaId Integer The artwork agreement's unique ID
 * description Description The description of the artwork
 * returns Object
 **/
exports.putMediaDescription = function(mediaId,description) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Update the genre of the media with the given ID
 *
 * mediaId Integer The artwork agreement's unique ID
 * genre Genre The genre of the artwork
 * returns Object
 **/
exports.putMediaGenre = function(mediaId,genre) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Update the jurisdiction of the given media
 *
 * mediaId Integer The artwork agreement's unique ID
 * jurisdiction Jurisdiction The jurisdiction of the given media
 * returns Object
 **/
exports.putMediaJurisdiction = function(mediaId,jurisdiction) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Update publisher of the media with the given ID
 *
 * mediaId Integer The artwork agreement's unique ID
 * publisher Publisher The publisher of the media
 * returns Object
 **/
exports.putMediaPublisher = function(mediaId,publisher) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Update right holders who collaborated on media
 *
 * mediaId Integer The artwork agreement's unique ID
 * rightHolders Right-holders The list of right holders
 * returns Object
 **/
exports.putMediaRightHolders = function(mediaId,rightHolders) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Update the type of rights of the given media      (Including copyright, performance, recording)
 *
 * mediaId Integer The artwork agreement's unique ID
 * rightsType Rights-type The type of rights of the given media
 * returns Object
 **/
exports.putMediaRightsType = function(mediaId,rightsType) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Update rights holders' percentage split on media
 *
 * mediaId Integer The artwork agreement's unique ID
 * split Split The percentage split for the right holders of the media
 * returns Object
 **/
exports.putMediaSplit = function(mediaId,split) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Update the title of the given media identified by ID
 *
 * mediaId Integer The artwork agreement's unique ID
 * title Title The title of the artwork
 * returns Object
 **/
exports.putMediaTitle = function(mediaId,title) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

