var lookup = require('@dtld/lookup');
var events = require('events');
var debug = require('debug')('dtld-resolve');

// Keys for distributed error pages (dDrive keys)
var DWEB_BAD_DOMAIN_HASH = null; // 800 error
var DWEB_BAD_KEY_HASH = null; // 801 error
var DWEB_FAIL_HASH = null; // 802 error

// Validation for two-level and three-level domains (peepsx.dcom and www.peepsx.dcom)
var TWO_LEVEL_REGEX = /^(([a-zA-Z0-9]\\.)|([a-zA-Z0-9][-a-zA-Z0-9]{0,62}[a-zA-Z0-9]\\.) ?)[a-zA-Z0-9]{2,6}$/;
var THREE_LEVEL_REGEX = /^(([a-zA-Z0-9]\\.)|(a-zA-Z0-9][-a-zA-Z0-9]{0,62}[a-zA-Z0-9]\\.){2})[a-zA-Z0-9]{2,6}$/;

// Validation for dWeb keys
var DWEB_HASH_REGEX = /^[0-9a-f]{64}?$/i;

module.exports = ResolveDWebKey;

function ResolveDWebKey(dtld) {
    var convertDomain = dtld.toLowerCase(); // convert dTLD to lowercase string
    var parsedDomain = convertDomain.split("."); // create array of dTLD segments between periods
    // if dTLD array has 3 elements and dTLD matches three-level domain regex
    if ( dtld === THREE_LEVEL_REGEX && parsedDomain.length === 3 ) {

        //separate record_name and domain into different variables 
        var record_name = parsedDomain[0];
        var domain_key = parsedDomain[1];
        var dtld_type = parsedDomain[2];
        var domain = domain_key + "." + dtld_type;
        
        // lookup dWeb key by domain and record_name on ARISEN
        var dweb_key = lookup(domain, record_name);

        if ( dweb_key === false ) {
            return DWEB_BAD_DOMAIN_HASH;
        }
        else if ( dweb_key === DWEB_HASH_REGEX ) {
            return dweb_key;
        }
        else if ( dweb_key != DWEB_HASH_REGEX ) {
            return DWEB_BAD_KEY_HASH;
        }
        else {
            return DWEB_FAIL_HASH;
        }
    }
    else if ( dtld === TWO_LEVEL_REGEX && parsedDomain.length === 2 ) {
        //get domain
        var record_name = "root"; // two-level dTLDs always use "root" record names
        var domain_key = parsedDomain[0];
        var dtld_type = parsedDomain[1];
        var domain = domain_key + "." + dtld_type;

        // lookup dWeb key by domain and record_name on ARISEN
        var dweb_key = lookup(domain, record_name);

        if (  dweb_key === false ) {
            return DWEB_BAD_DOMAIN_HASH;
        }
        else if ( dweb_key === DWEB_HASH_REGEX ) {
            return dweb_key;
        }
        else if ( dweb_key != DWEB_HASH_REGEX ) {
            return DWEB_BAD_KEY_HASH;
        }
        else {
            return DWEB_FAIL_HASH;
        }
    }
    else {
        // Must be a bad domain or invalid domain - return bad domain hash
        return DWEB_BAD_DOMAIN_HASH;
    }
}