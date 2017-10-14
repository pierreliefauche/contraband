'use strict';

exports.isReqSecure = function isSecure(req) {
  // Check the trivial case first.
  if (req.secure) {
    return true;
  }
  // Check for forwarded protocol header.
  // This is typical for AWS.
  if (req.get('x-forwarded-proto')) {
    return req.get('x-forwarded-proto') === 'https';
  }
  // Check if we are behind Application Request Routing (ARR).
  // This is typical for Azure.
  if (req.get('x-arr-log-id')) {
    return typeof req.get('x-arr-ssl') === 'string';
  }
  return false;
};
