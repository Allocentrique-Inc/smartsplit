'use strict';

var utils = require('../utils/writer.js');
var Media = require('../service/MediaService');
var app = require('../index.js');

module.exports.deleteMedia = function deleteMedia (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  Media.deleteMedia(mediaId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getAllMedia = function getAllMedia (req, res, next) {
  Media.getAllMedia()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getMedia = function getMedia (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  Media.getMedia(mediaId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchMediaGenre = function patchMediaGenre (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  var genre = req.swagger.params['genre'].value;
  Media.patchMediaGenre(mediaId,genre)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchMediaISRC = function patchMediaISRC (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  var isrc = req.swagger.params['isrc'].value;
  Media.patchMediaISRC(mediaId,isrc)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchMediaUPC = function patchMediaUPC (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  var upc = req.swagger.params['upc'].value;
  Media.patchMediaUPC(mediaId,upc)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchMediaSecondaryGenre = function patchMediaSecondaryGenre (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  var secondaryGenre = req.swagger.params['secondaryGenre'].value;
  Media.patchMediaSecondaryGenre(mediaId,secondaryGenre)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchMediaPublisher = function patchMediaPublisher (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  var publisher = req.swagger.params['publisher'].value;
  Media.patchMediaPublisher(mediaId,publisher)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchMediaTitle = function patchMediaTitle (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  var title = req.swagger.params['title'].value;
  Media.patchMediaTitle(mediaId,title)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchMediaAlbum = function patchMediaAlbum (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  var album = req.swagger.params['album'].value;
  Media.patchMediaAlbum(mediaId,album)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchMediaArtist = function patchMediaArtist (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  var artist = req.swagger.params['artist'].value;
  Media.patchMediaArtist(mediaId,artist)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchMediaDuration = function patchMediaDuration (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  var msDuration = req.swagger.params['msDuration'].value;
  Media.patchMediaDuration(mediaId,msDuration)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchModificationDate = function patchModificationDate (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  var modificationDate = req.swagger.params['modificationDate'].value;
  Media.patchModificationDate(mediaId,modificationDate)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchPublishDate = function patchPublishDate (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  var modificationDate = req.swagger.params['publishDate'].value;
  Media.patchModificationDate(mediaId,publishDate)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchMediaLyrics = function patchMediaLyrics (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  var lyrics = req.swagger.params['lyrics'].value;
  Media.patchMediaLyrics(mediaId,lyrics)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchMediaInLanguages = function patchMediaInLanguages (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  var inLanguages = req.swagger.params['inLanguages'].value;
  Media.patchMediaInLanguages(mediaId,inLanguages)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchMediaPlaylistLinks = function patchMediaPlaylistLinks (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  var playlistLinks = req.swagger.params['playlistLinks'].value;
  Media.patchMediaPlaylistLinks(mediaId,playlistLinks)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchMediaPressArticleLinks = function patchMediaPressArticleLinks (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  var pressArticleLinks = req.swagger.params['pressArticleLinks'].value;
  Media.patchMediaPressArticleLinks(mediaId,pressArticleLinks)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchMediaSocialMediaLinks = function patchMediaSocialMediaLinks (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  var socialMediaLinks = req.swagger.params['socialMediaLinks'].value;
  Media.patchMediaSocialMediaLinks(mediaId,socialMediaLinks)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.patchMediaStreamingServiceLinks = function patchMediaStreamingServiceLinks (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  var streamingServiceLinks = req.swagger.params['streamingServiceLinks'].value;
  Media.patchMediaStreamingServiceLinks(mediaId,streamingServiceLinks)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.postMedia = function postMedia (req, res, next) {
  var body = req.swagger.params['body'].value;
  Media.postMedia(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateMedia = function updateMedia (req, res, next) {
  var mediaId = req.swagger.params['mediaId'].value;
  var body = req.swagger.params['body'].value;
  Media.updateMedia(mediaId,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
