# @dtld/resolve
This library is used for parsing a decentralized top-level domain (dTLD) and resolving its [dWeb](https://dwebx.org) key via the [ARISEN](https://arisen.network) global computer, using the [dNames Contract](https://github.com/peepsx/dnames-contract).

The @dtld suite brings to life developer tools for interacting with dTLDs on the dWeb like .dcom, .dnet, .dorg and .dweb.

## Usage
var getDWebKey = require('@dtld/resolve');

// Retrieve dWeb key for "peepsx.dcom"
var dtld = "peepsx.dcom";
var dweb_key = getDWebKey(dtld);

// Show dWeb Key
console.log(dweb_key);

## The dTLD Suite
- [@dtld/lookup](https://github.com/peepsx/dtld-lookup) - Library for performing lookups in the "dnames" database on ARISEN.
- [@dtld/cli](https://github.com/peepsx/dtld-cli) - Perform dTLD lookups via the command-line.
- [@dtld/core](https://github.com/peepsx/dtld-core) - Used for adding, modifying and deleting dTLD records via ARISEN.

## Author
This library was written on notebook paper by Jared Rice Sr. from his jail cell and trascribed on GitHub by [Shikhar S.](mailto:shikhar@peepsx.com).

## LICENSE
[MIT](LICENSE.md)

## Copyright
Copyright 2020 PeepsLabs. All rights reserved.