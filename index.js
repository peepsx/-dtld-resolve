import { Lookup } from '@dtld/lookup';
import { EventEmitter } from 'events';
var Promise = require('promise');


// Global constants for distributed error page keys (dDrive keys)
const DWEB_NO_DOMAIN_HASH = null; //800 error
const DWEB_BAD_KEY_HASH = null; // 801 error
const DWEB_BAD_DOMAIN_HASH = null; // 802 error

// Regular expressions for two or three-level domains (peepsx.dcom and www.peepsx.dcom)
const THREE_LEVEL_REGEX = /^[a-z][a-z0-9-]+[a-z0-9]\.[a-z][a-z0-9-]+a-z0-9]+(?:\.dcom|\.dnet|\.dorg|\.dgov|\.follow|\.dweb|\.dinfo)/i;
const TWO_LEVEL_REGEX = /^[a-z][a-z0-9-]+[a-z0-9](?:\.dcom|\.dnet|\.dorg|\.dgov|\.follow|\.dweb|\.dinfo)/i;

// Regular Expression patterns for the dWeb protocol and dWeb keys
const DWEB_PROTOCOL_REGEX = /^dweb:\/\//i;
const DWEB_HASH_REGEX = /^[0-9a-f]{64}?$/i;

// TODO: Fix DRY code
class Resolve extends EventEmitter {
  constructor(dtld) {
    super();
    this.dtld = dtld;
  }
  
  getKey() {
    let search = this;
    let name = search.dtld;
    return new Promise( (resolve, reject) => {
      //remove dWeb protocol prefix from domain (if exists)
      if(name.test(DWEB_PROTOCOL_REGEX)) {
        name = name.replace(DWEB_PROTOCOL_REGEX, "");
      }
      let convertDomain = name.toLowerCase();
      let parsedDomain = convertDomain.split(".");
      if(name.test(THREE_LEVEL_REGEX) && parsedDomain.length === 3) {
        //separate record name and domain into different definitions
        let record_name = parsedDomain[0], domain_key = parsedDomain[1], dtld_type = parsedDomain[2];
        let domain = domain_key + "." + dtld_type;
        // Lookup domain and record_name on ARISEN
        let lookup = new Lookup(domain, record_name);
        lookup.on('found', key => {
          if (key.test(DWEB_HASH_REGEX)) {
            search.emit('resolved', key);
            return resolve();
          }  else if (!key.test(DWEB_HASH_REGEX)) {
            search.emit('801', DWEB_BAD_KEY_HASH);
            return reject(new Error("Resolved dWeb key is not a valid dWeb key."));
          }
        });
        lookup.on('none', () => {
          search.emit('800', DWEB_NO_DOMAIN_HASH);
          return reject(new Error("dTLD or record for dTLD does not exist."));
        });
        lookup.go()
          .then( () => console.log("Key resolved successfully"))
          .catch( err => {
            console.error(err.message);
          });
      }  else if (name.test(TWO_LEVEL_REGEX) && parsedDomain.length === 2) {
        //two-level dTLDs always have "root" as the record name
        let record_name = "root", domain_key = parsedDomain[0], dtld_type = parsedDomain[1];
        let domain = domain_key + "." + dtld_type;
        // Lookup dWeb key by domain and "root" record on ARISEN
        let lookup = new Lookup(domain, record_name);
        lookup.on('found', key => {
          if (key.test(DWEB_HASH_REGEX)) {
            search.emit('resolved', key);
            return resolve();
          }  else if (!key.test(DWEB_HASH_REGEX)) {
            search.emit('801', DWEB_BAD_KEY_HASH);
            return reject(new Error("Resolved dWeb key is not a valid dWeb key."));
          }
        }); // end found listener
        lookup.on('none', () => {
          search.emit('800', DWEB_NO_DOMAIN_HASH);
          return reject(new Error("dTLD or record does not exist."));
        });
        lookup.go()
          .then( () => console.log("Key resolved successfully"))
          .catch( err => {
            console.error(err.message);
          });
      } else if (!name.test(THREE_LEVEL_REGEX) && (!name.test(TWO_LEVEL_REGEX))) {
        search.emit('802', DWEB_BAD_DOMAIN_HASH);
        return reject(new Error("Domain is not a valid two or three-level domain."));
      } else {
        return reject(new Error("Unknown error."));
      }
    }); //end returned Promise
  } // end getKey method
} // end Resolve class

export default Resolve;