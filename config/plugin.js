'use strict';

// had enabled by egg
// exports.static = true;
exports.cors = {
    enable: true,
    package: 'egg-cors',
};
exports.security = false;

exports.mysql = {
  enable: true,
  package: 'egg-mysql',
};

exports.dingtalkRobot = {
  enable: true,
  package: 'egg-dingtalk-robot',
};